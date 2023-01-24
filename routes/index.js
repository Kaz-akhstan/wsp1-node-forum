const express = require('express')
const router = express.Router()
const mysql = require('mysql2')

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
})
const promisePool = pool.promise()


router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query('SELECT * FROM rj28forum')
    res.render('index.njk', {
        rows: rows,
        title: 'Forum',
    })
})

router.get('/new', async function (req, res, next) {
    const [users] = await promisePool.query("SELECT * FROM rj28users")
    res.render('new.njk', {
        title: 'Nytt inlägg',
        users,
    })
})

router.post('/new', async function (req, res, next){
    const { authorId, title, content } = req.body
    let user = await promisePool.query('SELECT * FROM rj28users WHERE name = ?', [authorId])
    if(!user)
    {
        user = await promisePool.query('INSERT INTO rj28users (name) VALUES (?)', [authorId])
    }
    const userId = user.insertId || user[0].id;
    console.log(user.insertId)

    const [rows] = await promisePool.query("INSERT INTO rj28forum (authorId, title, content) VALUES (?, ?, ?)", [userId, title, content])
    res.redirect('/')
})

module.exports = router
