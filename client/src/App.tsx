import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import "./App.css";

const HELLO_QUERY = gql`
  query GetHello {
    hello
  }
`;

interface HelloData {
  hello: string;
}

function App() {
  const { loading, error, data } = useQuery<HelloData>(HELLO_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data</p>;

  return (
    <div>
      <h1>{data.hello}</h1>
    </div>
  );
}

export default App;
