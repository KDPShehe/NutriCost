const express = require('express')
const fs = require('fs')
const cors = require('cors')
const path = require('path')
const crypto = require('crypto')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const dataDir = path.join(__dirname, 'data')
const usersFile = path.join(dataDir, 'users.json')
const usersDataDir = path.join(dataDir, 'users')
const defaultDataDir = path.join(dataDir, 'default')

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)
if (!fs.existsSync(usersDataDir)) fs.mkdirSync(usersDataDir)
if (!fs.existsSync(defaultDataDir)) fs.mkdirSync(defaultDataDir)
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile)

app.post('/api/register', (req, res) => {
    const { login, password } = req.body

    const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'))

    const userExists = usersData.find(user => user.login === login)
    if (userExists) {
        return res.status(400).json({message: 'User with this login already exists'})
    }

    const userId = crypto.randomUUID()

    const newUser = {
        id: userId,
        login: login,
        password: password
    }

    usersData.push(newUser)
    fs.writeFileSync(usersFile, JSON.stringify(usersData, null, 2))

    const userFolder = path.join(usersDataDir, userId)
    fs.mkdirSync(userFolder)

    const defaultIngredients = fs.readFileSync(path.join(defaultDataDir, 'ingredients.json'))
    const defaultMeals = fs.readFileSync(path.join(defaultDataDir, 'meals.json'))
    const defaultCalendar = fs.readFileSync(path.join(defaultDataDir, 'calendar.json'))

    fs.writeFileSync(path.join(userFolder, 'ingredients.json'), defaultIngredients)
    fs.writeFileSync(path.join(userFolder, 'meals.json'), defaultMeals)
    fs.writeFileSync(path.join(userFolder, 'calendar.json'), defaultCalendar)

    console.log(`User registered: ${login} (ID: ${userId})`)
    res.json({success: true, userId: userId})
})

app.post('/api/login', (req, res) => {
    const {login, password} = req.body
    const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'))

    const user = usersData.find(u => u.login === login && u.password === password)

    if (user) {
        console.log(`User logged in: ${login}`)

        res.json({success: true, userId: user.id })
    } else {
        res.status(401).json({success: false, message: 'Invalid login or password'})
    }
})

app.get('/api/data/:userId/ingredients', (req, res) => {
    const userId = req.params.userId
    const filePath = path.join(usersDataDir, userId, 'ingredients.json')

    if (fs.existsSync(filePath)) {
        res.send(fs.readFileSync(filePath, 'utf8'))
    } else {
        res.status(404).send('Database not found')
    }
})

app.post('/api/data/:userId/ingredients', (req, res) => {
    const userId = req.params.userId
    const filePath = path.join(usersDataDir, userId, 'ingredients.json')
    const newData = req.body

    if (!fs.existsSync(path.join(usersDataDir, userId))) {
        return res.status(403).send('User folder not found')
    }

    fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
        if (err) return res.status(500).send('Error saving data')
        res.json({success: true})
    })
})

app.get('/api/data/:userId/meals', (req, res) => {
    const userId = req.params.userId
    const filePath = path.join(usersDataDir, userId, 'meals.json')

    if (fs.existsSync(filePath)) {
        res.send(fs.readFileSync(filePath, 'utf8'))
    } else {
        res.status(404).send('Database not found')
    }
})

app.post('/api/data/:userId/meals', (req, res) => {
    const userId = req.params.userId
    const filePath = path.join(usersDataDir, userId, 'meals.json')
    const newData = req.body

    if (!fs.existsSync(path.join(usersDataDir, userId))) {
        return res.status(403).send('User folder not found')
    }

    fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
        if (err) return res.status(500).send('Error saving data')
        res.json({success: true})
    })
})

app.get('/api/data/:userId/calendar', (req, res) => {
    const userId = req.params.userId
    const filePath = path.join(usersDataDir, userId, 'calendar.json')

    if (fs.existsSync(filePath)) {
        res.send(fs.readFileSync(filePath, 'utf8'))
    } else {
        res.send('{}')
    }
})

app.post('/api/data/:userId/calendar', (req, res) => {
    const userId = req.params.userId
    const filePath = path.join(usersDataDir, userId, 'calendar.json')
    const newData = req.body

    if (!fs.existsSync(path.join(usersDataDir, userId))) {
        return res.status(403).send('User folder not found')
    }

    fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
        if (err) return res.status(500).send('Error saving data')
        res.json({success: true})
    })
})

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})