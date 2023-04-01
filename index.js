const fs = require('fs');
const path = require('path');

const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');


const songLength = 97; // in seconds
const songLengthInMilliseconds = songLength * 1000; // in seconds

const width = 900;
const height = 720;
 
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

const imageFiles = fs.readdirSync('./images/').filter(file => {
  return (
    path.extname(file).toLowerCase() === ".png"
    || path.extname(file).toLowerCase() === ".jpg"
  );
});

const imageFilesLength = imageFiles.length;
const delayForEachImage = songLengthInMilliseconds / imageFilesLength;

const encoder = new GIFEncoder(width, height);
encoder.createReadStream().pipe(fs.createWriteStream('./output/result.gif'));
encoder.start();
encoder.setRepeat(0);
encoder.setDelay(delayForEachImage);
encoder.setQuality(10);
 

console.log(imageFiles.length + " Image files found.")
console.log("Delay for each image: " + delayForEachImage + "ms");
console.log("Total length of GIF: " + (delayForEachImage * imageFilesLength) + "ms");
console.log("Desired length of GIF: " + songLengthInMilliseconds + "ms");
console.log("Starting to add frames to GIF.");
imageFiles.forEach(async (f, i) => {
    const image = await loadImage(`./images/${f}`);
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
    encoder.addFrame(ctx);
    if (i == (imageFiles.length - 1)) {
      console.log("Processing Result. Please Wait.");
      encoder.finish();
    }
});