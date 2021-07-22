const fs = require("fs");
const path = require("path");
const request = require("request");
const config = require(`${process.cwd()}/config.json`)
const compressing = require('compressing');
const CurseForge = require("mc-curseforge-api");
const { GetModID } = require("./Module/GetModID");
const { MCVersion } = require("./Module/MCVersion");
const {
    parse,
} = require('comment-json')
const urllib = require('urllib');

let ModDirPath = path.join(__dirname, "mod");
if (!fs.existsSync(ModDirPath)) {
    fs.mkdirSync(ModDirPath);
}
if (!fs.existsSync(path.join(__dirname, "../assets"))) {
    fs.mkdirSync(path.join(__dirname, "../assets"));
}


let ModList;
for (let k = 0; k < 1; k++) {
    let url = config.ModpackListUrl;
    let stream = fs.createWriteStream(path.join("ModList.json"));
    request(url).pipe(stream).on("close", function () {
        ModList = Array(parse(fs.readFileSync("ModList.json").toString()).files)[0];
        console.log(`準備開始處理模組包語系檔案，全部共有 ${ModList.length - 1} 個模組，開始處理中。`);
        Run()
    })

    function Run() {
        for (let i = 0; i < ModList.length; i++) {
            let slug, fileID, fileName;
            CurseForge.getModFiles(ModList[i].projectID).then((files) => {
                for (let i = 0; i < files.length; i++) {
                    files = files.reverse();
                    files.sort(function (a, b) {
                        return Date.parse(b.timestamp) - Date.parse(a.timestamp);
                    });
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
                                compressing.zip.uncompress(result.res, "../jar/" + slug)
                            })
                            .then(() => {
                                console.log(`${fileName.split(".jar")[0]} 解壓縮完成。`)
                                GetModID(slug, ModList[i].projectID, fileName)
                            })
                            .catch(console.error);
                        break;
                    }
                }
            });
        }
    }
}