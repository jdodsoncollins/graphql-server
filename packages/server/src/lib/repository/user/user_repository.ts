import { injectable } from "inversify";
import { EntityRepository, Repository } from "typeorm";
import { User } from "@/entity/user";

@injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    findById(uuid: string) {
        return this.findOneOrFail(uuid);
    }

    findByEmail(email: string) {
        return this.findOneOrFail({ where: { email } });
    }

    async incrementLastLoginAt(user: User): Promise<void> {
        user.lastLoginAt = new Date();
        await this.save(user);
    }

    async incrementToken(userId: string): Promise<void> {
        await this.increment({ uuid: userId }, "tokenVersion", 1);
    }
}