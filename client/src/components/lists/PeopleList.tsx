import React from "react";
import PersonCard from "../cards/PersonCard";

const PeopleList = ({ people }) => {
  return (
    <div className="people-list">
      {people.map((person) => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
};

export default PeopleList;
