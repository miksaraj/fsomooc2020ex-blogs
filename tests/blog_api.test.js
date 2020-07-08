const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('api get all', () => {

    test('blogs are returned as json', async () => {
        await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
    test('the identifying parameter of a specified blog is named id', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })
})

describe('api post', () => {      

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7
        }

        await api.post('/api/blogs')
        .set('Authorization', `Bearer ${helper.token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain('React patterns')
    })

    test('blog likes is set to zero if not given', async () => {
        const newBlog = {
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/"
        }

        await api.post('/api/blogs')
        .set('Authorization', `Bearer ${helper.token}`)
        .send(newBlog)
        .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        const addedBlog = blogsAtEnd.find(b => b.title === 'React patterns')
        expect(addedBlog.likes).toBe(0)
    })

    test('blog without title is not added', async () => {
        const newBlog = {
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7
        }
        
        await api.post('/api/blogs')
        .set('Authorization', `Bearer ${helper.token}`)
        .send(newBlog)
        .expect(400)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
        const newBlog = {
            title: "React patterns",
            author: "Michael Chan",
            likes: 7
        }
        
        await api.post('/api/blogs')
        .set('Authorization', `Bearer ${helper.token}`)
        .send(newBlog)
        .expect(400)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails with proper status code and message if invalid token', async () => {
        const newBlog = {
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7
        }

        const result = await api.post('/api/blogs')
        .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjVmMDViZGIxZDMxNjU5MDg3Z`)
        .send(newBlog)
        .expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

        expect(result.body.error).toContain('invalid token')
    })
})

// FIXME: api delete tests will fail due to missing token
describe('api delete', () => {

    test('succeeds with status code 204 if valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        
        await api.delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${helper.token}`)
        .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).not.toContain(blogToDelete.title)
    })

    test('fails with status code 401 if invalid token', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        
        const result = await api.delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjVmMDViZGIxZDMxNjU5MDg3Z`)
        .expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

        expect(result.body.error).toContain('invalid token')
    })
})

describe('api put', () => {

    test('blog likes are updated successfully', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        blogToUpdate.likes = blogToUpdate.likes + 1
        await api.put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

        const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
        expect(updatedBlog.likes).toBe(blogToUpdate.likes)
    })
})

afterAll(() => {
    mongoose.connection.close()
})