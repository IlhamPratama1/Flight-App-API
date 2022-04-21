import DB from "../databases";
import { HttpException } from "../exceptions/HttpException";
import { User } from "../interface";

export default class UserService {
    public users = DB.Users;

    public async getAllUser(): Promise<User[]> {
        const users = await this.users.findAll();
        return users;
    }

    public async getUserById(userId: number): Promise<User> {
        const user = await this.users.findByPk(userId);
        if (!user) throw new HttpException(400, `User not found`);

        return user;
    }

    public async getUserByUsername(username: string): Promise<User> {
        const user = await this.users.findOne({ where: { username: username } });
        if (!user) throw new HttpException(400, `User not found`);

        return user;
    }

    public async deleteUser(userId: number): Promise<void> {
        const user = await this.users.findByPk(userId);
        if (!user) throw new HttpException(400, `User not found`);

        await user.destroy();
    }
}