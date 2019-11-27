import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { inject, injectable } from "inversify";

import { LoginInput } from "./auth/login_input";
import { LoginResponse } from "./auth/login_response";
import { MyContext } from "../../lib/types/my_context";
import { IUserRepository } from "../../lib/repository/user/user_repository";
import { REPOSITORY, SERVICE } from "../../lib/constants/inversify";
import { AuthService } from "../../lib/services/auth/auth_service";

@injectable()
@Resolver()
export class AuthResolver {

    constructor(
        @inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
        @inject(SERVICE.AuthService) private authService: AuthService,
    ) {}

    @Mutation(() => LoginResponse)
    async login(
        @Arg("data") { email, password }: LoginInput,
        @Ctx() { res }: MyContext,
    ): Promise<LoginResponse> {
        const user = await this.userRepository.findByEmail(email);

        await user.verify(password);

        this.authService.sendRefreshToken(res, user);

        await this.userRepository.incrementLastLoginAt(user);

        return {
            accessToken: this.authService.createAccessToken(user),
            user,
        };
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() { res }: MyContext) {
        this.authService.sendRefreshToken(res, undefined);
        return true;
    }

    @Mutation(() => Boolean)
    async revokeRefreshToken(@Arg("userId", () => String) userId: string) {
        try {
            await this.userRepository.findById(userId);
            await this.userRepository.incrementToken(userId);
            return true;
        } catch {
            return false;
        }
    }
}