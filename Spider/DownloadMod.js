const fs = require("fs");
const path = require("path");
const request = require("request");
const config = require(`${process.cwd()}/config.json`)
const compressing = require('compressing');
const toml = require('toml');
const curseforge = require("mc-curseforge-api");
require('dotenv').config();

const {
    parse,
    stringify,
} = require('comment-json')

let ModDirPath = path.join(__dirname, "mod");
if (!fs.existsSync(ModDirPath)) {
    fs.mkdirSync(ModDirPath);
}
if (!fs.existsSync(path.join(__dirname, "../assets"))) {
    fs.mkdirSync(path.join(__dirname, "../assets"));
}


let ID = process.env.ModID;
aaa();

function aaa() {
    let slug, fileID, fileName;
    curseforge.getModFiles(Number(ID)).then((files) => {
        for (let i = 0; i < files.length; i++) {
            if (files[i].minecraft_versions.includes(config.ver)) {
                fileID = String(files[i].id);
                fileName = String(files[i].download_url.split("https://edge.forgecdn.net/files/")[1].split(`${fileID.substr(0, 4)}/${fileID.substr(4, 7)}/`)[1]);
                if (fileName === "undefined") {
                    fileName = String(files[i].download_url.split("https://edge.forgecdn.net/files/")[1].split(`${fileID.substr(0, 4)}/${fileID.substr(5, 7)}/`)[1]);
                }
                let test = path.join(ModDirPath, fileName);
                slug = fileName.split(".jar")[0];
                try {
                    files[i].download(test, true).then(r => {
                        console.log(`${fileName.split(".jar")[0]} 下載完成。`);
                        compressing.zip.uncompress(`./mod/${fileName}`, "../jar/" + slug).then(() => compressing_done(slug, fileName))
                    });
                } catch (err) {
                    console.log("發生未知錯誤 \n" + err);
                }
                break;
            }
        }
    });
}

function compressing_done(slug, fileName) {
    let mod_id, data;
    let dirPath_2 = path.join(__dirname, `../jar/${slug}/META-INF/mods.toml`);
    let dirPath_3 = path.join(__dirname, `../jar/${slug}/mcmod.info`);
    let dirPath_6 = path.join(__dirname, `../jar/${slug}/fabric.mod.json`);

    if (fs.existsSync(dirPath_2)) {
        try {
            data = fs.readFileSync(`../jar/${slug}/META-INF/mods.toml`, 'utf8').toString()
            mod_id = JSON.parse(JSON.stringify(toml.parse(data))).mods[0].modId
            ModAssets(mod_id, fileName, slug);
        } catch (err) {
            console.log("解析Toml時發生錯誤 \n" + err);
        }
    } else if (fs.existsSync(dirPath_3)) {
        try {
            data = fs.readFileSync(`../jar/${slug}/mcmod.info`, 'utf8').toString()
            mod_id = JSON.parse(data)[0].modid;
            ModAssets(mod_id, fileName, slug);
        } catch (err) {
            console.log("解析Json時發生錯誤 \n" + err);
        }
    } else if (fs.existsSync(dirPath_6)) {
        try {
            data = fs.readFileSync(`../jar/${slug}/fabric.mod.json`, 'utf8').toString()
            mod_id = JSON.parse(data).id;
            ModAssets(mod_id, fileName, slug);
        } catch (err) {
            console.log("解析Json時發生錯誤 \n" + err);
        }
    }
}

function ModAssets(mod_id, fileName, slug) {
    if (!fs.existsSync(path.join(__dirname, "../jar/" + slug + "/assets/" + mod_id + "/lang/en_us.json"))) return; //是否存在模組原始語系檔案
    if (fs.existsSync(path.join(__dirname, "../assets/" + mod_id))) return; //如果已經存在此模組的語系檔案將不新增

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
    data = parse(data, null, true);
    data = stringify(data, null, 4);
    fs.writeFile("../assets/" + mod_id + "/lang/zh_tw.json", data, function (error) {
        console.log(`處理 ${fileName} (${mod_id}) 的原始語系檔案完成`);
        if (error) {
            console.log(`解析語系Json檔案時發生錯誤。\n錯誤模組檔案: ${fileName} (${mod_id})\n錯誤原因: ${error}`);
        }
    })
}