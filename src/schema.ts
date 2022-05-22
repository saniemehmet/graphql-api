import { ObjectId } from "mongodb";
import { buildSchema } from "type-graphql";
import * as path from "path";
import { ObjectIdScalar } from "./object-id.scalar";
import { TypegooseMiddleware } from "./typegoose-middleware";
import { StudentResolver } from "./resolvers/student/student-resolver";
import { CourseResolver } from "./resolvers/course/course-resolver";
import Container from "typedi";


export const getSchema = async () => {
    const courseResolver = new CourseResolver()
    Container.set('course.resolver', courseResolver)
    
    const schema = await buildSchema({
        resolvers: [
            StudentResolver,
            CourseResolver
        ],
        container: Container,
        emitSchemaFile: path.resolve(__dirname, "schema.gql"),
        globalMiddlewares: [TypegooseMiddleware],
        scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    });
    return schema;
}
