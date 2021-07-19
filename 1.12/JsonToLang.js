const fs = require("fs");
const {parse} = require("comment-json");
let LangDir = fs.readdirSync(`${process.cwd()}/../zh-TW/1.12/assets/`);

for (const Dir of LangDir) {
    let LangFiles = fs.readdirSync(`${process.cwd()}/../zh-TW/1.12/assets/${Dir}/lang`).filter(file => file.endsWith('zh_tw.json'));
    for (const File of LangFiles) {
        let LangJson = parse(fs.readFileSync(`${process.cwd()}/../zh-TW/1.12/assets/${Dir}/lang/${File}`).toString());
        let ObjJsonKey = Object.keys(LangJson);
        let ObjLang = "";
        for (let i = 0; i < ObjJsonKey.length; i++) {
            if (ObjJsonKey.startsWith("_comment_")) {
                ObjLang += `#${LangJson[ObjJsonKey[i]]}\n`;
            } else {
                ObjLang += `${ObjJsonKey[i]}=${LangJson[ObjJsonKey[i]]}\n`;
            }
        }
        fs.writeFile(`${process.cwd()}/../zh-TW/1.12/assets/${Dir}/lang/${File.split(".json")}.lang`, ObjLang, function (error) {
            if (error) {
                console.log(`將.json轉換為.lang時發生未知錯誤\n錯誤原因: ${error}`);
            }
            fs.unlink(`${process.cwd()}/../zh-TW/1.12/assets/${Dir}/lang/${File}`, function (error) {
                if (error) {
                    console.log(`將.json檔案刪除發生意外錯誤\n錯誤原因: ${error}`);
                }
            })
            console.log(`轉換 ${Dir} 模組的json檔案至lang完成。`)
        })
    }
}