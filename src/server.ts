import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import "reflect-metadata";
import { getSchema } from './schema';
import jwt from "express-jwt";
import {Context} from "./resolvers/auth/context";

dotenv.config();

const graphqlPath = process.env.GRAPHQL_PATH || 4000;
const port = process.env.PORT;
const dbUrl: string = process.env.MONGODB_URL!;

const auth = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
})

mongoose.connect(dbUrl, {
    autoIndex: true,
}).then(() => console.log("connected to mongo")).catch((e) => console.log(e));

async function startApolloServer() {
    const schema = await getSchema();
    const app = express();

    const server = new ApolloServer({
        schema,
        introspection: true,
        context: ({ req }) => {
            const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress;
            const context: Context = {
                req,
                user: req['user'],
                ip,
            }
            return context;
        },
    });
    
    app.use(
        auth
    );

    await server.start();
    server.applyMiddleware({ app });

    await new Promise(resolve => app.listen({ port }));
    console.log(`🚀 Server ready at http://localhost:${port}/${graphqlPath}`);
    return { server, app };
}

startApolloServer();