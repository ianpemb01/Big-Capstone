import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
// import { Pool } from 'pg'
import jwt from "jsonwebtoken";
import cors from "cors";
import multer from "multer";
import S3 from "aws-sdk/clients/s3.js";
import axios from "axios";
import fetch from "node-fetch";
import fs, { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import mongoose from "mongoose";
import Model from "./models/schema.js";
import OpenAI from "openai";
import formidable from "formidable";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import mongoose from 'mongoose'
// require('dotenv').config()
// let express = require('express')
// let mongoose = require('mongoose')
// let bodyParser =require('body-parser')
// const Pool = require('pg').Pool
// const jwt = require('jsonwebtoken')
// const validateToken = require('./middleware/authmiddleware')
// const Model = require('./models/schema')
let app = express();
// const cors = require("cors");
// const multer = require('multer');
const router = express.Router();
// const {S3} = require('aws-sdk');
// const axios = require('axios');
// const fetch = require('node-fetch')
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_AUTH_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.once("connected", () => {
  console.log("database connected");
});

// const pool = new Pool({
//     user: 'ian',
//     host: 'localhost',
//     database: 'reddit',
//     password: 'password',
//     port: 5432
// })

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("Hi.");
});

// This CRUD call uploads a single image to my S3 bucket.

app.post("/upload", upload.single("image"), (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(data);
  });
});

// This CRUD call Gets all of the images loaded into the S3 bucket.

app.get("/gallery", async (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
  };

  s3.listObjectsV2(params, function (error, data) {
    if (error) {
      console.log(error);
    } else {
      const imageURLS = data.Contents.map((item) => {
        const url = s3.getSignedUrl("getObject", {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: item.Key,
        });
        return { url, ...item };
      });
      console.log(imageURLS);
      console.log(data);
      res.json(imageURLS);
    }
  });
});
// [
//     "https://ian-capstone-images.s3.amazonaws.com/1728500017420_11049416_864844486890771_1580412707_n.jpg?AWSAccessKeyId=AKIATG6MGE6M46S3FUVR&Expires=1728664243&Signature=whv2Dq4D1l1QZlTrEUSRZupYeoQ%3D",
//     "https://ian-capstone-images.s3.amazonaws.com/1728663264286_20240702_210355.jpg?AWSAccessKeyId=AKIATG6MGE6M46S3FUVR&Expires=1728664243&Signature=Ozwia6C1vqKyyogvLFRA1AGtYOE%3D"
// ]

// This allows to load a component for an individual image.

app.get("/image/:key", async (req, res) => {
  const { key } = req.params;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
  };

  s3.listObjectsV2(params, function (error, data) {
    if (error) {
      console.log(error);
    } else {
      const singleImage = s3.getSignedUrl("getObject", {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      });
      res.json(singleImage);
    }
  });
});

// This uploads a prompt to produce an AI generated image.

app.post("/ask-openai", async (req, res) => {
  const { prompt } = req.body;
  console.log(prompt);
  // const params = {
  //     method: 'POST',
  //     headers:{
  //         'Authorization': `Bearer ${process.env.OPEN_AI_AUTH_KEY}`,
  //         'Content-Type': 'application/json'
  //     },
  //     body:JSON.stringify({
  //         model: 'dall-e-3',
  //         prompt: prompt,
  //         n:1,
  //         size: '1024x1024'})
  // }
  // fetch('https://api.openai.com/v1/images/generations', params)
  // .then(response => response.json())
  // .then(json =>{
  //     console.log(json)
  // });
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_AUTH_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const imageUrl = response.data.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image: ", error);
    res.status(error).json({ message: "Error generating image" });
  }
});

// This saves a image that has just be generated.

app.post("/save-image", async (req, res) => {
  console.log(req.body.URL);
  await fetch(req.body.URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch the image. Status code: ${response.status}`
        );
      }
      return response.buffer();
    })
    .then((imageBuffer) => {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.body.Key,
        Body: imageBuffer,
        // ContentType: req.file.mimetype
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        res.status(200).send(data);
      });
    })
    .catch((error) => {
      console.error("Error fetching the image:", error);
    });
});

// This allows an image to be deleted from the S3 bucket.

app.delete("/image/delete/:dog", async (req, res) => {
  const key = req.params.dog;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  s3.deleteObject(params, function (error, data) {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  res.status(200).send("File has been deleted successfully");
});

app.post(
  "/edit-openai/:prompt",
  // upload.fields([{ name: "imageOne" }, { name: "imageTwo" }]),
  async (req, res) => {
    const form = formidable({ uploadDir: __dirname });
    let one = ''
    let two = ''
    form.on('fileBegin', function(formname, file) {
      //rename the incoming file to the file's name
      file.newFilename = file.originalFilename
      console.log({file})
          file.filepath = __dirname + '/' + file.originalFilename
          if (formname === 'imageOne'){
            one = file.originalFilename
          } else if(formname === 'imageTwo'){
            two = file.originalFilename
          }
          
    form.emit('data', { name: 'fileBegin', formname, value: file }); 
  });

    form.parse(req, async (_err, body, files) => {
      console.log(one)
      console.log(two)
      const five = body.prompt[0]
      console.log({five})
      try {
        const image = await openai.images.edit(
          {
            model: "dall-e-2",
            image: fs.createReadStream(one),
            mask: fs.createReadStream(two),
            prompt: five,
            n: 1,
            size: "1024x1024",
            response_format: "url",
          }
          
        );
        fs.unlinkSync(one),
        fs.unlinkSync(two)
        const imageUrl = image.data[0].url;
        console.log({ imageUrl });
        res.json({ imageUrl });
        // console.log(imageUrl);
      } catch (error) {
        console.error("Error generating image: ", error.response);
        res.status(error).json({ message: "Error generating image" });
      }
    });
  }
);

app.post("/newImage", async (req, res) => {
  let URLS = req.body.url;
  let timeCreated = req.body.timeCreated;
  let prompt = req.body.prompt;

  const data = new Model({
    url: URLS,
    timeCreated: timeCreated,
    prompt: prompt,
  });

  try {
    const saveData = await data.save();
    res.send(saveData);
    console.log("Successfully posted");
  } catch (error) {
    console.log(error);
  }
});

app.get("/temp-urls", async (req, res) => {
  try {
    const data = await Model.find();
    console.log(data);
    res.send(data);
  } catch {
    console.log(error);
  }
});

app.listen(3000);
