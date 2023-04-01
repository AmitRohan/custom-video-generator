const { promisify } = require('util');
const fs = require('fs');
const convert = require('heic-convert');
const path = require('path');
 
const imgList = fs.readdirSync('./images/');
const heicFiles = imgList.filter(file => {
    return path.extname(file).toLowerCase() === ".heic";
});
const convertHeicToPng = async (fileName) => {
    try{
        const inputBuffer = await promisify(fs.readFile)('./images/'+fileName);
        const outputBuffer = await convert({
            buffer: inputBuffer, // the HEIC file buffer
            format: 'PNG'        // output format
        });
        const newName = fileName.replace('.HEIC', '.PNG');
        await promisify(fs.writeFile)('./converted/'+newName, outputBuffer);
    } catch (e) {
        console.log(e);
    }
}

heicFiles.forEach(async (f, i) => {
    convertHeicToPng(f);
});