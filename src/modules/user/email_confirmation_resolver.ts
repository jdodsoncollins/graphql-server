import { inject, injectable } from "inversify";
import { Arg, Mutation, Resolver } from "type-graphql";

import { IEmailConfirmationRepository } from "@/lib/repository/user/email_confirmation_repository";
import { REPOSITORY } from "@/lib/constants/inversify";
import { VerifyEmailInput } from "@/modules/user/auth/verify_email_input";
import { IUserRepository } from "@/lib/repository/user/user_repository";

@injectable()
@Resolver()
export class EmailConfirmationResolver {
    constructor(
        @inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
        @inject(REPOSITORY.EmailConfirmationRepository) private userConfirmationRepository: IEmailConfirmationRepository
    ) {
    }

    @Mutation(() => Boolean!)
    async verifyEmailConfirmation(
        @Arg("data") { uuid, email }: VerifyEmailInput
    ): Promise<boolean> {
        const userConfirmation = await this.userConfirmationRepository.findById(uuid);
        if (userConfirmation.user.email !== email) {
            throw new Error("invalid user and confirmation");
        }
        try {
            const { user } = userConfirmation;
            user.isEmailConfirmed = true;
            await this.userRepository.save(user);
            await this.userConfirmationRepository.delete(userConfirmation.uuid);
            return true;
        } catch(e) {
            console.log(e);
        }
        return false;
    }
}
