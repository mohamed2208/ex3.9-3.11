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

app.get('/api/persons', (request, response, next) => {
  Phonebook.find({}).then(person => {
    response.json(person)
  }).catch(error => next(error))
})
app.get('/info', (request, response, next) => {
  Phonebook.countDocuments({})
  .then(count => {
    response.send(`<p>Phonebook has info ${count} people</p>${formattedDateTime}`)
  }).catch(error => next(error))
})
app.get('/api/persons/:id', (request, response, next)  => {
  Phonebook.findById(request.params.id)
  .then(result => {
    response.json(result)
  }).catch(error => next(error))
})
app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
  }).catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {

  const person = {
    name: request.body.name,
    number: request.body.number
  }

  Phonebook.findByIdAndUpdate(request.params.id, person, {new: true})
  .then(result => {
    response.json(result)
  }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name ==='CastError') {
    response.status(400).send({error: 'makformatted id'})
  }
  else if (error.name === 'ValidationError') {
    response.status(400).json({error: error.message})
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT,() => {
  console.log(`server started on port ${PORT}`)
  console.log('pwd', process.argv[2])
} )