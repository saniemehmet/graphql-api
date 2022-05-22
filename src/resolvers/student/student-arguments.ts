import { IsEmail, IsInt, IsPositive, MaxLength, Min, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Course } from "../../entities/courses-entity";
import { StudentCourseInput } from "../course/course-arguments";

@InputType({ description: "New student data" })
export class StudentInput {

    @Field()
    @MaxLength(50)
    name: string;

    @Field()
    @IsEmail()
    @MaxLength(30)
    email: string;

    @Field()
    @MinLength(6)
    password: string;

    @Field()
    @IsInt()
    @IsPositive()
    @Min(1000000000)
    facultyNumber: number;

    @Field(type => [String], { nullable: true})
    coursesIDs?: string[]
}

@InputType()
export class UpdateStudentInput {

    @Field({ nullable: true})
    @MaxLength(50)
    name?: string;

    @Field({ nullable: true})
    @IsEmail()
    @MaxLength(30)
    email?: string;

    @Field({ nullable: true})
    @MinLength(6)
    password?: string;

    @Field({ nullable: true})
    @IsInt()
    @IsPositive()
    @Min(1000000000)
    facultyNumber?: number;
    
    @Field(type => [StudentCourseInput], {nullable: true})
    courses?: Course[]
}