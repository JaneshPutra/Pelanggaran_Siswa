const express = require ("express")
const router = express.Router()
const db = require("./db")
const multer = require("multer")// untuk mengunggah file
const path = require("path") // untuk memanggil path direktori
const fs = require("fs") // untuk manajemen file



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './image');
    },
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "hooh - "+ Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({storage: storage})

// PELANGGARAN
// end-point menyimpan data pelanggaran
router.post("/pelanggaran", upload.single("foto_pelanggaran"), (req, res) => {
    // prepare data
    let data = {
        nama_pelanggaran: req.body.nama_pelanggaran,
        poin: req.body.poin,
        foto_pelanggaran: req.file.filename
    }

    if (!req.file) {
        // jika tidak ada file yang diupload
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        // create sql insert
        let sql = "insert into pelanggaran set ?"

        // run query
        db.query(sql, data, (error, result) => {
            if(error) throw error
            res.json({
                message: result.affectedRows + " data berhasil disimpan"
            })
        })
    }
})



// end-point akses data user
router.get("/pelanggaran", (req, res) => {
    // create sql query
    let sql = "select * from pelanggaran"

    // run query
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                count: result.length, // jumlah data
                pelanggaran: result // isi data
            }
        }
        res.json(response) // send response
    })
})
module.exports=router