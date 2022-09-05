const express = require('express')
const router = express.Router()
const multer = require('multer'); // Create multer object
const knex = require('knex');
const path = require('path');
const pool = require("../db");
const e = require('express');
const fs = require('fs')
require("dotenv").config();

const imageUpload = multer({
    dest: 'images',
});

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: process.env.DATABASE_PORT,
    },
});

router.post('/', imageUpload.single('avatar'), async(req, res) => {
    const filename_result = await pool.query(
        "SELECT * FROM users u INNER JOIN image_files i ON u.id=i.user_id where u.username=$1", [req.body.username]
    );
    if (filename_result.rows[0]) {
        await pool.query(
            "DELETE FROM image_files i WHERE i.user_id=$1", [filename_result.rows[0].user_id]
        )
    }
    const { filename, mimetype, size } = req.file;
    const filetype = mimetype.split("/")[1];
    const newFileName = filename + "." + filetype;
    const filepath = req.file.path + "." + filetype;
    fs.rename(`./images/${filename}`, `./images/${newFileName}`, () => { console.log("callback") });
    console.log("filename", filename, "mimetype", mimetype, "size", size, "filepath", filepath)
    const user_id_result = await pool.query(
        "SELECT id FROM users u WHERE u.username=$1", [req.body.username]
    );
    const user_id = user_id_result.rows[0].id;
    db.insert({
            filename,
            filepath,
            mimetype,
            size,
            user_id
        })
        .into('image_files')
        .then(() => res.json({ success: true, filename }))
        .catch(err => res
            .json({
                success: false,
                message: 'upload failed',
                stack: err.stack,
            })
        );

});

router.get('/:username', express.json(), async(req, res) => {
    const { username } = req.params;
    const filename_result = await pool.query(
        "SELECT * FROM users u INNER JOIN image_files i ON u.id=i.user_id where u.username=$1", [username]
    );
    if (filename_result.rows[0]) {
        // const filename = filename_result.rows[0].filename;
        const filepath = filename_result.rows[0].filepath;
        // const mimetype = filename_result.rows[0].mimetype;
        console.log("filepath: ", filepath)
        // const dirname = path.resolve();
        // const fullfilepath = path.join(dirname, filename_result.rows[0].filepath);
        // console.log("fullfilepath", fullfilepath)
        console.log(username, " has avatar")
        return res.sendFile(filepath, { root: './' });
    } else {
        console.log(username, " has no avatar")
        return
    }
})

module.exports = router;

// return res.type(mimetype).sendFile(filename, { root: './image' });
// res.json({ filename: filename });