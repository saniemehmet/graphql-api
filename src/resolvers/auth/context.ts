import { Request } from "express";
import { User } from "../../entities/user-entity";

export interface Context {
    req: Request,
    user: User,
    ip: any,
}