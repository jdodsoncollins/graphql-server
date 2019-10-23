import produce from "immer";

import { User } from "@/entity/user_entity";
import { Role } from "@/entity/role_entity";
import { Permission } from "@/entity/permission_entity";
import { ForgotPassword } from "@/entity/forgot_password_entity";
import { EmailConfirmation } from "@/entity/email_confirmation_entity";
import { TestingInversifyContainer } from "@/lib/testing_inversify_container";
import { MyContext } from "@/lib/types/my_context";
import { mockRequest, mockResponse } from "@/modules/user/auth_resolver.spec";
import { isAuth } from "@/lib/middleware/is_auth";

describe("is_auth", () => {
    const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

    let container: TestingInversifyContainer;
    let context: MyContext;

    beforeEach(async () => {
        container = await TestingInversifyContainer.create(entities);
        context = {
            res: mockResponse(),
            req: mockRequest(),
            container,
        };
    });

    test("guards against missing token", async () => {
        // arrange
        // act
        const params: any = { context };
        const next: any = () => {};

        // assert
        await expect(isAuth(params, next)).rejects.toThrowError("not authenticated");
    });

    test("guards against invalid token", async () => {
        // arrange
        // act
        const newContext = produce(context, oldContext => {
            oldContext.req = mockRequest("bearer foobar-valid-jwt");
            return oldContext;
        });
        const params: any = { context: newContext };
        const next: any = () => {};

        // assert
        await expect(isAuth(params, next)).rejects.toThrowError("not authenticated");
    });
});