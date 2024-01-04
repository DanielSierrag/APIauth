const express = require('express')
const mongoose = require('mongoose')
const car = require('./car.controller')
const { Auth, isAuthenticated } = require('./auth.controller')
const app = express()
const port = 3000

app.use(express.json())
mongoose.connect('mongodb+srv://daniel:1234@apiauth.ry4zqen.mongodb.net/?retryWrites=true&w=majority')

// app.get('/cars', isAuthenticated, car.list)
// app.post('/cars', isAuthenticated, car.create)
// app.get('/cars/:id', isAuthenticated, car.get)
// app.put('/cars/:id', isAuthenticated, car.update)
// app.patch('/cars/:id', isAuthenticated, car.update)
// app.delete('/cars/:id', isAuthenticated, car.destroy)

app.post('/login', Auth.login)
app.post('/register', Auth.register)

app.use(express.static('app'))
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/app/index.html`)
})
app.get('*', (req, res) => {
    res.status(404).send('Page not found')
})

app.listen(port, () => {
    console.log(`listening port ${port}`)
})