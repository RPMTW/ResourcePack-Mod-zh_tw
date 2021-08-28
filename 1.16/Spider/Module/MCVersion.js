const config = require(`${process.cwd()}/config.json`)
function MCVersion(data) {
    return (data.includes(config.ver)) || data.includes("1.16.4") || data.includes("1.16.3") || data.includes("1.16.2") || data.includes("1.16.1") || data.includes("1.16");
}

exports.MCVersion = MCVersion;