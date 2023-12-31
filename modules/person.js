require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url).then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(value) {
        const pattern = /^\d{2,3}-\d{5,}$/
        return pattern.test(value)
      },
      message: props => `${props.value} is not valid`
    },
    required: [true, 'User phone number is required']
  }
})

phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Phonebook', phoneSchema)