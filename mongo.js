const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as an argument')
    process.exit(1)
}
const url = `mongodb+srv://user1:${process.argv[2]}@cluster0.ygcsls1.mongodb.net/`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
   name: String,
   number: String
})
const Phonebook = mongoose.model('Phonebook', phoneSchema)

const person = new Phonebook({
    name: 'Bob White',
    number: '27172182'
})
person.save().then(result => {
    console.log('note saved')
    mongoose.connection.close()
})

Phonebook.find({}).then(result => {
    result.forEach(phone => {
    console.log(phone)
})
    mongoose.connection.close()
})

 