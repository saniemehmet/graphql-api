import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Course, CourseModel } from "../../entities/courses-entity";
import { CourseInput, UpdateCourseInput } from "./course-arguments";

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
    async createCourse(@Arg("data") data: CourseInput): Promise<Course> {
        const newCourse = new CourseModel(data);
        await newCourse.save();
        return newCourse;
    }

    @Mutation(returns => Course)
    async deleteCourse(@Arg("_id") _id: string): Promise<Course> {
        return await CourseModel.findByIdAndRemove(_id);
    }

    @Mutation(returns => Course)
    async updateCourse(@Arg("_id") _id: string, @Arg("data") data: UpdateCourseInput): Promise<Course> {
        return await CourseModel.findByIdAndUpdate(_id, data, {new: true});
    }
}