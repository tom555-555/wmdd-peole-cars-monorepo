import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_PERSON, GET_PEOPLE } from "../../queries";

const AddPerson = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [addPerson] = useMutation(ADD_PERSON, {
    update(cache, { data: { addPerson } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE });
      cache.writeQuery({
        query: GET_PEOPLE,
        data: { people: [...people, addPerson] },
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addPerson({
      variables: { firstName, lastName },
      optimisticResponse: {
        __typename: "Mutation",
        addPerson: {
          __typename: "Person",
          id: Math.round(Math.random() * -1000000).toString(),
          firstName,
          lastName,
          cars: [],
        },
      },
    });
    setFirstName("");
    setLastName("");
  };

  return (
    <div className="add-form">
      <h2>Add Person</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">* First Name:</label>
          <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">* Last Name:</label>
          <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
        </div>
        <button type="submit" className="add-button">
          Add Person
        </button>
      </form>
    </div>
  );
};

export default AddPerson;
