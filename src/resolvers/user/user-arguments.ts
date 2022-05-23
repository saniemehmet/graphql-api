import { IsEmail, IsInt, IsPositive, MaxLength, Min, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Course } from "../../entities/courses-entity";
import { UserCourseInput } from "../course/course-arguments";

@InputType({ description: "New student data" })
export class UserInput {

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

    @Field({ nullable: true })
    @IsInt()
    @IsPositive()
    @Min(1000000000)
    facultyNumber?: number;

    @Field(type => [String], { nullable: true })
    coursesIDs?: string[]

    @Field(type => [String], { nullable: true })
    roles?: string[]
}

@InputType()
export class UpdateUserInput {

    @Field({ nullable: true })
    @MaxLength(50)
    name?: string;

    @Field({ nullable: true })
    @IsEmail()
    @MaxLength(30)
    email?: string;

    @Field({ nullable: true })
    @MinLength(6)
    password?: string;

    @Field({ nullable: true })
    @IsInt()
    @IsPositive()
    @Min(1000000000)
    facultyNumber?: number;

    @Field(type => [UserCourseInput], { nullable: true })
    courses?: Course[]
}