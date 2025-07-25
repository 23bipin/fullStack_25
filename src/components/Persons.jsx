const Persons = ({contactsToShow, deletePerson}) => {
    return (
        <ul>
            {contactsToShow.map(person => (
                <li key={person.id}>
                    {person.id}. {person.name} {person.number}
                    <button onClick= {(event) => deletePerson(event, person.id)}>delete</button>
                </li>
            ))}
        </ul>
    )
}

export default Persons