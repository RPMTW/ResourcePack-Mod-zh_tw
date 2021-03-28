const httpRequest = require('https');
const fs = require("fs");
const path = require("path");
const request_one = require("request");
const config = require(`${process.cwd()}/config.json`)
const compressing = require('compressing');
const toml = require('toml');
const del = require('del');
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

    let dirPath = path.join(__dirname, "mod");
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    if (!fs.existsSync(path.join(__dirname, "../assets"))) {
        fs.mkdirSync(path.join(__dirname, "../assets"));
    }

    response.on('end', () => {
        for (let i = 0; i < modCount; i++){
            let downloadUrl = ""
            let fileName = ""
            fileName = responseData[i].gameVersionLatestFiles[0].projectFileName
            let fileID = String(responseData[i].gameVersionLatestFiles[0].projectFileId)
            downloadUrl = `https://edge.forgecdn.net/files/${fileID.substr(0, 4)}/${fileID.substr(4, 7)}/${fileName}`
            const slug = responseData[i].slug
            for (let k = 0; k < 1; k++) {
                let url = downloadUrl;
                let stream = fs.createWriteStream(path.join(dirPath, fileName));
                request_one(url).pipe(stream).on("close", function (err) {
                        console.log("模組: " + responseData[i].name + "下載完成");
                        compressing.zip.uncompress(`./mod/${fileName}`, "../jar/" + slug).then(() => compressing_done())

                        function compressing_done() {
                            console.log(`模組: ${responseData[i].name} 解壓縮完畢`)
                            let mod_id = "";
                            let dirPath_2 = path.join(__dirname, `../jar/${slug}/META-INF/mods.toml`);
                            let dirPath_3 = path.join(__dirname, `../jar/${slug}/mcmod.info`);
                            let dirPath_6 = path.join(__dirname, `../jar/${slug}/fabric.mod.json`);
                            if (fs.existsSync(dirPath_2)) {
                                fs.createReadStream(`../jar/${slug}/META-INF/mods.toml`, 'utf8').pipe(concat(function (data, err) {
                                    try {
                                    mod_id = JSON.parse(JSON.stringify(toml.parse(data))).mods[0].modId
                                    mod_assets(mod_id);
                                    } catch (err) {
                                        console.log("解析Toml時發生錯誤 \n"+err)
                                    }
                                }));
                            } else if (fs.existsSync(dirPath_3)) {
                                fs.createReadStream(`../jar/${slug}/mcmod.info`, 'utf8').pipe(concat(function (data, err) {
                                    try {
                                    mod_id = JSON.parse(data)[0].modid;
                                    mod_assets(mod_id);
                                    } catch (err) {
                                        console.log("解析Json時發生錯誤 \n"+err)
                                    }
                                }));
                            } else if (fs.existsSync(dirPath_6)) {
                                fs.createReadStream(`../jar/${slug}/fabric.mod.json`, 'utf8').pipe(concat(function (data, err) {
                                    try {
                                        mod_id = JSON.parse(data).id;
                                        mod_assets(mod_id);
                                    } catch (err) {
                                        console.log("解析Json時發生錯誤 \n"+err)
                                    }
                                }));
                            }


                            function mod_assets(mod_id) {
                                if (config.Blacklist.includes(mod_id)) return; //黑名單
                                let dirPath_4 = path.join(__dirname, "../jar/" + slug + "/assets/" + mod_id + "/lang/en_us.json");
                                if (!fs.existsSync(dirPath_4)) return

                                let dirPath_5 = path.join(__dirname, "../assets/" + mod_id);
                                if (!fs.existsSync(dirPath_5)) {
                                    fs.mkdirSync(dirPath_5);
                                }
                                let dirPath_1 = path.join(__dirname, "../assets/" + mod_id + "/lang");
                                if (!fs.existsSync(dirPath_1)) {
                                    fs.mkdirSync(dirPath_1);
                                }
                                fs.createReadStream("../jar/" + slug + "/assets/" + mod_id + "/lang/en_us.json", 'utf8').pipe(concat(function (data, err) {
                                    try {
                                        JSON.parse(data)
                                    } catch (err) {
                                        console.log("解析Json時發生錯誤 \n"+err)
                                    }
                                }));
                                fs.copyFile("../jar/" + slug + "/assets/" + mod_id + "/lang/en_us.json", "../assets/" + mod_id + "/lang/en_us.json", (err) => {
                                    console.log("成功移動模組: " + responseData[i].name + " 的原始翻譯文本")
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
})
request.on('error', error => console.log(error))
request.end();