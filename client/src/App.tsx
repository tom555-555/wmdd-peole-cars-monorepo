import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Home from "./components/Home";
import PersonShow from "./components/PersonShow";
import { RouterProvider } from "react-router/dom";

// Apollo Clientの設定
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          people: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          cars: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/people/:id" element={<PersonShow />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
