import { getModelForClass, modelOptions, prop as Prop, Severity } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";
import { UserRoles } from "../resolvers/user/user-roles";
import { Course } from "./courses-entity";

@modelOptions({ options: { allowMixed: Severity.ALLOW } })

@ObjectType()
export class User {
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

    @Field({ nullable: true })
    @Prop({ required: false })
    facultyNumber?: number;

    @Field()
    @Prop({ default: Date.now() })
    lastLogin?: number;

    @Field(type => [Course], { nullable: true })
    @Prop({ default: [] })
    courses?: Course[]

    @Field(type => [String])
    @Prop({ default: [UserRoles.STUDENT] })
    roles: string[]

}

export const UserModel = getModelForClass(User, { schemaOptions: { timestamps: true } });