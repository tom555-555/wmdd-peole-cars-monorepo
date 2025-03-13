// Schema definition
const typeDefs = `#graphql
  type Person {
    id: String!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: String!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: String!
    person: Person
  }

  type Query {
    people: [Person]
    person(id: String!): Person
    cars: [Car]
    car(id: String!): Car
    personWithCars(id: String!): Person
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person
    updatePerson(id: String!, firstName: String!, lastName: String!): Person
    deletePerson(id: String!): Person

    addCar(year: Int!, make: String!, model: String!, price: Float!, personId: String!): Car
    updateCar(id: String!, year: Int!, make: String!, model: String!, price: Float!, personId: String!): Car
    deleteCar(id: String!): Car
  }
`;

export default typeDefs;
