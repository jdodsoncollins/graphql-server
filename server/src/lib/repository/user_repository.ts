import { injectable } from "inversify";
import { Repository } from "typeorm";
import { User } from "@/entity/user";
import { BaseRepository } from "@/lib/repository/base_repository";

@injectable()
export class UserRepository extends BaseRepository<User> {
    constructor(repository: Repository<User>) {
        super(repository);
    }

    async incrementLastLoginAt(user: User): Promise<void> {
        user.lastLoginAt = new Date();
        await this.save(user);
    }

    async incrementToken(userId: string): Promise<void> {
        await this.repository.increment({ uuid: userId }, "tokenVersion", 1);
    }

    findByEmail(email: string): Promise<User> {
        return this.repository.findOneOrFail({ where: { email } });
    }
}