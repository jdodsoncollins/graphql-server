import { Arg, Mutation, Resolver } from "type-graphql";
import { hash } from "bcryptjs";
import { inject, injectable } from "inversify";

import { RegisterInput } from "@/modules/user/auth/register_input";
import { RegisterResponse } from "@/modules/user/auth/register_response";
import { TYPES } from "@/lib/repository/repository_factory";
import { RegisterEmail } from "@/lib/services/email/user/register_email";
import { User } from "@/entity/user";
import { EmailConfirmationRepository } from "@/lib/repository/user/email_confirmation_repository";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { EmailConfirmation } from "@/entity/email_confirmation";

@injectable()
@Resolver()
export class RegisterResolver {

    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository,
        @inject(TYPES.UserConfirmationRepository) private userConfirmationRepository: EmailConfirmationRepository,
        @inject(TYPES.RegisterEmail) private registerEmail: RegisterEmail,
    ) {}

    @Mutation(() => Boolean!)
    async resentConfirmEmail(
        @Arg("email") email: string,
    ): Promise<boolean> {
        const userConfirmation = await this.userConfirmationRepository.findByEmail(email);
        try {
            await this.registerEmail.send(userConfirmation);
            return true;
        } catch(e) {
            console.log(e);
        }
        return false;
    }

    @Mutation(() => RegisterResponse!)
    async register(
        @Arg("data") { email, uuid, firstName, lastName, password }: RegisterInput,
    ): Promise<RegisterResponse> {
        await this.guardAgainstDuplicateUser(email, uuid);
        const user = new User(uuid);
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = await hash(password, 12);
        try {
            await this.userRepository.save(user);
            const userConfirmation = new EmailConfirmation();
            userConfirmation.user = user;
            await this.userConfirmationRepository.save(userConfirmation);
            await this.registerEmail.send(userConfirmation);
            return { user, userConfirmation };
        } catch (e) {
            console.log(e);
        }
        return {};
    }

    private async guardAgainstDuplicateUser(email: string, uuid?: string) {
        let user: User|undefined = undefined;
        if (uuid) {
            try {
                user = await this.userRepository.findById(uuid);
            } catch (e) {
            }
            if (user) throw new Error("duplicate uuid for user");
        }
        try {
            user = await this.userRepository.findByEmail(email);
        } catch (e) {
        }
        if (user) throw new Error("duplicate email for user");
    }
}
