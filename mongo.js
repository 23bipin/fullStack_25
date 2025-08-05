require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')

const url = process.env.MONGODB_URI
//number of arguments in the commandline [0(node),1(mongo.js),2(name),3(number)]

if (process.argv.length !== 4){
  console.log('Usage: node mongo.js <name> <number>')
  process.exit(1)
}

const name = process.argv[2]
const number = process.argv[3]

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')

    const person = new Person({ name, number })

    return person.save()
  })
  .then(() => {
    console.log(`Added ${name} number ${number} to phonebook`)
    return mongoose.connection.close()
  })
  .catch((error) => {
    console.error('Error:', error.message)
    mongoose.connection.close()
  })