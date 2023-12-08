const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const blogRoutes = require('./routes/blogRoutes')

const app = express()
// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://user1:pass1@cluster0.d9fiqpz.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err))

app.set('view engine', 'ejs')
// middlewares
app.use(express.static('public')) // css/img
app.use(express.urlencoded({ extended: true })) // access form data in req.body in route handlers
app.use(morgan('dev'))

// page routes
app.get('/', (req, res) => {res.redirect('/blogs')})
app.get('/about', (req, res) => {res.render('about', { title: 'About' })})

// blog routes
app.use('/blogs', blogRoutes)
app.use((req, res) => {res.status(404).render('404', { title: '404' })})
