import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_CAR, GET_PEOPLE } from "../../queries";

const AddCar = ({ people }) => {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [personId, setPersonId] = useState("");

  const [addCar] = useMutation(ADD_CAR, {
    update(cache, { data: { addCar } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE });

      const updatedPeople = people.map((person) => {
        if (person.id === addCar.personId) {
          return {
            ...person,
            cars: [...person.cars, addCar],
          };
        }
        return person;
      });

      cache.writeQuery({
        query: GET_PEOPLE,
        data: { people: updatedPeople },
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addCar({
      variables: {
        year: parseInt(year),
        make,
        model,
        price: parseFloat(price),
        personId,
      },
      optimisticResponse: {
        __typename: "Mutation",
        addCar: {
          __typename: "Car",
          id: Math.round(Math.random() * -1000000).toString(),
          year,
          make,
          model,
          price,
          personId,
          person: {
            __typename: "Person",
            id: personId,
            firstName: people.find((p) => p.id === personId)?.firstName || "",
            lastName: people.find((p) => p.id === personId)?.lastName || "",
          },
        },
      },
    });
    setYear("");
    setMake("");
    setModel("");
    setPrice("");
    setPersonId("");
  };

  return (
    <div className="add-form">
      <h2>Add Car</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="year">* Year:</label>
          <input type="number" id="year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" required />
        </div>
        <div className="form-group">
          <label htmlFor="make">* Make:</label>
          <input type="text" id="make" value={make} onChange={(e) => setMake(e.target.value)} placeholder="Make" required />
        </div>
        <div className="form-group">
          <label htmlFor="model">* Model:</label>
          <input type="text" id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model" required />
        </div>
        <div className="form-group">
          <label htmlFor="price">* Price:</label>
          <div className="price-input">
            <span>$</span>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="personId">* Person:</label>
          <select id="personId" value={personId} onChange={(e) => setPersonId(e.target.value)} required>
            <option value="">Select a person</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="add-button">
          Add Car
        </button>
      </form>
    </div>
  );
};

export default AddCar;
