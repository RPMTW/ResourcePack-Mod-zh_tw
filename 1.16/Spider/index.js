const httpRequest = require('https');
const fs = require("fs");
const path = require("path");
const Request = require("request");
const config = require(`${process.cwd()}/config.json`)
const compressing = require('compressing');
const {GetModID} = require("./Module/GetModID");
const ver = config.ver;
const modCount = config.modCount;

const options = {
    method: 'GET',
};

const request = httpRequest.request(`https://addons-ecs.forgesvc.net/api/v2/addon/search?categoryId=0&gameId=432&index=0&pageSize=${modCount}&gameVersion=${ver}&sectionId=6&sort=1"`, options, response => {
    let responseData = '';
    response.on('data', dataChunk => {
        responseData += dataChunk;
        try {
            responseData = JSON.parse(responseData);
        } catch (err) {

        }
    });
    request.on('error', error => console.log(error))

    let dirPath = path.join(__dirname, "mod");
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    if (!fs.existsSync(path.join(__dirname, "../assets"))) {
        fs.mkdirSync(path.join(__dirname, "../assets"));
    }

    response.on('end', () => {
        for (let i = 0; i < modCount; i++) {
            let id = responseData[i].id;
            let name = responseData[i].name;
            let fileName = responseData[i].gameVersionLatestFiles[0].projectFileName;
            let fileID = String(responseData[i].gameVersionLatestFiles[0].projectFileId);
            let downloadUrl = `https://edge.forgecdn.net/files/${fileID.substr(0, 4)}/${fileID.substr(4, 7)}/${fileName}`;
            let slug = responseData[i].slug;

            for (let k = 0; k < 1; k++) {
                if (config.Blacklist_ID.includes(id)) return; //黑名單(專案ID)

                let url = downloadUrl;
                let stream = fs.createWriteStream(path.join(dirPath, fileName));
                Request(url).pipe(stream).on("close", function (err) {
                        compressing.zip.uncompress(`./mod/${fileName}`, `../jar/${slug}`).then(() => GetModID(slug, id, name))
                    }
                )
            }
        }
    })
})
request.on('error', error => console.log(error))
request.end();
