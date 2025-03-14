import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PEOPLE } from "../queries";
import Title from "./layout/Title";
import AddPerson from "./forms/AddPerson";
import AddCar from "./forms/AddCar";
import PeopleList from "./lists/PeopleList";

const Home = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const people = data?.people || [];

  return (
    <div className="container">
      <Title />
      <AddPerson />
      {people.length > 0 && <AddCar people={people} />}
      <h2 className="records-title">Records</h2>
      <PeopleList people={people} />
    </div>
  );
};

export default Home;
