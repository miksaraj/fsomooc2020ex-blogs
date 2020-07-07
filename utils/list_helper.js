const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    const total = likes.reduce(function(a,b) {
        return a + b
    }, 0)
    return total
}

const favoriteBlog = (blogs) => {
    const max = Math.max(...blogs.map(blog => blog.likes))
    const fav = blogs.find(blog => blog.likes === max)
    return fav || null
}

const mostBlogs = (blogs) => {
    blogsByAuthor = []
    const authors = [...new Set(blogs.map(blog => blog.author))]
    authors.forEach(author => {
        const entries = blogs.filter(blog => blog.author === author).length
        blogsByAuthor.push({author, blogs: entries})
    })
    const max = Math.max.apply(Math, blogsByAuthor.map(o => o.blogs))
    return blogsByAuthor.find(x => x.blogs === max) || null
}

const mostLikes = (blogs) => {
    likesByAuthor = []
    const authors = [...new Set(blogs.map(blog => blog.author))]
    authors.forEach(author => {
        const entries = blogs.filter(blog => blog.author === author)
        const likesByEntry = entries.map(entry => entry.likes)
        const totalLikes = likesByEntry.reduce(function(a,b) {
            return a + b
        }, 0)
        likesByAuthor.push({author, likes: totalLikes})
    })
    const max = Math.max.apply(Math, likesByAuthor.map(o => o.likes))
    return likesByAuthor.find(x => x.likes === max) || null
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}