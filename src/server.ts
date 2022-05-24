import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import mongoose from 'mongoose';
import "reflect-metadata";
import { getSchema } from './schema';
import jwt from "express-jwt";
import { Context } from "./resolvers/auth/context";
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import bodyParser from 'body-parser';

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
    const httpServer = http.createServer(app);
    app.use(
        cors({
            origin: '*'
        }),
        bodyParser.json(),
        auth
    );

    const server = new ApolloServer({
        schema,
        introspection: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
        context: ({ req }) => {
            const user = req.user;
            const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress;
            const context: Context = {
                req,
                user,
                ip,
            }
            return context;
        },
    });

    await server.start();
    server.applyMiddleware({ app });

    await new Promise(resolve => httpServer.listen({ port }));
    console.log(`🚀 Server ready at http://localhost:${port}/${graphqlPath}`);
    return { server, app };
}

startApolloServer();