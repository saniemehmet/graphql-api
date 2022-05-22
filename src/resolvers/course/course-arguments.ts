import { IsInt, IsPositive, Length, MaxLength, Min } from "class-validator";
import { ObjectId } from "mongodb";
import { Field, InputType } from "type-graphql";

@InputType({ description: "Course data" })
export class CourseInput {
    @Field()
    @Length(2, 100)
    title: string;

    @Field()
    @MaxLength(10000)
    description: string;

    @Field()
    @Length(2, 30)
    subject: string;

    @Field()
    @IsInt()
    @IsPositive()
    @Min(1)
    credits: number;

    @Field()
    @Length(2, 40)
    tutor: string;

}

@InputType({ description: "Course data" })
export class UpdateCourseInput {
    @Field({ nullable: true })
    @Length(2, 100)
    title?: string;

    @Field({ nullable: true })
    @MaxLength(10000)
    description?: string;

    @Field({ nullable: true })
    @Length(2, 30)
    subject?: string;

    @Field({ nullable: true })
    @IsInt()
    @IsPositive()
    @Min(1)
    credits?: number;

    @Field({ nullable: true })
    @Length(2, 40)
    tutor?: string;

}

@InputType()
export class StudentCourseInput extends CourseInput {
    @Field({ nullable: false })
    _id: ObjectId;
}