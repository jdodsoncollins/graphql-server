import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";

import { User } from "@entity/user";
import { isAuth, ResolveTime } from "@modules/user/is_auth";

@Resolver(User)
export class UserResolver {
    @Query(() => User)
    @UseMiddleware(isAuth)
    async user(@Arg("uuid") uuid: string) {
        return await User.findOne({ uuid });
    }

    @Query(() => [User])
    @UseMiddleware(ResolveTime)
    users() {
        return User.find();
    }

    @Query(() => [User])
    @UseMiddleware(isAuth)
    alt() {
        return User.find();
    }
}