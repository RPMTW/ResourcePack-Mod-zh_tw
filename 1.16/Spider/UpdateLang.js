const fs = require("fs");
const {
    parse,
    stringify
} = require('comment-json')
const path = require("path");

let CurseForgeIndex = parse(fs.readFileSync(`${process.cwd()}/../CurseForgeIndex.json`).toString(), null, true);

var keys = Object.keys(CurseForgeIndex);

for await(CurseID of keys) {
    DownloadModByCurseID(CurseID);
}

function DownloadModByCurseID(ID) {
    CurseForge.getModFiles(Number(ID)).then((files) => {
        files = files.reverse();
        files.sort(function (a, b) {
            return Date.parse(b.timestamp) - Date.parse(a.timestamp);
        });
        for (let i = 0; i < files.length; i++) {
            let data = files[i].minecraft_versions;
            if (data.includes(config.ver) || data.includes("1.16.4") || data.includes("1.16.3") || data.includes("1.16.2") || data.includes("1.16.1") || data.includes("1.16")) {
                fileID = String(files[i].id);
                fileName = String(files[i].download_url.split("https://edge.forgecdn.net/files/")[1].replace("/", "").split("/")[1]);
                let test = path.join(ModDirPath, fileName);
                slug = fileName.split(".jar")[0];
                try {
                    files[i].download(test, true).then(r => {
                        console.log(`${fileName} 下載完成。`);
                        compressing.zip.uncompress(`./mod/${fileName}`, "../jar/" + slug).then(() => GetModID(slug, ID, fileName))
                    });
                } catch (err) {
                    console.log("發生未知錯誤 \n" + err);
                }
                break;
            }
        }
    });
}