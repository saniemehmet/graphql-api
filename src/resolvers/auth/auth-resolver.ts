import { Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import bcryptjs from "bcryptjs";
import { LoginInput } from "./login-arguments";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { getToken } from "./token";
import { Context } from "./context";
import { User, UserModel } from "../../entities/user-entity";
import { Service } from "typedi";

@Service()
@Resolver()
export class AuthResolver {
    @Query(returns => User)
    async currentUser(@Ctx() ctx: Context): Promise<User> {
        // console.log(ctx);
        if(!ctx.user){
            throw new AuthenticationError("User not authenticated");
        }
        return await UserModel.findById(ctx.user._id);
    }

    @Mutation(returns => String)
    async login(@Args(){email, password}: LoginInput): Promise<string> {
        const user = await UserModel.findOne({email});
        if(!user){
            throw new UserInputError('Wrong email or password!');
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid){
            throw new UserInputError('Wrong email or password!');
        }
        user.lastLogin = Date.now();
        await user.save();
        return getToken(user._id, user.roles);
    }
}