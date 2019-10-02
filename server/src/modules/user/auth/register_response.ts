import { User } from "@entity/user";
import { Field, ObjectType } from "type-graphql";
import { UserConfirmation } from "@entity/user_confirmation";

@ObjectType()
export class RegisterResponse {
    @Field(() => User)
    user: User;
    @Field(() => UserConfirmation)
    userConfirmation: UserConfirmation;
}