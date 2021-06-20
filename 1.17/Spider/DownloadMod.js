const fs = require("fs");
const path = require("path");
const config = require(`${process.cwd()}/config.json`)
const compressing = require('compressing');
const CurseForge = require("mc-curseforge-api");
const { GetModID } = require("./Module/GetModID");
require('dotenv').config();

let slug, fileID, fileName;
let ModDirPath = path.join(__dirname, "mod");
if (!fs.existsSync(ModDirPath)) {
    fs.mkdirSync(ModDirPath);
}
if (!fs.existsSync(path.join(__dirname, "../assets"))) {
    fs.mkdirSync(path.join(__dirname, "../assets"));
}
let ID;
console.log("請輸入要下載語系檔案的模組 CurseForge 專案 ID")
require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
}).on('line', function (line) {
    ID = line;
    Run()
})
function Run() {
    CurseForge.getMod(Number(ID)).then((mod) => {
        let files = mod.latestFiles.reverse();
        for (let i = 0; i < files.length; i++) {
            files = files.reverse();
            files.sort(function (a, b) {
                return Date.parse(b.timestamp) - Date.parse(a.timestamp);
              });
            let data = files[i].minecraft_versions;
            if (data.includes(config.ver)) {
                fileID = String(files[i].id);
                fileName = String(files[i].download_url.split("https://edge.forgecdn.net/files/")[1].split(`${fileID.substr(0, 4)}/${fileID.substr(4, 7)}/`)[1]);
                if (fileName === "undefined") {
                    fileName = String(files[i].download_url.split("https://edge.forgecdn.net/files/")[1].split(`${fileID.substr(0, 4)}/${fileID.substr(5, 7)}/`)[1]);
                }
                let test = path.join(ModDirPath, fileName);
                slug = fileName.split(".jar")[0];
                files[i].download(test, true).then(() => {
                    console.log(`${fileName.split(".jar")[0]} 下載完成。`);
                    compressing.zip.uncompress(`./mod/${fileName}`, "../jar/" + slug).then(() => GetModID(slug, ID, fileName));
                }).catch((err) => {
                    console.log("發生未知錯誤: " + err);
                });
            }
            break;
        }
    });
}