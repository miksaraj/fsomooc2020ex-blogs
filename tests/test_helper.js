const Blog = require('../models/blog')

const initialBlogs = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5f04d2a9cfcec46c34df8c40',
        title: 'How to run MongoDB - the Beginner\'s Guide',
        author: 'Joseph Kelley',
        url: 'www.mongodb4dummies.net',
        likes: 16,
        __v: 0
    },
    {
        _id: '5e5d8351b54a6935ec46cd17',
        title: 'ME*N Stack, the Holy Grail of Web Dev?',
        author: 'Yannis K. Marg',
        url: 'www.dev.to/ykmarg/me-n-stack-holy-grail',
        likes: 11,
        __v: 0
    }
]

const nonExistentId = async () => {
    const blog = new Blog({
        title: 'Removable',
        url: 'www.removableblog.net'
    })
    await blog.save()
    await blog.remove()
    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, nonExistentId, blogsInDb
}