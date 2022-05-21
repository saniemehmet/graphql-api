import { ObjectId } from "mongodb";
import { buildSchema } from "type-graphql";
import * as path from "path";
import { ObjectIdScalar } from "./object-id.scalar";
import { TypegooseMiddleware } from "../typegoose-middleware";
import { StudentResolver } from "./resolvers/student/student-resolver";

export const getSchema = async () => {
    const schema = await buildSchema({
        resolvers: [
            StudentResolver
        ],
        emitSchemaFile: path.resolve(__dirname, "schema.gql"),
        globalMiddlewares: [TypegooseMiddleware],
        scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    });
    return schema;
}
