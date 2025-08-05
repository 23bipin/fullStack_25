//============================= IMPORT & CONFIG=====================
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

//============================== MIDDLEWARE=========================
app.use(cors())
app.use(express.static('dist')) 
app.use(express.json())

//================= MORGAN FOR LOGGING POST
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//==================== DB COMNNECTION=================
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message)
  })

//=================================ROUTES================**********

//=====MAIN ROUTE==========
app.get('/', (req, res) => {
  res.send('<h1>Connecting people</h1>')
})

// GET ALL CONTACTS ===========
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error))
})

// GET A SINGLE CONTACT BY ID==============
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).send({ error: 'person not found' })
      }
    })
    .catch(error => next(error))
})

// CREATE A NEW CONTACT ====================
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({ name, number })

  person.save()
    .then(savedPerson => res.status(201).json(savedPerson))
    .catch(error => next(error))
})

//UPDATE A CONTACT ===================
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  const updatedPerson = { name, number }

  Person.findByIdAndUpdate(
    req.params.id,
    updatedPerson,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(result => {
      if (result) {
        res.json(result)
      } else {
        res.status(404).send({ error: 'contact not found' })
      }
    })
    .catch(error => next(error))
})

// DELETE A CONTACT ===================
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        res.status(204).end()
      } else {
        res.status(404).send({ error: 'contact not found' })
      }
    })
    .catch(error => next(error))
})

// INFO ==========================
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(error => next(error) )
})

//============================= ERROR HANDLING ====================


// CENTRALIZED ERROR HANDLER MIDDLWARE
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id'})
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  res.status(500).json({ error: 'something went wrong' })
}

app.use(errorHandler)

//==========================SERVER START====================
const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
