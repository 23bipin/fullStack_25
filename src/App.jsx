import {useState} from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  
  const addPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.some(person=> person.name ===newName)

  nameExists
    ?  alert(`${newName} is already added to phonebook`)
    : (
      setPersons(persons.concat({
        id: persons.length + 1,
        name: newName,
        number: newNumber
      })),
      setNewName(''),
      setNewNumber(''),
      console.log('person added', event.target)
    ) 
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const contactsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(searchName.toLowerCase())
  )

  return(
    <div>
      <form>
        <div>
            <h2>Phonebook</h2>
          <Filter
            searchName={searchName}
            handleSearchChange={(e) => setSearchName(e.target.value)}
             />
        </div> 
      </form>

      <h2>Add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
        <Persons contactsToShow={contactsToShow} />
    </div>
  )
}

export default App