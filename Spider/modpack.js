const fs = require("fs");
const path = require("path");
const request = require("request");
const config = require(`${process.cwd()}/config.json`)
const compressing = require('compressing');
const toml = require('toml');
const concat = require('concat-stream');
const curseforge = require("mc-curseforge-api");

const {
    parse,
    stringify,
} = require('comment-json')

let dirPath = path.join(__dirname, "mod");
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}
if (!fs.existsSync(path.join(__dirname, "../assets"))) {
    fs.mkdirSync(path.join(__dirname, "../assets"));
}


let ModList;
for (let k = 0; k < 1; k++) {
    let url = process.env.ModpackListUrl;
    let stream = fs.createWriteStream(path.join("ModList.json"));
    request(url).pipe(stream).on("close", function (err) {
        ModList = Array(parse(fs.readFileSync("ModList.json").toString()).files)[0]
        aaa()
    })

    function aaa() {
        for (let i = 0; i < ModList.length; i++) {
            let slug = ModList[i].projectID;

            let fileID;
            let fileName
            curseforge.getModFiles(ModList[i].projectID).then((files) => {
                for (let i = 0; i < files.length; i++) {
                    if (files[i].minecraft_versions.includes(config.ver)) {
                        fileID = String(files[i].id)
                        fileName = String(files[i].download_url.split("https://edge.forgecdn.net/files/")[1].split(`${fileID.substr(0, 4)}/${fileID.substr(4, 7)}/`)[1]);
                       let test = path.join(dirPath, fileName);
                        try {
                            files[i].download(test,true).then(r => {
                                console.log(`${fileName} 下載完成。`)
                                compressing.zip.uncompress(`./mod/${fileName}`, "../jar/" + slug).then(() => compressing_done())
                            });
                        } catch (err) {
                            console.log("發生未知錯誤 \n" + err)
                        }
                        break;
                    }
                }
            });

            function compressing_done() {
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


                function mod_assets(mod_id) {
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

                    let data = fs.readFileSync("../jar/" + slug + "/assets/" + mod_id + "/lang/en_us.json").toString();
                    data = parse(data, null, true)
                    data = stringify(data, null, 4)

                    fs.writeFile("../assets/" + mod_id + "/lang/zh_tw.json", data, function (error) {
                        console.log(`處理 ${fileName} (${mod_id}) 的原始語系檔案完成`)
                        if (error) {
                            console.log(`解析語系Json檔案時發生錯誤。\n錯誤模組檔案: ${fileName} (${mod_id})\n錯誤原因: ${error}`);
                        }
                    })
                }
            }
        }
    }
}