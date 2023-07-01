const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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
    "name": "Mary Poppendieck", 
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
    response.json(persons)
})
app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info ${notes.length} people </p>${formattedDateTime}`)

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
  let randomNum = Math.floor(Math.random() * (100000 - 1) + 1)
  let test = true
  const names = persons.map(person => person.name)
  const number = persons.map(person => person.number)

  while(test) {
    const ids = notes.map(person => person.id)
    if (!ids.includes(randomNum)) {
      test = false
    }
    randomNum = Math.floor(Math.random() * (100000 - 1) + 1)
  }
  const obj = {
    "id": randomNum,
    "name": "Adam", 
    "number": "12-785-897656"
  }
  if (names.includes(obj.name)) {
    return response.status(400).json({error: 'name must be unique'})
  }
  else if (names.includes(obj.number)) {
    return response.status(400).json({error: 'number must be unique'})
  }

  notes = notes.concat(obj)
  response.json(notes) 
})

const PORT = process.env.PORT || 3001
app.listen(PORT,() => {
  console.log(`server started on port ${PORT}`)
} )