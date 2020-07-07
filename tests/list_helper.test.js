const listHelper = require('../utils/list_helper')

const emptyList = []
const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]
const listWithSeveralBlogs = [...listWithOneBlog, {
    _id: '5f04d2a9cfcec46c34df8c40',
    title: 'How to run MongoDB - the Beginner\'s Guide',
    author: 'Joseph Kelley',
    url: 'www.mongodb4dummies.net',
    likes: 535,
    __v: 0
},
{
    _id: '5e5d8351b54a6935ec46cd17',
    title: 'ME*N Stack, the Holy Grail of Web Dev?',
    author: 'Yannis K. Marg',
    url: 'www.dev.to/ykmarg/me-n-stack-holy-grail',
    likes: 11,
    __v: 0
}]

test('dummy returns one', () => {
    const result = listHelper.dummy(emptyList)
    expect(result).toBe(1)
})

describe('total likes', () => {

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(emptyList)
        expect(result).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(listWithSeveralBlogs)
        expect(result).toBe(551)
    })
})

describe('favorite blog', () => {
    
    test('of empty list is null', () => {
        const result = listHelper.favoriteBlog(emptyList)
        expect(result).toEqual(null)
    })

    test('when list has only one blog equals that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual({
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        })
    })

    test('of a bigger list is the blog with most likes', () => {
        const result = listHelper.favoriteBlog(listWithSeveralBlogs)
        expect(result).toEqual({
            _id: '5f04d2a9cfcec46c34df8c40',
            title: 'How to run MongoDB - the Beginner\'s Guide',
            author: 'Joseph Kelley',
            url: 'www.mongodb4dummies.net',
            likes: 535,
            __v: 0
        })
    })
})