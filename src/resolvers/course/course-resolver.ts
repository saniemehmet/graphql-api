import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { Course, CourseModel } from "../../entities/courses-entity";
import { UserRoles } from "../user/user-roles";
import { CourseInput, UpdateCourseInput } from "./course-arguments";

@Service()
@Resolver()
export class CourseResolver {
    @Query(returns => Course)
    async course(@Arg("_id") _id: string): Promise<Course> {
        return await CourseModel.findById(_id);
    }

    @Query(returns => [Course])
    async courses(): Promise<Course[]> {
        return await CourseModel.find({});
    }

    @Mutation(returns => Course)
    @Authorized([UserRoles.ADMIN, UserRoles.TUTOR])
    async createCourse(@Arg("data") data: CourseInput): Promise<Course> {
        const newCourse = new CourseModel(data);
        await newCourse.save();
        return newCourse;
    }

    @Mutation(returns => Course)
    @Authorized([UserRoles.ADMIN, UserRoles.TUTOR])
    async deleteCourse(@Arg("_id") _id: string): Promise<Course> {
        return await CourseModel.findByIdAndRemove(_id);
    }

    @Mutation(returns => Course)
    @Authorized([UserRoles.ADMIN, UserRoles.TUTOR])
    async updateCourse(@Arg("_id") _id: string, @Arg("data") data: UpdateCourseInput): Promise<Course> {
        return await CourseModel.findByIdAndUpdate(_id, data, {new: true});
    }
}