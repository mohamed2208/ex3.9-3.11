require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require('./modules/person')


const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('req-body', (request, response) => {
  if (request.body) {
    return JSON.stringify(request.body)
  }
  return '-'
})

console.log(app.use(morgan(':method')) === 'GET', 'g')

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))


let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Nary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const currentDate = new Date()
const options = {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }
  
const formattedDateTime = currentDate.toLocaleString('en-EU', options)

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(person => {
    response.json(person)
  })
})
app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info ${persons.length} people </p>${formattedDateTime}`)

})
app.get('/api/persons/:id', (request, response)  => {
  const id  = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
  else if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Phonebook({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

})

const PORT = process.env.PORT
app.listen(PORT,() => {
  console.log(`server started on port ${PORT}`)
  console.log('pwd', process.argv[2])
} )