const fs = require("fs");
const path = require("path");

async function CopyDir(src, dst) {
    if (fs.existsSync(src)) {
        fs.readdir(src, function (err, files) {
            if (err) {
                console.log(err);
                return;
            }
            files.forEach(function (filename) {
                let url = path.join(src, filename),
                    dest = path.join(dst, filename);
                fs.stat(path.join(src, filename), function (err, stats) {
                    if (err) throw err;
                    if (stats.isFile()) {
                        let readable = fs.createReadStream(url);
                        let writable = fs.createWriteStream(dest, {encoding: "utf8"});
                        readable.pipe(writable);
                    } else if (stats.isDirectory()) {
                        exists(url, dest, CopyDir);
                    }
                });
            });
        });
    } else {
        console.log("給定的目錄不存，讀取不到檔案");
    }
}

function exists(url, dest, callback) {
    fs.exists(dest, function (exists) {
        if (exists) {
            callback && callback(url, dest);
        } else {
            fs.mkdir(dest, 0o777, function (err) {
                if (err) throw err;
                callback && callback(url, dest);
            });
        }
    });
}

exports.CopyDir = CopyDir;