const fs = require("fs");
const path = require("path");
const config = require(`${process.cwd()}/config.json`)
const compressing = require('compressing');
const CurseForge = require("mc-curseforge-api");
const {GetModID} = require("./Module/GetModID");
require('dotenv').config();
let ID = process.env.ModID;

let ModDirPath = path.join(__dirname, "mod");
if (!fs.existsSync(ModDirPath)) {
    fs.mkdirSync(ModDirPath);
}
if (!fs.existsSync(path.join(__dirname, "../assets"))) {
    fs.mkdirSync(path.join(__dirname, "../assets"));
}

let slug, fileID, fileName;
CurseForge.getModFiles(Number(ID)).then((files) => {
    for (let i = 0; i < files.length; i++) {
        let data = files[i].minecraft_versions;
        if (data.includes(config.ver)) {
            fileID = String(files[i].id);
            fileName = String(files[i].download_url.split("https://edge.forgecdn.net/files/")[1].split(`${fileID.substr(0, 4)}/${fileID.substr(4, 7)}/`)[1]);
            if (fileName === "undefined") {
                fileName = String(files[i].download_url.split("https://edge.forgecdn.net/files/")[1].split(`${fileID.substr(0, 4)}/${fileID.substr(5, 7)}/`)[1]);
            }
            let test = path.join(ModDirPath, fileName);
            slug = fileName.split(".jar")[0];
            try {
                files[i].download(test, true).then(() => {
                    console.log(`${fileName.split(".jar")[0]} 下載完成。`);
                    compressing.zip.uncompress(`./mod/${fileName}`, "../jar/" + slug).then(() => GetModID(slug, ID, fileName));
                });
            } catch (err) {
                console.log("發生未知錯誤 \n" + err);
            }
            break;
        }
    }
});
