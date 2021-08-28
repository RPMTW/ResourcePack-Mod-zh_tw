const fs = require("fs");
const {
    parse,
    stringify
} = require('comment-json')
const path = require("path");
const CurseForge = require("mc-curseforge-api");
const compressing = require('compressing');
let CurseForgeIndex = parse(fs.readFileSync(`${process.cwd()}/../CurseForgeIndex.json`).toString(), null, true);
const { GetModID } = require("./Module/GetModID");
const { MCVersion } = require("./Module/MCVersion");
const urllib = require('urllib');

var values = Object.values(CurseForgeIndex);

let ModDirPath = path.join(__dirname, "mod");

if (!fs.existsSync(ModDirPath)) {
    fs.mkdirSync(ModDirPath);
}

(async function () {
    for await (let CurseID of values) {
        DownloadModByCurseID(CurseID);
    }
})();

async function DownloadModByCurseID(ID) {
    let Isget = false;
    await CurseForge.getModFiles(Number(ID)).then(async (files) => {
        try {
            files = files.reverse();
            files.sort(function (a, b) {
                return Date.parse(b.timestamp) - Date.parse(a.timestamp);
            });
            for (let i = 0; i < files.length; i++) {
                let data = files[i].minecraft_versions;
                if (MCVersion(data)) {
                    if (Isget == true) {
                        break;
                    };
                    Isget = true;
                    fileID = String(files[i].id);
                    fileName = String(files[i].download_url.split("https://edge.forgecdn.net/files/")[1].replace("/", "").split("/")[1]);
                    slug = fileName.split(".jar")[0];
                    try {
                        urllib.request(files[i].download_url, {
                            streaming: true,
                            followRedirect: true,
                            timeout: [100000, 100000],
                        })
                            .then(result => {
                                console.log(`${slug} 下載完成。`);
                                compressing.zip.uncompress(result.res, "../jar/" + slug).then(() => {
                                    console.log(`${slug} 解壓縮完成。`)
                                    GetModID(slug, ID, fileName)
                                }).catch((err) => console.log(err));
                            })
                    } catch (error) {
                        // console.log('下載模組失敗', error)
                    }
                    break;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }).catch((err) => console.log(err));
}