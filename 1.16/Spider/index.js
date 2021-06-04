const httpRequest = require('https');
const fs = require("fs");
const path = require("path");
const request_one = require("request");
const config = require(`${process.cwd()}/config.json`)
const compressing = require('compressing');
const toml = require('toml');
const concat = require('concat-stream');
const child_process = require('child_process');
const {
    parse,
    stringify
} = require('comment-json')
const ver = config.ver;
const modCount = config.modCount;

const options = {
    method: 'GET',
};

let CopyDir = function (src, dst) {
    if (fs.existsSync(src)) {
        fs.readdir(src, function (err, files) {
            if (err) {
                console.log(err);
                return;
            }
            files.forEach(function (filename) {
                let url = path.join(src, filename),
                    dest = path.join(dst, filename);
                fs.stat(path.join(src, filename), function (err, stats) {
                    if (err) throw err;
                    if (stats.isFile()) {
                        let readable = fs.createReadStream(url);
                        let writable = fs.createWriteStream(dest, { encoding: "utf8" });
                        readable.pipe(writable);
                    } else if (stats.isDirectory()) {
                        exists(url, dest, CopyDir);
                    }
                });
            });
        });
    } else {
        console.log("給定的目錄不存，讀取不到檔案");
    }
}

function exists(url, dest, callback) {
    fs.exists(dest, function (exists) {
        if (exists) {
            callback && callback(url, dest);
        } else {
            fs.mkdir(dest, 0o777, function (err) {
                if (err) throw err;
                callback && callback(url, dest);
            });
        }
    });
}

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
        for (let i = 0; i < modCount; i++) {
            let id = responseData[i].id;
            let name = responseData[i].name;
            let fileName = responseData[i].gameVersionLatestFiles[0].projectFileName;
            let fileID = String(responseData[i].gameVersionLatestFiles[0].projectFileId);
            let downloadUrl = `https://edge.forgecdn.net/files/${fileID.substr(0, 4)}/${fileID.substr(4, 7)}/${fileName}`;
            let slug = responseData[i].slug;


            for (let k = 0; k < 1; k++) {
                if (config.Blacklist_ID.includes(id)) return; //黑名單(專案ID)

                let url = downloadUrl;
                let stream = fs.createWriteStream(path.join(dirPath, fileName));
                request_one(url).pipe(stream).on("close", function (err) {
                    compressing.zip.uncompress(`./mod/${fileName}`, "../jar/" + slug).then(() => compressing_done())

                    async function compressing_done() {
                        let mod_id;
                        let dirPath_2 = path.join(__dirname, `../jar/${slug}/META-INF/mods.toml`);
                        let dirPath_3 = path.join(__dirname, `../jar/${slug}/mcmod.info`);
                        let dirPath_6 = path.join(__dirname, `../jar/${slug}/fabric.mod.json`);
                        if (fs.existsSync(dirPath_2)) {
                            fs.createReadStream(`../jar/${slug}/META-INF/mods.toml`, 'utf8').pipe(concat(function (data, err) {
                                try {
                                    mod_id = JSON.parse(JSON.stringify(toml.parse(data))).mods[0].modId
                                    mod_assets(mod_id);
                                } catch (err) {
                                    console.log("解析Toml時發生錯誤 \n" + err)
                                }
                            }));
                        } else if (fs.existsSync(dirPath_3)) {
                            fs.createReadStream(`../jar/${slug}/mcmod.info`, 'utf8').pipe(concat(function (data, err) {
                                try {
                                    mod_id = JSON.parse(data)[0].modid;
                                    mod_assets(mod_id);
                                } catch (err) {
                                    console.log("解析Json時發生錯誤 \n" + err)
                                }
                            }));
                        } else if (fs.existsSync(dirPath_6)) {
                            fs.createReadStream(`../jar/${slug}/fabric.mod.json`, 'utf8').pipe(concat(function (data, err) {
                                try {
                                    mod_id = JSON.parse(data).id;
                                    mod_assets(mod_id);
                                } catch (err) {
                                    console.log("解析Json時發生錯誤 \n" + err)
                                }
                            }));
                        }


                        async function mod_assets(mod_id) {
                            if (config.Blacklist_modId.includes(mod_id)) return; //黑名單(模組ID)
                            /*
                            Patchouli 手冊自動添加解析器
                            */
                            let PatchouliDir = path.join(__dirname, `../jar/${slug}/data/${mod_id}/patchouli_books/`)
                            if (fs.existsSync(PatchouliDir)) {
                                let DirName = fs.readdirSync(PatchouliDir).toString().split("\n");
                                for (let i = 0; i < DirName.length; i++) {
                                    let BookDir = path.join(__dirname, `../jar/${slug}/data/${mod_id}/patchouli_books/${DirName[i]}/en_us`)
                                    if (fs.existsSync(BookDir)) {
                                        fs.mkdirSync(path.join(__dirname, `../assets/${mod_id}/patchouli_books`));
                                        fs.mkdirSync(path.join(__dirname, `../assets/${mod_id}/patchouli_books/${DirName[i]}`));
                                        fs.mkdirSync(path.join(__dirname, `../assets/${mod_id}/patchouli_books/${DirName[i]}/zh_tw`));
                                        CopyDir(BookDir, `../assets/${mod_id}/patchouli_books/${DirName[i]}/zh_tw`);
                                        console.log(`複製完成 Patchouli 手冊檔案 (${mod_id})`)
                                    }
                                }
                            }


                            let dirPath_4 = path.join(__dirname, "../jar/" + slug + "/assets/" + mod_id + "/lang/en_us.json");
                            if (!fs.existsSync(dirPath_4)) return;

                            let dirPath_5 = path.join(__dirname, "../assets/" + mod_id);
                            if (!fs.existsSync(dirPath_5)) {
                                fs.mkdirSync(dirPath_5);
                            }
                            let dirPath_1 = path.join(__dirname, "../assets/" + mod_id + "/lang");
                            if (!fs.existsSync(dirPath_1)) {
                                fs.mkdirSync(dirPath_1);
                            }

                            let data = fs.readFileSync("../jar/" + slug + "/assets/" + mod_id + "/lang/en_us.json").toString();
                            data = parse(data, null, true)
                            data = stringify(data, null, 4)

                            fs.writeFile("../assets/" + mod_id + "/lang/zh_tw.json", data, function (error) {
                                console.log(`處理 ${name} (${id}-${mod_id}) 的原始語系檔案完成`)
                                if (error) {
                                    console.log(`解析語系Json檔案時發生錯誤。\n錯誤模組檔案: ${name} (${id}-${mod_id})\n錯誤原因: ${error}`);
                                }
                            })
                        }
                    }
                }
                )
            }
        }
    })
})
request.on('error', error => console.log(error))
request.end();
