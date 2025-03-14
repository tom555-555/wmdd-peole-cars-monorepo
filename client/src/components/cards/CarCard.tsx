import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_CAR, DELETE_CAR, GET_PEOPLE } from "../../queries";

const CarCard = ({ car, showEdit = true }) => {
  const [editing, setEditing] = useState(false);
  const [year, setYear] = useState(car.year);
  const [make, setMake] = useState(car.make);
  const [model, setModel] = useState(car.model);
  const [price, setPrice] = useState(car.price);
  const [personId, setPersonId] = useState(car.personId);

  const { data } = useQuery(GET_PEOPLE);
  const people = data?.people || [];

  const [updateCar] = useMutation(UPDATE_CAR);
  const [deleteCar] = useMutation(DELETE_CAR, {
    update(cache, { data: { deleteCar } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE });

      const updatedPeople = people.map((person) => {
        if (person.id === deleteCar.personId) {
          return {
            ...person,
            cars: person.cars.filter((c) => c.id !== deleteCar.id),
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

  const handleEdit = () => {
    setEditing(true);
  };

  const handleUpdate = () => {
    updateCar({
      variables: {
        id: car.id,
        year,
        make,
        model,
        price,
        personId,
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateCar: {
          __typename: "Car",
          id: car.id,
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
    setEditing(false);
  };

  const handleDelete = () => {
    deleteCar({
      variables: { id: car.id },
      optimisticResponse: {
        __typename: "Mutation",
        deleteCar: {
          __typename: "Car",
          id: car.id,
          year: car.year,
          make: car.make,
          model: car.model,
          price: car.price,
          personId: car.personId,
        },
      },
    });
  };

  const handleCancel = () => {
    setYear(car.year);
    setMake(car.make);
    setModel(car.model);
    setPrice(car.price);
    setPersonId(car.personId);
    setEditing(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (editing && showEdit) {
    return (
      <div className="car-card editing">
        <div className="form-group">
          <label htmlFor={`year-${car.id}`}>Year:</label>
          <input id={`year-${car.id}`} type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor={`make-${car.id}`}>Make:</label>
          <input id={`make-${car.id}`} type="text" value={make} onChange={(e) => setMake(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor={`model-${car.id}`}>Model:</label>
          <input id={`model-${car.id}`} type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor={`price-${car.id}`}>Price:</label>
          <div className="price-input">
            <span>$</span>
            <input id={`price-${car.id}`} type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor={`personId-${car.id}`}>Person:</label>
          <select id={`personId-${car.id}`} value={personId} onChange={(e) => setPersonId(e.target.value)} required>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </select>
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
    );
  }

  return (
    <div className="car-card">
      <div className="car-info">
        <p>
          {car.year} {car.make} {car.model} to {formatPrice(car.price)}
        </p>
      </div>
      {showEdit && (
        <div className="button-group">
          <button onClick={handleEdit} className="edit-button">
            Edit
          </button>
          <button onClick={handleDelete} className="delete-button">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CarCard;
