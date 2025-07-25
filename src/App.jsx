import {useState, useEffect} from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import contactService from './services/persons'
import Notification from './components/errorNotif'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [notification, setNotification] = useState({message: null, type: null})
  
  useEffect(() => {
    contactService
      .getAll()
      .then(initialContacts => {
        setPersons(initialContacts)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const nameExists = persons.find(person => person.name ===newName)

    if (nameExists) {
      const confirmUpdate = window.confirm(`${newName} is already added. Replace the old number with this one?`)
      if (confirmUpdate) {
        const updatedPerson = { ...nameExists, number: newNumber }
        contactService
        .update(nameExists.id, updatedPerson)
        .then(returnedContact => {
          setPersons(persons.map( person => person.id !== nameExists.id ? person : returnedContact ))
          setNewName('')
          setNewNumber('')
        })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
  

    contactService
      .create(personObject)
      .then(returnedContact => {
        setPersons(persons.concat(returnedContact))
        console.log(returnedContact)
        setNewName('')
        setNewNumber('')
        setNotification({
          message: `Added ${returnedContact.name}`,
          type:'success'
        })

        setTimeout(() => {
          setNotification({ message:null, type:null })
        }, 5000)
      })
  }
}

    const deletePerson = (event, id) => {
      event.preventDefault()

    const person = persons.find(person => person.id === id)
    const confirmDelete = window.confirm(`Delete '${person.name}' ?`)

    if (confirmDelete) {
      contactService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification({
            message: `Deleted ${person.name}`,
            type:'success'
          })
          setTimeout(() => {
            setNotification({ message:null, type: null })
          }, 5000)
        })
        .catch(error => {
          setNotification({
            message: `Information of ${person.name} has already been removed from server`,
            type: 'error'
          })
          setTimeout(() => {
            setNotification({ message:null, type: null })
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
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
            <Notification notification={notification} />
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
        <Persons 
          contactsToShow={contactsToShow}
          deletePerson={deletePerson}
        />
    </div>
  )
}

export default App