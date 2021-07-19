const config = require(`${process.cwd()}/config.json`)
function MCVersion(data) {
    return (data.includes(config.ver)) || (data.includes("1.17.1"));
}

exports.MCVersion = MCVersion;