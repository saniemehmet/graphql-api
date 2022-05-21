import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import "reflect-metadata";
import { getSchema } from './schema';

dotenv.config();

const graphqlPath = process.env.GRAPHQL_PATH || 4000;
const port = process.env.PORT;
const dbUrl: string = process.env.MONGODB_URL!;

mongoose.connect(dbUrl, {
    autoIndex: true,
}).then(() => console.log("connected to mongo")).catch((e) => console.log(e));

async function startApolloServer() {
    const schema = await getSchema();
    const app = express();

    const server = new ApolloServer({
        schema,
        introspection: true,
    });

    await server.start();
    server.applyMiddleware({ app });

    await new Promise(resolve => app.listen({ port }));
    console.log(`🚀 Server ready at http://localhost:${port}/${graphqlPath}`);
    return { server, app };
}

startApolloServer();