import { startStandaloneServer } from "@apollo/server/standalone";
import { server } from "./server";
import { createContext } from "./context";

const start = async () => {
  const { url } = await startStandaloneServer(server, {
    context: async () => createContext(),
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at ${url}`);
};

void start();
