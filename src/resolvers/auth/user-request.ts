import { Request } from "express"
import { User } from "../../entities/user-entity"


declare module "express" { 
  export interface Request {
    user: User
  }
}