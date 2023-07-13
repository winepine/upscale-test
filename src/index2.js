const fs = require("fs");
const path = require("path");
const base64 = require("base64-js");

// API credentials
const API_KEY = "RrYReMORrejwOIhzUrV6bjwiFYKHYlzBQHFBKPXX";

// Read and encode the image file as base64
const imageFilePath = "./original.png";
const imageBuffer = fs.readFileSync(imageFilePath);
const base64Image = base64.fromByteArray(imageBuffer);
console.log(base64Image);

return;
// File details
const fileData = {
  filename: "henry.jpg",
  data: base64Image,
};

// Make the API request to add the file to the library
const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

(async () => {
  try {
    const { default: fetch } = await import("node-fetch");
    const response = await fetch("https://api.printful.com/files", {
      method: "POST",
      headers,
      body: JSON.stringify(fileData),
    });

    if (response.status === 200) {
      console.log("File added to the library successfully!");
    } else {
      console.log("Failed to add the file to the library.");
    }

    const data = await response.json();
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
})();
