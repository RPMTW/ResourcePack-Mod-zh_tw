/*
Lang轉換為Json格式，由https://gist.github.com/ChAoSUnItY/31c147efd2391b653b8cc12da9699b43修改而成，特別感謝3X0DUS - ChAoS#6969編寫此function。
 */

const fs = require("fs");
const readline = require("readline");
async function LangToJson(path) {
    const fileStream = fs.createReadStream(path);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let obj = {}, last_key = null, comment_counter = 0

    for await (const line of rl) {
        if (line.startsWith("#") || line.startsWith("//")) {
            continue;
        } else if (line.indexOf("=") === -1) {
            if (last_key === null) continue
            if (line === "") continue

            obj[last_key] += `\n${line}`
        } else if (line.indexOf("=") !== -1) {
            if (line.split("=").length === 2) {
                let kv = line.split("=")
                last_key = kv[0]

                obj[kv[0]] = kv[1].trimStart()
            } else {
                if (last_key === null) continue

                obj[last_key] += `\n${line}`
            }
        }
    }
    return obj;
}

exports.LangToJson = LangToJson;