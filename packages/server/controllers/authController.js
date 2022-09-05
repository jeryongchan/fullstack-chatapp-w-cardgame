const pool = require("../db")
const bcrypt = require("bcrypt")
const { v4: uuidv4 } = require("uuid");

module.exports.handleLogin = (req, res) => {
    if (req.session.user && req.session.user.username) {
        res.json({ loggedIn: true, username: req.session.user.username });
    } else {
        res.json({ loggedIn: false });
    }
}

module.exports.attemptLogin = async (req, res) => {
    const potentialLogin = await pool.query(
        "SELECT id, username, passhash, userid FROM users u WHERE u.username=$1",
        [req.body.username]
    );

    if (potentialLogin.rowCount > 0) {
        const isSamePass = await bcrypt.compare(
            req.body.password,
            potentialLogin.rows[0].passhash
        );
        if (isSamePass) {
            req.session.user = { //set req.session.user
                id: potentialLogin.rows[0].id,
                userid: potentialLogin.rows[0].userid,
                username: req.body.username,
            }
            res.json({ loggedIn: true, username: req.body.username })
        } else {
            res.json({ loggedIn: false, status: "Wrong username or password" })
        }
    } else {
        res.json({ loggedIn: false, status: "Wrong username or password" })
    }
}

module.exports.attemptRegister = async (req, res) => {
    const existingUser = await pool.query(
        "SELECT username from users WHERE username=$1",
        [req.body.username]
    );
    let newUserQuery;
    if (existingUser.rowCount === 0) {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        newUserQuery = await pool.query(
            "INSERT INTO users(username, passhash, userid) values ($1,$2,$3) RETURNING id, username, userid",
            [req.body.username, hashedPass, uuidv4()]
        );
        req.session.user = {
            username: req.body.username,
            id: newUserQuery.rows[0].id,
            userid: newUserQuery.rows[0].userid
        }
        res.json({ loggedIn: true, username: req.body.username })
    } else {
        res.json({ loggedIn: false, status: "Username taken" })
    }

    const filename = 'blankprofilepic.png'
    const filepath = "images/blankprofilepic.png"
    const mimetype = 'image/png'
    const size = 10000
    const newImageQuery = await pool.query(
        "INSERT INTO image_files(filename, filepath, mimetype, size, user_id) values ($1,$2,$3,$4,$5) RETURNING filename, filepath, mimetype, size, user_id",
        [filename,filepath,mimetype,size,newUserQuery.rows[0].id]
    );
}

module.exports.handleLogout = (req, res) => {
    req.session = null;
    res.clearCookie("sid", { path: '/' });
    return res.send();
}