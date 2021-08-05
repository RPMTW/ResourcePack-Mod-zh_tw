const path = require("path");
const fs = require("fs");
const config = require(`${process.cwd()}/config.json`)
const { LangToJson } = require("./LangToJson");
const CopyDir = require('./CopyDir').CopyDir;
const CurseForgeIndex = require('./CurseForgeIndex').CurseForgeIndex;

async function LangFile(ModID, slug, id, name) {
    if (config.Blacklist_modId.includes(ModID)) return; //黑名單(模組ID)

    let LangPath;
    let LangPath1 = `${process.cwd()}/../jar/${slug}/assets/${ModID}/lang/en_us.lang`
    let LangPath2 = `${process.cwd()}/../jar/${slug}/assets/${ModID}/lang/en_US.lang`

    if (fs.existsSync(LangPath1)) {
        LangPath = LangPath1
    } else if (fs.existsSync(LangPath2)) {
        LangPath = LangPath2
    } else {
        return;
    }


    if (!fs.existsSync(`${process.cwd()}/../assets/${ModID}`)) {
        fs.mkdirSync(`${process.cwd()}/../assets/${ModID}`);
    }
    /*
    Patchouli 手冊自動添加解析器
    */
    let PatchouliDir = `${process.cwd()}/../jar/${slug}/assets/${ModID}/patchouli_books/`
    if (fs.existsSync(PatchouliDir)) {
        let DirName = fs.readdirSync(PatchouliDir).toString().split("\n");
        for (let i = 0; i < DirName.length; i++) {
            let BookDir = `${process.cwd()}/../jar/${slug}/assets/${ModID}/patchouli_books/${DirName[i]}/en_us`;
            if (fs.existsSync(BookDir)) {
                if (!fs.existsSync(`${process.cwd()}/../assets/${ModID}/patchouli_books`)) {
                    fs.mkdirSync(`${process.cwd()}/../assets/${ModID}/patchouli_books`);
                    fs.mkdirSync(`${process.cwd()}/../assets/${ModID}/patchouli_books/${DirName[i]}`);
                    fs.mkdirSync(`${process.cwd()}/../assets/${ModID}/patchouli_books/${DirName[i]}/zh_tw`);
                }
                await CopyDir(BookDir, `${process.cwd()}/../assets/${ModID}/patchouli_books/${DirName[i]}/zh_tw`);
                console.log(`複製完成 Patchouli 手冊檔案 (${ModID})`)
            }
        }
    }

    if (!fs.existsSync(`${process.cwd()}/../assets/${ModID}/lang`)) {
        fs.mkdirSync(`${process.cwd()}/../assets/${ModID}/lang`);
    }

    let New = await LangToJson(LangPath);
    let Before = {};
    if (fs.existsSync(`${process.cwd()}/../assets/${ModID}/lang/zh_tw.json`)) {
        try {
            Before = JSON.parse(fs.readFileSync(`${process.cwd()}/../assets/${ModID}/lang/zh_tw.json`).toString());
        } catch (error) {
            console.log(ModID, error);
        }
    }
    let data = JSON.stringify(Object.assign({}, Before, New), null, 4)

    fs.writeFile(`${process.cwd()}/../assets/${ModID}/lang/zh_tw.json`, data, function (error) {
        if (error) {
            console.log(`寫入語系檔案時發生未知錯誤。\n錯誤模組檔案: ${name} (${id}-${ModID})\n錯誤原因: ${error}`);
        }
        CurseForgeIndex(ModID, id, name);
        return console.log(`處理 ${name} (${id}-${ModID}) 的原始語系檔案完成`);
    })
}

exports.LangFile = LangFile;