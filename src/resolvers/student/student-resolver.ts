import { Arg, Mutation, Query, Resolver } from "type-graphql";
import bcryptjs from "bcryptjs";
import { Student, StudentModel } from "../../entities/student-entity";
import { StudentInput, UpdateStudentInput } from "./student-arguments";
import { Course } from "../../entities/courses-entity";
import { CourseResolver } from "../course/course-resolver";
import { Inject } from "typedi";
import { Service } from "typedi";

type StudentModel = InstanceType<typeof StudentModel>;

@Service()
@Resolver()
export class StudentResolver {
    courseResolver: CourseResolver;
    constructor(
        @Inject('course.resolver') resolver: CourseResolver,
    ) {
        this.courseResolver = resolver;
    }

    @Query(returns => Student)
    async student(@Arg("_id") _id: string): Promise<Student> {
        return await StudentModel.findById(_id);
    }

    @Query(returns => [Student])
    async students(): Promise<Student[]> {
        return await StudentModel.find({});
    }

    @Mutation(returns => Student)
    async createStudent(@Arg("data") data: StudentInput): Promise<Student> {

        const studentData = { ...data, password: bcryptjs.hashSync(data.password, 5) }
        const newStudent = new StudentModel(studentData);
        if (newStudent.courses == undefined) {
            newStudent.courses = [];
        }
        await this.assignCourses(data.coursesIDs, newStudent);
        await newStudent.save();
        return newStudent;
    }

    @Mutation(returns => Student)
    async deleteStudent(@Arg("_id") _id: string): Promise<Student> {
        return await StudentModel.findByIdAndRemove(_id);
    }

    @Mutation(returns => Student)
    async updateStudent(@Arg("_id") _id: string, @Arg("data") data: UpdateStudentInput,
                        @Arg("coursesIds", () => [String] , {nullable: true}) coursesIds: string[]): Promise<Student> {
        const studentData = data.password ? { ...data, password: bcryptjs.hashSync(data.password, 10) } : data;
        const student = new StudentModel();
        if(coursesIds && !data.courses){
            await this.assignCourses(coursesIds, student);
            studentData.courses = student.courses;
        }
        return await StudentModel.findByIdAndUpdate(_id, studentData, { new: true });
    }

    async assignCourses(coursesIDs: string[], student: StudentModel){
        await Promise.all(coursesIDs.map(async (id) => {
            const promise: Promise<Course> = this.courseResolver.course(id).then((res) => {
                student.courses.push(res);
                return res;
            });
            await Promise.resolve(promise);
        }));
    }
}