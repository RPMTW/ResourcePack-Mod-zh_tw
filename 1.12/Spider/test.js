const {LangToJson} = require("./Module/LangToJson");
let data = `
# Tooltips
jei.tooltip.config="test"`

console.log(LangToJson(data));