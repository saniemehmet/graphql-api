import { ObjectId } from "mongodb";
import { buildSchema } from "type-graphql";
import * as path from "path";
import { ObjectIdScalar } from "./object-id.scalar";
import { TypegooseMiddleware } from "./typegoose-middleware";
import { CourseResolver } from "./resolvers/course/course-resolver";
import Container from "typedi";
import { UserResolver } from "./resolvers/user/user-resolver";
import { authChecker } from "./resolvers/auth/auth-checker";
import { AuthResolver } from "./resolvers/auth/auth-resolver";

export const getSchema = async () => {
    const courseResolver = new CourseResolver()
    Container.set('course.resolver', courseResolver)

    const schema = await buildSchema({
        resolvers: [
            UserResolver,
            CourseResolver,
            AuthResolver
        ],
        container: Container,
        emitSchemaFile: path.resolve(__dirname, "schema.gql"),
        globalMiddlewares: [TypegooseMiddleware],
        scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
        authChecker,
    });
    return schema;
}
