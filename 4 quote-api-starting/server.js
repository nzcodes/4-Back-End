const express = require('express')
const app = express()

const { quotes } = require('./data')
const { getRandomElement } = require('./utils')

const PORT = process.env.PORT || 4001
app.listen(PORT, () => {console.log(`Live at port ${PORT}`);})

app.use(express.static('public'))

app.get('/api/quotes/random', (req, res, next) => {
  res.send({ quote: getRandomElement(quotes) })
})
app.get("/api/quotes/", (req, res, next) => {
  const quotesQuerry = req.query
  if (quotesQuerry.person) {
    const newArray = quotes.filter(quote => quote.person === quotesQuerry.person)
    console.log(quotesQuerry)
    res.send({ quotes: newArray })
  } else {res.send({ quotes: quotes })}
})

app.post("/api/quotes", (req, res, next) => {
  const quoteToAdd = req.query
  if (quoteToAdd.quote && quoteToAdd.person) {
    quotes.push(quoteToAdd)
    res.send({ quote: quoteToAdd })
  } else {res.status(400).send()}
})
