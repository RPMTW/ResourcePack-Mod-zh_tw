const httpRequest = require('https');
const fs = require("fs");
const path = require("path");
const request_one = require("request");
const config = require(`${process.cwd()}/config.json`)
const compressing = require('compressing');

const ver = config.ver;
const modCount = config.modCount;

const options = {
    method: 'GET',
};
const request = httpRequest.request(`https://addons-ecs.forgesvc.net/api/v2/addon/search?categoryId=0&gameId=432&index=0&pageSize=${modCount}&gameVersion=${ver}&sectionId=6&sort=1"`, options, response => {
    let responseData = '';
    response.on('data', dataChunk => {
        responseData += dataChunk;
        try {
            responseData = JSON.parse(responseData);
        } catch (err) {
        }
    });
    request.on('error', error => console.log(error))

    let dirPath = path.join(__dirname, "mod");
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        console.log("資料夾創建成功");
    }
    response.on('end', () => {
        for (let i = 0; i < modCount; i++) {
            let downloadUrl = ""
            let fileName = ""
            fileName = responseData[i].gameVersionLatestFiles[0].projectFileName
            let fileID = String(responseData[i].gameVersionLatestFiles[0].projectFileId)
            downloadUrl = `https://edge.forgecdn.net/files/${fileID.substr(0, 4)}/${fileID.substr(4, 7)}/${fileName}`
            for (let k = 0; k < 1; k++) {
                let url = downloadUrl;
                let stream = fs.createWriteStream(path.join(dirPath, fileName));
                request_one(url).pipe(stream).on("close", function (err) {
                    console.log("模組: " + responseData[i].name + "下載完成" + "(" + String(i / modCount * 100).substr(0, 2) + "%)");
                    let dirPath = path.join(__dirname, "../assets/" + responseData[i].slug + "/lang");
                    if (!fs.existsSync(dirPath)) {
                        fs.mkdirSync(dirPath);
                    }
                    compressing.zip.uncompress(`./mod/${fileName}`, "../jar/" + responseData[i].slug)
                    setTimeout(function () {
                        let dirPath_2 = path.join(__dirname, "../jar/" + responseData[i].slug + "/assets/lang");
                        if (!fs.existsSync(dirPath_2)) return
                        // let dirPath = path.join(__dirname, "../jar/" + responseData[i].slug + "/assets/lang/en_us.json");
                        fs.copyFile("../jar/" + responseData[i].slug + "/assets/lang/en_us.json", "../assets/" + responseData[i].slug + "/lang/en_us.json", (err) => {
                            if (err) throw err;
                        })
                    }, 5000)
                    //   path.resolve(__dirname, "../jar/" + responseData[i].slug)
                })
                request.on('error', error => console.log(error))
                request.end();
            }
        }
        request.on('error', error => console.log(error))
        request.end();
    });
});
request.on('error', error => console.log(error))
request.end();
