const fs = require("fs");
const path = require("path");
const request = require("request");
const config = require(`${process.cwd()}/config.json`)
const compressing = require('compressing');
const CurseForge = require("mc-curseforge-api");
const {GetModID} = require("./Module/GetModID");
const {
    parse,
} = require('comment-json')

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
        aaa()
    })

    function aaa() {
        for (let i = 0; i < ModList.length; i++) {
            let slug, fileID, fileName;
            CurseForge.getModFiles(ModList[i].projectID).then((files) => {
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
                        try {
                            files[i].download(test, true).then(r => {
                                console.log(`${fileName} 下載完成。`);
                                compressing.zip.uncompress(`./mod/${fileName}`, "../jar/" + slug).then(() => GetModID(slug, ModList[i].projectID, fileName))
                            });
                        } catch (err) {
                            console.log("發生未知錯誤 \n" + err);
                        }
                        break;
                    }
                }
            });
        }
    }
}