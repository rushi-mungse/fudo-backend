import multer from "multer";

const FILE_SIZE = 1e6 * 8;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/uploads");
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniquePrefix + "-" + file.originalname);
    },
});

export default multer({ storage, limits: { fileSize: FILE_SIZE } });
