const fs = require("fs");
const path = require("path");
const config = require(`${process.cwd()}/config.json`)
const compressing = require('compressing');
const CurseForge = require("mc-curseforge-api");
const { GetModID } = require("./Module/GetModID");
const { MCVersion } = require("./Module/MCVersion");
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
    CurseForge.getModFiles(Number(ID)).then((files) => {
        files = files.reverse();
        files.sort(function (a, b) {
            return Date.parse(b.timestamp) - Date.parse(a.timestamp);
        });
        for (let i = 0; i < files.length; i++) {
            let data = files[i].minecraft_versions;
            if (MCVersion(data)) {
                fileID = String(files[i].id);
                fileName = String(files[i].download_url.split("https://edge.forgecdn.net/files/")[1].replace("/", "").split("/")[1]);
                slug = fileName.split(".jar")[0];
                urllib.request(files[i].download_url, {
                    streaming: true,
                    followRedirect: true,
                    timeout: [100000, 100000],
                })
                    .then(result => {
                        console.log(`${fileName.split(".jar")[0]} 下載完成。`);
                        compressing.zip.uncompress(result.res, "../jar/" + slug).then(() => {
                            console.log(`${fileName.split(".jar")[0]} 解壓縮完成。`)
                            GetModID(slug, ID, fileName)
                        })
                    })
                    .catch("解壓縮模組檔案時發生未知錯誤: ", console.error);
                break;
            }
        }
    }).catch("抓取模組檔案時發生未知錯誤: ", console.error);
}
