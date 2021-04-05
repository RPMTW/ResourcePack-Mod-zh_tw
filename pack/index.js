const fs = require("fs");
const path = require("path");
const compressing = require('compressing');
const pump = require("pump")

const zipStream = new compressing.zip.Stream();
zipStream.addEntry(path.join("../zh-TW/assets"));
zipStream.addEntry(path.join("../Add-on/assets"));
zipStream.addEntry(path.join("../zh-TW/pack.png"));
zipStream.addEntry(path.join("../zh-TW/pack.mcmeta"));

zipStream
    .pipe(fs.createWriteStream(path.join("../RPMTW-1.16.zip")))

const destStream = fs.createWriteStream(path.join("../RPMTW-1.16.zip"));
pump(zipStream, destStream);
console.log("完成壓縮RPMTW資源包", "\n腳本流程執行結束，準備開始發布Github Releases。")