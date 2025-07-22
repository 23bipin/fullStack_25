const Filter = ({searchName, handleSearchChange }) => {
    return (
        <div>
            <input 
                value={searchName}
                onChange={handleSearchChange}
                placeholder='Search name'
            />
        </div>
    )
}


export default Filter