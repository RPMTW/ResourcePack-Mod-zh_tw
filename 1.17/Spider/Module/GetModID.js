const fs = require("fs");
const { LangFile } = require("./LangFile");

async function GetModID(slug, id, name) {
    if (String(name) === "undefined") return;
    let ModID;
    let ModDir = `${process.cwd()}/../jar/${slug}/assets`
    try {
        if (fs.existsSync(ModDir)) {
            let DirName = fs.readdirSync(ModDir).toString().split("\n");
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
}

exports.GetModID = GetModID;
