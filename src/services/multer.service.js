const multer = require('multer');
const path = require('path');
const { FILE_LOCATION } = require('../constant/url');

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: FILE_LOCATION,
    filename: function (req, file, cb) {
        console.info("uploaded file: ", file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const uploadCSV = multer({
    storage: storage,
    // TODO: if needed
    // limits: {
    //     fileSize: 1000000
    // },
    fileFilter: function (req, file, cb) {
        checkFileTypeForCSV(file, cb);
    }
});

// Init Upload
const uploadExcel = multer({
    storage: storage,
    // TODO: if needed
    // limits: {
    //     fileSize: 1000000
    // },
    fileFilter: function (req, file, cb) {
        checkFileTypeForExcel(file, cb);
    }
});

// Check File Type
function checkFileTypeForCSV(file, cb) {
    // Allowed ext
    const filetypes = /csv|ms-excel/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(JSON.stringify({
            error: 'Error: CSV files Only!',
            file
        }));
    }
}

// Check File Type
function checkFileTypeForExcel(file, cb) {
    // Allowed ext
    const filetypes = /xlsx|xls|ms-excel|spreadsheetml/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(JSON.stringify({
            error: 'Error: Excel files Only!',
            file
        }));
    }
}

module.exports = {
    uploadCSV,
    uploadExcel
};