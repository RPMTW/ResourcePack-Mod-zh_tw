const fs = require("fs");
const toml = require('toml');
const concat = require('concat-stream');
const {LangFile} = require("./LangFile");
const {
    parse,
    stringify
} = require('comment-json')

async function GetModID(slug, id, name) {
    let ModID;
    let McModCfgPath = `${process.cwd()}/../jar/${slug}/mcmod.info`;
    if (fs.existsSync(McModCfgPath)) {
        fs.createReadStream(`${process.cwd()}/../jar/${slug}/mcmod.info`, 'utf8').pipe(concat(function (data, err) {
            try {
                ModID = parse(data)[0].modid;
                LangFile(ModID, slug, id, name);
            } catch (err) {
                console.log(`解析模組ID時發生錯誤 (${name}) \n ${err}`);
            }
        }));
    }
}

exports.GetModID = GetModID;