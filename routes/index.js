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

router.get('/post', async function (req, res, next) {
    const [rows] = await promisePool.query('SELECT rj28forum.*, rj28users.name FROM rj28forum JOIN rj28users ON rj28forum.AuthorId = rj28users.id')
    res.render('post.njk', {
        rows: rows,
        title: 'Forum',
    })
})

router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query('SELECT rj28forum.*, rj28users.name FROM rj28forum JOIN rj28users ON rj28forum.AuthorId = rj28users.id')
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
    const { AuthorId, title, content } = req.body
    let user = await promisePool.query('SELECT * FROM rj28users WHERE name = ?', [AuthorId])
    if(!user)
    {
        user = await promisePool.query('INSERT INTO rj28users (name) VALUES (?)', [AuthorId])
    }
    console.log(user)
    const userId = user.insertId || user[0][0].id

    const [rows] = await promisePool.query("INSERT INTO rj28forum (AuthorId, title, content) VALUES (?, ?, ?)", [userId, title, content])
    res.redirect('/')
})

module.exports = router
