const express = require("express");
const path = require("path");
const fs = require("fs");
const Upscaler = require("upscaler/node");
const tf = require("@tensorflow/tfjs-node");

const app = express();

const upscaler = new Upscaler();
function Uint8ToBase64(u8Arr) {
  var CHUNK_SIZE = 0x8000; //arbitrary number
  var index = 0;
  var length = u8Arr.length;
  var result = "";
  var slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
}
app.get("/", async (req, res) => {
  const upscaledImage = await getUpscaledImage();
  const b64encoded = Uint8ToBase64(upscaledImage);
  console.log(typeof b64encoded);
  const response = await fetch("https://api.printful.com/files", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer RrYReMORrejwOIhzUrV6bjwiFYKHYlzBQHFBKPXX",
    },
    body: JSON.stringify({
      filename: "upscaledapi.png",
      data: b64encoded,
    }),
  });
  const data = await response.json();
  console.log(data);
  res.set("Content-Type", "image/png");
  res.write(upscaledImage, "binary");
  res.end(null, "binary");
});

app.listen(8080);

const getUpscaledImage = async () => {
  const file = fs.readFileSync(path.resolve(__dirname, "./upscaled_2x.png"));
  const image = tf.node.decodeImage(file, 3);
  const tensor = await upscaler.upscale(image, {
    patchSize: 64,
    padding: 6,
  });
  image.dispose();
  const upscaledTensor = await tf.node.encodePng(tensor);
  tensor.dispose();
  return upscaledTensor;
};
