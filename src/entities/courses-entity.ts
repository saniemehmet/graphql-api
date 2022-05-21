import { getModelForClass, prop as Prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";

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