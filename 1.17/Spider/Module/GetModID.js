const fs = require("fs");
const toml = require('toml');
const concat = require('concat-stream');
const {LangFile} = require("./LangFile");

async function GetModID(slug, id, name) {
    let ModID;
    let ForgeCfgPath = `${process.cwd()}/../jar/${slug}/META-INF/mods.toml`;
    let McModCfgPath = `${process.cwd()}/../jar/${slug}/mcmod.info`;
    let FabricCfgPath = `${process.cwd()}/../jar/${slug}/fabric.mod.json`;
    if (fs.existsSync(ForgeCfgPath)) {
        fs.createReadStream(`${process.cwd()}/../jar/${slug}/META-INF/mods.toml`, 'utf8').pipe(concat(function (data, err) {
            try {
                ModID = JSON.parse(JSON.stringify(toml.parse(data))).mods[0].modId
                LangFile(ModID, slug, id, name);
            } catch (err) {
                console.log("解析Toml時發生錯誤 \n" + err)
            }
        }));
    } else if (fs.existsSync(McModCfgPath)) {
        fs.createReadStream(`${process.cwd()}/../jar/${slug}/mcmod.info`, 'utf8').pipe(concat(function (data, err) {
            try {
                ModID = JSON.parse(data)[0].modid;
                LangFile(ModID, slug, id, name);
            } catch (err) {
                console.log("解析Json時發生錯誤 \n" + err)
            }
        }));
    } else if (fs.existsSync(FabricCfgPath)) {
        fs.createReadStream(`${process.cwd()}/../jar/${slug}/fabric.mod.json`, 'utf8').pipe(concat(function (data, err) {
            try {
                ModID = JSON.parse(data).id;
                LangFile(ModID, slug, id, name);
            } catch (err) {
                console.log("解析Json時發生錯誤 \n" + err)
            }
        }));
    }
}

exports.GetModID = GetModID;