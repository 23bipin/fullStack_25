const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.static('dist')) 
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token('body', (req) => {
    return (req.method === 'POST')
    ? JSON.stringify(req.body)
    :''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h1> Connecting people </h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const generatedId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    :0
    return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    } else if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be eunique'
        })
    } 

    const person = {
        name: body.name,
        number: body.number,
        id: generatedId(),
    }
    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.get('/info', (request, response) => {
    const total = persons.length
    const date = new Date()

    response.send(`
        <p> Phonebook has info for ${total} people </p>
        <p> ${date} </p>
        `)
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const body = request.body

    const personIndex = persons.findIndex(person => person.id === id)
    if (personIndex === -1) {
        return response.status(404).json({error: 'contact not found'})
    }

    const updatedPerson = {
        ...persons[personIndex],
        name: body.name,
        number: body.number,
    }
    persons[personIndex] = updatedPerson
    response.json(updatedPerson)
})

const PORT = process.env.PORT||3002
app.listen(PORT, () => {
    console.log(`Server runni8ng on port ${PORT}`)
})

