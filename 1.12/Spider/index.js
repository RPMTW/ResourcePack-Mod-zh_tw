const fetch = require('node-fetch');
const fs = require("fs");
const path = require("path");
const config = require(`${process.cwd()}/config.json`)
const compressing = require('compressing');
const { GetModID } = require("./Module/GetModID");
const { MCVersion } = require("./Module/MCVersion");
const ver = config.ver;
const modCount = config.modCount;
const CurseForge = require("mc-curseforge-api");
const urllib = require('urllib');

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
            if (MCVersion(data)) {
                fileID = String(files[i].id);
                fileName = String(files[i].download_url.split("https://edge.forgecdn.net/files/")[1].replace("/", "").split("/")[1]);
                slug = fileName.split(".jar")[0];
                urllib.request(files[i].download_url, {
                    streaming: true,
                    followRedirect: true,
                })
                    .then(result => {
                        console.log(`${fileName.split(".jar")[0]} 下載完成。`);
                        compressing.zip.uncompress(result.res, "../jar/" + slug)
                    })
                    .then(() => {
                        console.log(`${fileName.split(".jar")[0]} 解壓縮完成。`)
                        GetModID(slug, ID, fileName)
                    })
                    .catch(console.error);
                break;
            }
        }
    }).catch(console.error);
}