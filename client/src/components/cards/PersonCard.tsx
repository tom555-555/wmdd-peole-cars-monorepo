import React, { useState } from "react";
import { Link } from "react-router";
import { useMutation } from "@apollo/client";
import { GET_PEOPLE, UPDATE_PERSON, DELETE_PERSON } from "../../queries";
import CarCard from "./CarCard";

const PersonCard = ({ person }) => {
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(person.firstName);
  const [lastName, setLastName] = useState(person.lastName);

  const [updatePerson] = useMutation(UPDATE_PERSON);
  const [deletePerson] = useMutation(DELETE_PERSON, {
    update(cache, { data: { deletePerson } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE });
      cache.writeQuery({
        query: GET_PEOPLE,
        data: { people: people.filter((p) => p.id !== deletePerson.id) },
      });
    },
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleUpdate = () => {
    updatePerson({
      variables: {
        id: person.id,
        firstName,
        lastName,
      },
      optimisticResponse: {
        __typename: "Mutation",
        updatePerson: {
          __typename: "Person",
          id: person.id,
          firstName,
          lastName,
          cars: person.cars,
        },
      },
    });
    setEditing(false);
  };

  const handleDelete = () => {
    deletePerson({
      variables: { id: person.id },
      optimisticResponse: {
        __typename: "Mutation",
        deletePerson: {
          __typename: "Person",
          id: person.id,
          firstName: person.firstName,
          lastName: person.lastName,
        },
      },
    });
  };

  const handleCancel = () => {
    setFirstName(person.firstName);
    setLastName(person.lastName);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="form-group">
            <label htmlFor={`firstName-${person.id}`}>First Name:</label>
            <input id={`firstName-${person.id}`} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor={`lastName-${person.id}`}>Last Name:</label>
            <input id={`lastName-${person.id}`} type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <div className="button-group">
            <button onClick={handleUpdate} className="save-button">
              Save
            </button>
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>
          {person.firstName} {person.lastName}
        </h3>
      </div>
      <div className="card-body">
        {person.cars.map((car) => (
          <CarCard key={car.id} car={car} showEdit={true} />
        ))}
      </div>
      <div className="card-footer">
        <Link to={`/people/${person.id}`} className="learn-more">
          Learn More
        </Link>
        <div className="button-group">
          <button onClick={handleEdit} className="edit-button">
            Edit
          </button>
          <button onClick={handleDelete} className="delete-button">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
