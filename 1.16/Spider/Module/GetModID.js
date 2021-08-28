const fs = require("fs");
const { LangFile } = require("./LangFile");
const concat = require('concat-stream');
const toml = require('toml');
const CurseForgeIndex = require('./CurseForgeIndex').CurseForgeIndex;
async function GetModID(slug, id, name) {
    if (String(name) === "undefined") return;
    let ModID;
    let ModDir = `${process.cwd()}/../jar/${slug}/assets`
    try {
        if (fs.existsSync(ModDir)) {
            let DirName = fs.readdirSync(ModDir).toString().split(",");
            if (DirName.length === 0) DirName = fs.readdirSync(ModDir).toString().split("\n");
            for (let i = 0; i < DirName.length; i++) {
                let ModLangDir = `${process.cwd()}/../jar/${slug}/assets/${DirName[i]}/lang`;
                if (fs.existsSync(ModLangDir)) {
                    ModID = DirName[i];
                    LangFile(ModID, slug, id, name);
                }
            }
        }
    } catch (err) {
        console.log(`解析模組ID時發生錯誤 (${name}) \n ${err}`);
    }

    let ForgeCfgPath = `${process.cwd()}/../jar/${slug}/META-INF/mods.toml`;
    let McModCfgPath = `${process.cwd()}/../jar/${slug}/mcmod.info`;
    let FabricCfgPath = `${process.cwd()}/../jar/${slug}/fabric.mod.json`;
    if (fs.existsSync(ForgeCfgPath)) {
        fs.createReadStream(`${process.cwd()}/../jar/${slug}/META-INF/mods.toml`, 'utf8').pipe(concat(function (data, err) {
            try {
                ModID = JSON.parse(JSON.stringify(toml.parse(data))).mods[0].modId
                CurseForgeIndex(ModID, id, name);
            } catch (err) {
                console.log("解析Toml時發生錯誤 \n" + err)
            }
        }));
    } else if (fs.existsSync(McModCfgPath)) {
        fs.createReadStream(`${process.cwd()}/../jar/${slug}/mcmod.info`, 'utf8').pipe(concat(function (data, err) {
            try {
                ModID = JSON.parse(data)[0].modid;
                CurseForgeIndex(ModID, id, name);
            } catch (err) {
                console.log("解析Json時發生錯誤 \n" + err)
            }
        }));
    } else if (fs.existsSync(FabricCfgPath)) {
        fs.createReadStream(`${process.cwd()}/../jar/${slug}/fabric.mod.json`, 'utf8').pipe(concat(function (data, err) {
            try {
                ModID = JSON.parse(data).id;
                CurseForgeIndex(ModID, id, name);
            } catch (err) {
                console.log("解析Json時發生錯誤 \n" + err)
            }
        }));
    }
}

exports.GetModID = GetModID;
