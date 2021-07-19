const {
    parse
} = require('comment-json')

function LangToJson(data) {
    let LangJson = parse(`{}`);

    try {
        data = String(data).split("\n");
        for (let i = 0; i < data.length; i++) {
            let LangKey = String(data[i].split("=",2).shift());
            let LangValue = String(data[i].split(`${LangKey}=`)[1]);
            if (LangKey !== "undefined" || LangValue !== "undefined") {
                if (LangKey.startsWith("#")) {
                    LangValue = LangKey.split(/^#/)[1];
                    LangKey = "_comment";
                }

                /*
                處理跳脫字元
                 */
                LangValue = LangValue.replaceAll(`\"`, `\\\"`);

                LangJson = Object.assign(LangJson, parse(`{\"${LangKey}\":\"${LangValue}\"}`));
            }
        }
    } catch (e) {
        console.log(e)
    }
    return LangJson;
}

exports.LangToJson = LangToJson;