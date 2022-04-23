import DB from "../databases";
import { HttpException } from "../exceptions/HttpException";
import { User } from '../interface';

export default class AuthMidddlewareService {
    private users = DB.Users;

    public async checkUserRoleIs(userId: number, userRole: string, userRole2?: string): Promise<{ user: User, isRole: boolean }> {
        const user = await this.users.findByPk(userId);
        if (!user) throw new HttpException(400, `User with token not found`);
        const roles = await user.getRoleModels();

        let isUser: boolean = false;
        let isRole: boolean = false;

        roles.forEach(role => { if (role.name === userRole || role.name === userRole2) isUser = true; });
        if (user && user.isVerfied && isUser) isRole = true;

        return { user: user, isRole: isRole };
    }
}