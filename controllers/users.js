const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
    const body = req.body
    if (body.pwd.length < 3) {
        return res.status(400).json({ error: 'password must be at least 3 characters' })
    }
    const saltRounds = 10
    const pwdHash = await bcrypt.hash(body.pwd, saltRounds)
    const user = new User({
        username: body.username,
        name: body.name,
        pwdHash
    })
    const savedUser = await user.save()
    res.json(savedUser)
})

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', {
        title: 1,
        author: 1,
        url: 1,
        likes: 1
    })
    res.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter