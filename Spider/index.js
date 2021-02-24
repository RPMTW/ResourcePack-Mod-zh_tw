const httpRequest = require('https');
const fs = require("fs");
const path = require("path");
const request_one = require("request");
const config = require(`${process.cwd()}/Spider/config.json`)
const compressing = require('compressing');
const toml = require('toml');
const concat = require('concat-stream');

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

        let dirPath = path.join(__dirname, "/mod");
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        let dirPath_9 = path.join(__dirname, "assets");
        if (!fs.existsSync(dirPath_9)) {
            fs.mkdirSync(dirPath_9);
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
                            compressing.zip.uncompress(`./Spider/mod/${fileName}`, "jar/" + responseData[i].slug).then(() => compressing_done())

                            function compressing_done() {
                                console.log(`模組: ${responseData[i].name} 解壓縮完畢`)
                                let mod_id = "";
                                let dirPath_2 = path.join(__dirname, `jar/${responseData[i].slug}/META-INF/mods.toml`);
                                let dirPath_3 = path.join(__dirname, `jar/${responseData[i].slug}/mcmod.info`);
                                let dirPath_6 = path.join(__dirname, `.jar/${responseData[i].slug}/fabric.mod.json`);
                                if (fs.existsSync(dirPath_2)) {
                                    fs.createReadStream(`../jar/${responseData[i].slug}/META-INF/mods.toml`, 'utf8').pipe(concat(function (data, err) {
                                        mod_id = JSON.parse(JSON.stringify(toml.parse(data))).mods[0].modId
                                        mod_assets(mod_id);
                                    }));
                                } else if (fs.existsSync(dirPath_3)) {
                                    fs.createReadStream(`../jar/${responseData[i].slug}/mcmod.info`, 'utf8').pipe(concat(function (data, err) {
                                        mod_id = JSON.parse(data)[0].modid;
                                        mod_assets(mod_id);
                                    }));
                                } else if (fs.existsSync(dirPath_6)) {
                                    fs.createReadStream(`../jar/${responseData[i].slug}/fabric.mod.json`, 'utf8').pipe(concat(function (data, err) {
                                        mod_id = JSON.parse(data).id;
                                        mod_assets(mod_id);
                                    }));
                                }

                                function mod_assets(mod_id) {
                                    let dirPath_4 = path.join(__dirname, "jar/" + responseData[i].slug + "/assets/" + mod_id + "/lang/en_us.json");
                                    if (!fs.existsSync(dirPath_4)) return

                                    let dirPath_5 = path.join(__dirname, "assets/" + mod_id);
                                    if (!fs.existsSync(dirPath_5)) {
                                        fs.mkdirSync(dirPath_5);
                                    }
                                    let dirPath_1 = path.join(__dirname, "assets/" + mod_id + "/lang");
                                    if (!fs.existsSync(dirPath_1)) {
                                        fs.mkdirSync(dirPath_1);
                                    }
                                    fs.copyFile("jar/" + responseData[i].slug + "/assets/" + mod_id + "/lang/en_us.json", "assets/" + mod_id + "/lang/en_us.json", (err) => {
                                        console.log("成功移動模組: " + responseData[i].name + "的原始翻譯文本")
                                        if (err) throw err;
                                    })
                                }
                            }

                        }
                    )
                    request.on('error', error => console.log(error))
                    request.end();
                }
            }
            request.on('error', error => console.log(error))
            request.end();
        })

        //刪除資料夾/檔案(似乎無效)
        /*   delete_all("../jar")

           function delete_all(path) {
               let files = [];
               if (fs.existsSync(path)) {
                   files = fs.readdirSync(path);
                   files.forEach(function (file, index) {
                       let curPath = path + "/" + file;
                       if (fs.statSync(curPath).isDirectory()) { // recurse
                           delete_all(curPath);
                       } else { // delete file
                           fs.unlinkSync(curPath);
                       }
                   });
                   fs.rmdirSync(path);
               }
           }*/

    })
;
request.on('error', error => console.log(error))
request.end();
