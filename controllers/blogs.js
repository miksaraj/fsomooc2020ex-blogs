const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = req => {
    const auth = req.get('authorization')
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
        return auth.substring(7)
    }
    return null
}

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1 })
    res.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (req, res) => {
    const body = req.body
    token = getTokenFrom(req)

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (req, res) => {
    token = getTokenFrom(req)

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(req.params.id)
    if (blog.user.toString() !== decodedToken.id) {
        return res.status(401).json({ error: 'invalid permission' })
    }

    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const body = req.body
    const blog = {
        likes: body.likes || 0
    }
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
    res.json(updatedBlog.toJSON())
})

module.exports = blogsRouter