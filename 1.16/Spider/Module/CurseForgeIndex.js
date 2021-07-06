const fs = require("fs");
const {
    parse,
    stringify
} = require('comment-json')
const path = require("path");

function CurseForgeIndex(ModID, id, name) {

    let index = `{\"${ModID}\":\"${id}\"}`
    let nwe = parse(index);
    let before = {};
    if (!fs.existsSync(path.join(__filename,`${process.cwd()}/../CurseForgeIndex.json`))) {
        before = parse(fs.readFileSync(`${process.cwd()}/../CurseForgeIndex.json`).toString(), null, true);
    }
    let data = stringify(Object.assign({}, before, nwe), null, 4)
    fs.writeFileSync(`${process.cwd()}/../CurseForgeIndex.json`, data, function (error) {
        if (error) {
            console.log(`寫入CurseForge引索檔案時發生錯誤\n錯誤模組檔案: ${name} (${id}-${ModID})\n錯誤原因: ${error}`);
        }
       return console.log(`處理 ${name} (${id}-${ModID}) 的CurseForge引索檔案完成`);
    })
}

exports.CurseForgeIndex = CurseForgeIndex;
