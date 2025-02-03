const Person = ({ person }) => (
  <div>
    {person.name} {person.number}
  </div>
);

const Persons = ({ persons }) => (
  <div>
    {persons.map((person) => (
      <Person key={person.name} person={person} />
    ))}
  </div>
);

export default Persons;
