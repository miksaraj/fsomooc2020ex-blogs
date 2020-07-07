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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}