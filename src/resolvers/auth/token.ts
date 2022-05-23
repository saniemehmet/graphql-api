import jsonwebtoken from "jsonwebtoken";
import { ObjectId } from "mongodb";

export function getToken(_id: ObjectId, roles: string[]) {
    console.log("gettoken", roles);
    return jsonwebtoken.sign({
        _id,
        roles,
    },
        process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION ?? '1d'
    }
    )
}