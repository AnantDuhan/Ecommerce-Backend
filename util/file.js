const fs = require('fs');

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if(err) {
            Throw (err);
        }
    });
}

exports.deleteFile = deleteFile;