import { Arg, Mutation, Query, Resolver } from "type-graphql";
import bcryptjs from "bcryptjs";
import { Student, StudentModel } from "../../entities/student-entity";
import { StudentInput, UpdateStudentInput } from "./student-arguments";

@Resolver()
export class StudentResolver {
    @Query(returns => Student)
    async student(@Arg("_id") _id: string): Promise<Student> {
        return await StudentModel.findById(_id);
    }

    @Query(returns => [Student])
    async students(): Promise<Student[]> {
        return await StudentModel.find({});
    }

    @Mutation(returns => Student)
    async registerStudent(@Arg("data") data: StudentInput): Promise<Student> {
        const studentData = { ...data, password: bcryptjs.hashSync(data.password, 5) }
        const newStudent = new StudentModel(studentData);
        await newStudent.save();
        return newStudent;
    }

    @Mutation(returns => Student)
    async deleteStudent(@Arg("_id") _id: string): Promise<Student> {
        return await StudentModel.findByIdAndRemove(_id);
    }

    @Mutation(returns => Student)
    async updateStudent(@Arg("_id") _id: string, @Arg("data") data: UpdateStudentInput): Promise<Student> {
        
        const studentData = data.password ? { ...data, password: bcryptjs.hashSync(data.password, 10) } :data;
        return await StudentModel.findByIdAndUpdate(_id, studentData, {new: true});
    }
}