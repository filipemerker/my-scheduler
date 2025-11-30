import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri:
    import.meta.env.VITE_GRAPHQL_URL ||
    "https://myscheduler-filipe.netlify.app/api/graphql",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
