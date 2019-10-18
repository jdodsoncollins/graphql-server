import { Container as InversifyContainer, interfaces } from "inversify";

import { AuthResolver } from "@/modules/user/auth_resolver";
import { AppResolver } from "@/modules/app/app_resolver";
import { ForgotPasswordResolver } from "@/modules/user/forgot_password_resolver";
import { MeResolver } from "@/modules/user/me_resolver";
import { UserResolver } from "@/modules/user/user_resolver";
import { RepositoryFactory, TYPES } from "@/lib/repository/repository_factory";
import { ForgotPasswordEmail } from "@/lib/services/email/user/forgot_password_email";
import { UserRepository } from "@/lib/repository/user_repository";
import { ServiceFactory } from "@/lib/services/service_factory";
import { EmailService } from "@/lib/services/email/email_service";
import { UserConfirmationResolver } from "@/modules/user/user_confirmation_resolver";
import { UserConfirmationRepository } from "@/lib/repository/user_confirmation_repository";
import { RegisterResolver } from "@/modules/user/register_resolver";
import { RegisterEmail } from "@/lib/services/email/user/register_email";
import { ForgotPasswordRepository } from "@/lib/repository/forgot_password_repository";

export class Container extends InversifyContainer {
    public constructor(
        protected readonly repositoryFactory: RepositoryFactory,
        protected readonly serviceFactory: ServiceFactory,
        containerOptions?: interfaces.ContainerOptions,
    ) {
        super(containerOptions);
        this.bindContainer();
    }

    protected bindContainer(): void {
        // app resolvers
        this.bind(AppResolver).toSelf();
        // user resolvers
        this.bind(AuthResolver).toSelf();
        this.bind(ForgotPasswordResolver).toSelf();
        this.bind(MeResolver).toSelf();
        this.bind(RegisterResolver).toSelf();
        this.bind(UserConfirmationResolver).toSelf();
        this.bind(UserResolver).toSelf();

        // services
        this.bind<EmailService>(TYPES.EmailService).toConstantValue(this.serviceFactory.emailService);
        this.bind<ForgotPasswordEmail>(TYPES.ForgotPasswordEmail).to(ForgotPasswordEmail);
        this.bind<RegisterEmail>(TYPES.RegisterEmail).to(RegisterEmail);

        // repositories
        this.bind<ForgotPasswordRepository>(TYPES.ForgotPasswordRepository).toConstantValue(this.repositoryFactory.forgotPasswordRepository);
        this.bind<UserRepository>(TYPES.UserRepository).toConstantValue(this.repositoryFactory.userRepository);
        this.bind<UserConfirmationRepository>(TYPES.UserConfirmationRepository).toConstantValue(this.repositoryFactory.userConfirmationRepository);
    }
}