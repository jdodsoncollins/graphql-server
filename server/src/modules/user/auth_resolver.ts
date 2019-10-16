import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { compare } from "bcryptjs";
import { inject, injectable } from "inversify";

import { MyContext } from "@/entity/types/my_context";
import { User } from "@/entity/user";
import { createAccessToken, createRefreshToken } from "@/handlers/auth";
import { sendRefreshToken } from "@/handlers/send_refresh_token";
import { LoginInput } from "@/modules/user/auth/login_input";
import { LoginResponse } from "@/modules/user/auth/login_response";
import { TYPES} from "@/modules/repository/repository_factory";
import { UserRepository } from "@/modules/repository/user_repository";

@injectable()
@Resolver(User)
export class AuthResolver {

    constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("data") { email, password }: LoginInput,
        @Ctx() { res }: MyContext,
    ): Promise<LoginResponse> {
        const user = await User.findOneOrFail({ where: { email } });

        if (!user) {
            throw new Error("could not find user");
        }

        const valid = await compare(password, user.password);

        if (!valid) {
            throw new Error("bad password");
        }

        sendRefreshToken(res, createRefreshToken(user));

        return {
            accessToken: createAccessToken(user),
            user,
        };
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() { res }: MyContext) {
        sendRefreshToken(res, "");
        return true;
    }

    @Mutation(() => Boolean)
    async revokeRefreshToken(@Arg("userId", () => String) userId: string) {
        try {
            await this.userRepository.incrementToken(userId);
            return true;
        } catch {
            return false;
        }
    }
}
