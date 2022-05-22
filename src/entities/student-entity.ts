import { getModelForClass, modelOptions, prop as Prop, Severity } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";
import { Course } from "./courses-entity";

@modelOptions({ options: {allowMixed: Severity.ALLOW}})

@ObjectType()
export class Student {
    @Field()
    readonly _id: ObjectId;

    @Field()
    @Prop({ required: true })
    name: string;

    @Field()
    @Prop({ required: true, unique: true })
    email: string;

    @Field()
    @Prop({ required: true })
    password: string;

    @Field()
    @Prop({ required: true, unique: true })
    facultyNumber: number;

    @Field()
    @Prop({ default: Date.now() })
    lastLogin?: number;

    @Field(type => [Course], {nullable: true})
    @Prop({default: []})
    courses?: Course[]

}

export const StudentModel = getModelForClass(Student, { schemaOptions: { timestamps: true } });