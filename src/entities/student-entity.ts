import { getModelForClass, prop as Prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";

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

}

export const StudentModel = getModelForClass(Student, { schemaOptions: { timestamps: true } });