import { getModelForClass, modelOptions, prop as Prop, Severity } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";
import { Student } from "./student-entity";

@modelOptions({ options: {allowMixed: Severity.ALLOW}})

@ObjectType()
export class Course {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field()
  @Prop({ required: true })
  subject: string;

  @Field()
  @Prop({ required: true })
  credits: number;

  @Field()
  @Prop({ required: true })
  tutor: string;

}

export const CourseModel = getModelForClass(Course);