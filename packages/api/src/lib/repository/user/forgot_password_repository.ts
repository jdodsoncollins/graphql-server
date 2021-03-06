import { injectable } from "inversify";
import { EntityRepository, Repository } from "typeorm";

import { IBaseRepository } from "@/lib/repository/base_repository";
import { ForgotPassword } from "@/entity/user/forgot_password_entity";

export interface IForgotPasswordRepository extends IBaseRepository<ForgotPassword> {
  findForUser(userId: string): Promise<ForgotPassword>;
}

@injectable()
@EntityRepository(ForgotPassword)
export class ForgotPasswordRepository extends Repository<ForgotPassword> implements IForgotPasswordRepository {
  findById(uuid: string): Promise<ForgotPassword> {
    return this.findOneOrFail(uuid, {
      join: {
        alias: "forgot_password_token",
        leftJoinAndSelect: {
          user: "forgot_password_token.user",
        },
      },
    });
  }

  findForUser(userId: string): Promise<ForgotPassword> {
    return this.findOneOrFail({
      where: {
        user: userId,
      },
      join: {
        alias: "forgot_password_token",
        leftJoinAndSelect: {
          user: "forgot_password_token.user",
        },
      },
    });
  }
}
