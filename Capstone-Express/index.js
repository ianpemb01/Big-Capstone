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

// let mongoString = process.env.DATABASE_URL;

// mongoose.connect(mongoString);
// const database = mongoose.connection;

// database.once("connected", () => {
//   console.log("database connected");
// });

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

app.post("/upload", upload.single("image"), (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: Date.now() + "_" + req.file.originalname,
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
    // console.log(imageUrl);
  } catch (error) {
    console.error("Error generating image: ", error);
    res.status(error).json({ message: "Error generating image" });
  }
});

// const blobToArrayBuffer = (blob) => {
//     return blobToArrayBuffer = (blob) => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader()
//             reader.onloadend = () => resolve(reader.result)
//             reader.onerror = reject
//             reader.readAsArrayBuffer(blob)
//         })
//     }
// }

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
        Key: "testing2",
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

app.listen(3000);
