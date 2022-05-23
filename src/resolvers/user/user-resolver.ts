import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import bcryptjs from "bcryptjs";
import { User, UserModel } from "../../entities/user-entity";
import { UserInput, UpdateUserInput } from "./user-arguments";
import { Course } from "../../entities/courses-entity";
import { CourseResolver } from "../course/course-resolver";
import { Inject } from "typedi";
import { Service } from "typedi";
import { UserRoles } from "./user-roles";

type UserModel = InstanceType<typeof UserModel>;

@Service()
@Resolver()
export class UserResolver {
    courseResolver: CourseResolver;
    constructor(
        @Inject('course.resolver') resolver: CourseResolver,
    ) {
        this.courseResolver = resolver;
    }

    @Query(returns => User)
    async user(@Arg("_id") _id: string): Promise<User> {
        return await UserModel.findById(_id);
    }

    @Query(returns => [User])
    async users(): Promise<User[]> {
        return await UserModel.find({});
    }

    @Mutation(returns => User)
    async createUser(@Arg("data") data: UserInput): Promise<User> {

        const userData = { ...data, password: bcryptjs.hashSync(data.password, 5) }
        const newUser = new UserModel(userData);
        if (newUser.courses == undefined) {
            newUser.courses = [];
        }
        await this.assignCourses(data.coursesIDs, newUser);
        await newUser.save();
        return newUser;
    }

    @Mutation(returns => User)
    @Authorized([UserRoles.ADMIN])
    async deleteUser(@Arg("_id") _id: string): Promise<User> {
        return await UserModel.findByIdAndRemove(_id);
    }

    @Mutation(returns => User)
    @Authorized([UserRoles.ADMIN, UserRoles.TUTOR, UserRoles.STUDENT])
    async updateUser(@Arg("_id") _id: string, @Arg("data") data: UpdateUserInput,
        @Arg("coursesIds", () => [String], { nullable: true }) coursesIds: string[]): Promise<User> {
        const userData = data.password ? { ...data, password: bcryptjs.hashSync(data.password, 10) } : data;

        if (coursesIds && !data.courses) {
            const user = new UserModel();
            await this.assignCourses(coursesIds, user);
            userData.courses = user.courses;
        }
        return await UserModel.findByIdAndUpdate(_id, userData, { new: true });
    }

    async assignCourses(coursesIDs: string[], user: UserModel) {
        await Promise.all(coursesIDs.map(async (id) => {
            const promise: Promise<Course> = this.courseResolver.course(id).then((res) => {
                user.courses.push(res);
                return res;
            });
            await Promise.resolve(promise);
        }));
    }
}