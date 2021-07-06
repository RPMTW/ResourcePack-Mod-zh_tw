const fetch = require('node-fetch');
const fs = require("fs");
const path = require("path");
const config = require(`${process.cwd()}/config.json`)
const compressing = require('compressing');
const { GetModID } = require("./Module/GetModID");
const ver = config.ver;
const modCount = config.modCount;
const CurseForge = require("mc-curseforge-api");
const request = require("request");

let ModDirPath = path.join(__dirname, "mod");
if (!fs.existsSync(ModDirPath)) {
    fs.mkdirSync(ModDirPath);
}
if (!fs.existsSync(path.join(__dirname, "../assets"))) {
    fs.mkdirSync(path.join(__dirname, "../assets"));
}


for (let i = 0; i < modCount / 50; i++) {
    let pageSize = 50;
    if (parseInt(modCount / 50) == i) {
        pageSize = modCount % 50
    }
    GetMods(i, pageSize)
}

function GetMods(index, pageSize) {
    fetch(`https://addons-ecs.forgesvc.net/api/v2/addon/search?categoryId=0&gameId=432&index=${index}&pageSize=${pageSize}&gameVersion=${ver}&sectionId=6&sort=1"`, {
        method: "get",
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => res.json())
        .then(json => {
            for (let i = 0; i < pageSize; i++) {
                GetFile(json[i].id);
            }
        });
}

function GetFile(ID) {
    let slug, fileID, fileName;
    CurseForge.getModFiles(Number(ID)).then((files) => {
        files = files.reverse();
        files.sort(function (a, b) {
            return Date.parse(b.timestamp) - Date.parse(a.timestamp);
        });
        for (let i = 0; i < files.length; i++) {
            let data = files[i].minecraft_versions;
            if (data.includes(config.ver)) {
                fileID = String(files[i].id);
                fileName = String(files[i].download_url.split("https://edge.forgecdn.net/files/")[1].split(`${fileID.substr(0, 4)}/${fileID.substr(4, 7)}/`)[1]);
                if (fileName === "undefined") {
                    fileName = String(files[i].download_url.split("https://edge.forgecdn.net/files/")[1].split(`${fileID.substr(0, 4)}/${fileID.substr(5, 7)}/`)[1]);
                }
                let file = fs.createWriteStream(path.join(ModDirPath, fileName));
                slug = fileName.split(".jar")[0];
                request(files[i].download_url).pipe(file).on("close", function (err) {
                    if(err){
                        console.log("下載模組檔案時發生未知錯誤: " + err);
                    }
                    console.log(`${fileName.split(".jar")[0]} 下載完成。`);
                    compressing.zip.uncompress(`./mod/${fileName}`, "../jar/" + slug).then(() => GetModID(slug, ID, fileName));
                })
                break;
            }
        }
    }).catch(console.error);
}