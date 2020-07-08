const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    const pwdHash = await bcrypt.hash('root', 10)
    const user = new User({ username: 'root', pwdHash })
    await user.save()
})

describe('create user', () => {
    
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'miksaraj',
            name: 'Mikko Rajakangas',
            pwd: 'pasmavisseli'
        }

        await api.post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper status code and message if username already exists', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'root',
            name: 'Admin',
            pwd: 'rootpwd'
        }

        const result = await api.post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper status code and message if username too short', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'ro',
            name: 'Admin',
            pwd: 'root'
        }

        const result = await api.post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` (`' + newUser.username + '`) is shorter than')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper status code and message if password too short', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'root',
            name: 'Admin',
            pwd: 'rt'
        }

        const result = await api.post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password must be at least 3')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

// TODO: tests for get users

describe('login', () => {

    test('login succeeds with correct username and password', async () => {
        const userToAuth = {
            username: 'root',
            pwd: 'root'
        }

        const result = await api.post('/api/login')
        .send(userToAuth)
        .expect(200)

        expect(result.body.token).toBeDefined()
    })

    test('login fails with incorrect username', async () => {
        const userToAuth = {
            username: 'tororo',
            pwd: 'root'
        }

        const result = await api.post('/api/login')
        .send(userToAuth)
        .expect(401)

        expect(result.body.error).toBe('invalid username or password')
    })

    test('login fails with incorrect password', async () => {
        const userToAuth = {
            username: 'root',
            pwd: 'toor'
        }

        const result = await api.post('/api/login')
        .send(userToAuth)
        .expect(401)

        expect(result.body.error).toBe('invalid username or password')
    })
})

afterAll(() => {
    mongoose.connection.close()
})