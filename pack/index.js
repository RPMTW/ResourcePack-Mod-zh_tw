const axios = require("axios")
const request = require("request");
const fs = require("fs");
const path = require("path");
const compressing = require('compressing');
const pump = require("pump")

const abc = {
    targetLanguageIds: [
        "zh-TW"
    ],
    branchId: 738,
    skipUntranslatedStrings: true
}
console.log("取得下載連結中...");
axios.post("https://api.crowdin.com/api/v2/projects/442446/translations/builds", abc, {
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': abc.length,
        'Authorization': `Bearer ${process.env.Crowdin_Token}`
    }
}).then(res => {
    if (res.data.data.status === "finished") {
        console.log("成功取得下載連結")
        let Build_ID = res.data.data.id
        axios.get(`https://api.crowdin.com/api/v2/projects/442446/translations/builds/${Build_ID}/download`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.Crowdin_Token}`
            }
        }).then(res => {
            console.log("資源包下載中...");
            let Build_URL = res.data.data.url
            let stream = fs.createWriteStream(path.join("./Resourcepack", "RPMTW-1.16.zip"));
            request(Build_URL).pipe(stream).on("close", function (err) {
                console.log("資源包下載完成");
                console.log("解壓縮資源包中...");
                compressing.zip.uncompress(`./Resourcepack/RPMTW-1.16.zip`, "./temp/RPMTW-1.16").then(() => compressing_done())
                function compressing_done() {
                    console.log("資源包解壓縮完成")
                    console.log("開始複製資源檔案")

                    const zipStream = new compressing.zip.Stream();
                    zipStream.addEntry("./temp/RPMTW-1.16/assets");
                    zipStream.addEntry("./Resource/pack.png");
                    zipStream.addEntry("./Resource/pack.mcmeta");

                    zipStream
                        .pipe(fs.createWriteStream("./Resourcepack/RPMTW-1.16-Done.zip"))
                        console.log("完成壓縮資源包", "\n腳本流程執行結束，準備開始發布Github Releases。")

                    const destStream = fs.createWriteStream("./Resourcepack/RPMTW-1.16-Done.zip");
                    pump(zipStream, destStream)
                }
            })
        })
    }
})