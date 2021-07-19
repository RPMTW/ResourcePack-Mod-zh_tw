const config = require(`${process.cwd()}/config.json`)
function MCVersion(data) {
    return (data.includes(config.ver)) || (data.includes("1.12.1") || (data.includes("1.12")));
}

exports.MCVersion = MCVersion;