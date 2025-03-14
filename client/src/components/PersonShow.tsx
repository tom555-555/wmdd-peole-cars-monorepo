import React from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@apollo/client";
import { GET_PERSON_WITH_CARS } from "../queries";
import CarCard from "./cards/CarCard";

const PersonShow = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { person } = data;

  return (
    <div className="container">
      <h1>
        {person.firstName} {person.lastName}
      </h1>
      <h2>Cars</h2>
      <div className="cars-list">
        {person.cars.map((car) => (
          <CarCard key={car.id} car={car} showEdit={false} />
        ))}
      </div>
      <Link to="/" className="go-back-link">
        GO BACK HOME
      </Link>
    </div>
  );
};

export default PersonShow;
