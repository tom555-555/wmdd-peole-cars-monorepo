import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import typeDefs from "./schema";

// Fake data
let people = [
  {
    id: "1",
    firstName: "Bill",
    lastName: "Gates",
  },
  {
    id: "2",
    firstName: "Steve",
    lastName: "Jobs",
  },
  {
    id: "3",
    firstName: "Linux",
    lastName: "Torvalds",
  },
];

let cars = [
  {
    id: "1",
    year: "2019",
    make: "Toyota",
    model: "Corolla",
    price: "40000",
    personId: "1",
  },
  {
    id: "2",
    year: "2018",
    make: "Lexus",
    model: "LX 600",
    price: "13000",
    personId: "1",
  },
  {
    id: "3",
    year: "2017",
    make: "Honda",
    model: "Civic",
    price: "20000",
    personId: "1",
  },
  {
    id: "4",
    year: "2019",
    make: "Acura ",
    model: "MDX",
    price: "60000",
    personId: "2",
  },
  {
    id: "5",
    year: "2018",
    make: "Ford",
    model: "Focus",
    price: "35000",
    personId: "2",
  },
  {
    id: "6",
    year: "2017",
    make: "Honda",
    model: "Pilot",
    price: "45000",
    personId: "2",
  },
  {
    id: "7",
    year: "2019",
    make: "Volkswagen",
    model: "Golf",
    price: "40000",
    personId: "3",
  },
  {
    id: "8",
    year: "2018",
    make: "Kia",
    model: "Sorento",
    price: "45000",
    personId: "3",
  },
  {
    id: "9",
    year: "2017",
    make: "Volvo",
    model: "XC40",
    price: "55000",
    personId: "3",
  },
];

// Resolvers
const resolvers = {
  Query: {
    people: () => people,
    person: (_, { id }) => people.find((person) => person.id === id),
    cars: () => cars,
    car: (_, { id }) => cars.find((car) => car.id === id),
    personWithCars: (_, { id }) => {
      return people.find((person) => person.id === id);
    },
  },
  Person: {
    // Resolver to get cars related to a person
    cars: (parent) => cars.filter((car) => car.personId === parent.id),
  },
  Car: {
    // Resolver to get the person who owns the car
    person: (parent) => people.find((person) => person.id === parent.personId),
  },
  Mutation: {
    addPerson: (_, { firstName, lastName }) => {
      const newPerson = {
        id: uuidv4(),
        firstName,
        lastName,
      };
      people.push(newPerson);
      return newPerson;
    },
    updatePerson: (_, { id, firstName, lastName }) => {
      const personIndex = people.findIndex((person) => person.id === id);
      if (personIndex === -1) return null;

      const updatedPerson = {
        ...people[personIndex],
        firstName,
        lastName,
      };

      people[personIndex] = updatedPerson;
      return updatedPerson;
    },
    deletePerson: (_, { id }) => {
      const personIndex = people.findIndex((person) => person.id === id);
      if (personIndex === -1) return null;

      const deletedPerson = people[personIndex];
      people = people.filter((person) => person.id !== id);

      // Also delete all cars owned by this person
      cars = cars.filter((car) => car.personId !== id);

      return deletedPerson;
    },
    addCar: (_, { year, make, model, price, personId }) => {
      const newCar = {
        id: uuidv4(),
        year,
        make,
        model,
        price,
        personId,
      };
      cars.push(newCar);
      return newCar;
    },
    updateCar: (_, { id, year, make, model, price, personId }) => {
      const carIndex = cars.findIndex((car) => car.id === id);
      if (carIndex === -1) return null;

      const updatedCar = {
        ...cars[carIndex],
        year,
        make,
        model,
        price,
        personId,
      };

      cars[carIndex] = updatedCar;
      return updatedCar;
    },
    deleteCar: (_, { id }) => {
      const carIndex = cars.findIndex((car) => car.id === id);
      if (carIndex === -1) return null;

      const deletedCar = cars[carIndex];
      cars = cars.filter((car) => car.id !== id);

      return deletedCar;
    },
  },
};

// Set up Express with Apollo Server
async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server) as any);

  app.use(express.static("public"));

  const PORT = 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server is running at http://localhost:${PORT}/graphql`);
}

startApolloServer();
