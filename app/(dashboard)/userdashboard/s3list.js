"use server"

const { S3Client, ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
require('dotenv').config();

// Specify your AWS region
const region = process.env.AWS_BUCKET_REGION;

const key = {
  accessKeyId:  process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
}
// Create S3 client with region
const s3Client = new S3Client({
  region,
  credentials: key,
});


export const getDirectories = async (selectedChart, username) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Delimiter: "/",
    Prefix: `${username}/${selectedChart}/`,
  };

  try {
    const data = await s3Client.send(new ListObjectsV2Command(params));
    const directories = data.CommonPrefixes.map(
      (prefix) => prefix.Prefix.split("/")[2]
    );
    return directories;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getCSVFileFromDirectory = async (directoryPath, selectedChart, username) => {
  const listParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: `${username}/${selectedChart}/${directoryPath}/`,
    Delimiter: "/",
  };

  try {
    const data = await s3Client.send(new ListObjectsV2Command(listParams));
    const csvObject = data.Contents.find((obj) => obj.Key.endsWith(".csv"));
    if (!csvObject) {
      throw new Error("No CSV file found in the specified directory.");
    }
    const csvFilePath = csvObject.Key;
    return csvFilePath.split("/")[3]
  } catch (err) {
    throw new Error(err.message);
  }
};


export const getCharts = async (username) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Delimiter: "/",
      Prefix: `${username}/`,
    };
  
    try {
      const data = await s3Client.send(new ListObjectsV2Command(params));
      const charts = data.CommonPrefixes.map(
        (prefix) => prefix.Prefix.split("/")[1]
      );
      // console.log(JSON.stringify(directories))
      return charts;
    } catch (err) {
      throw new Error(err.message);
    }
  };


// (async () => {
//     try {
//         const result = await getCharts();
//         console.log('Result:', result);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();

    // (async () => {
    //   try {
    //     const directoryPath = "Akash Butala/Line Chart/Most Bought Brand/";
    //     const csvFile = await getCSVFileFromDirectory(directoryPath);
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // })();
