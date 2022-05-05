import { deleteCacheData, getOrSetCache } from "../cache";
import DB from "../databases";
import { HttpException } from "../exceptions/HttpException";
import { BookFlight, User } from "../interface";

export default class UserService {
    public users = DB.Users;
    public flights = DB.Flights;
    public tickets = DB.Tickets;

    public async getAllUser(): Promise<User[]> {
        const users = await getOrSetCache('users', async () => {
            return await this.users.findAll();
        });
        return users;
    }

    public async getUserById(userId: number): Promise<User> {
        const user = await getOrSetCache(`user/${userId}`, async () => {
            const data = await this.users.findByPk(userId);
            if (!data) throw new HttpException(400, `User not found`);
            return data;
        });

        return user;
    }

    public async getUserByUsername(username: string): Promise<User> {
        const user = await getOrSetCache(`user/${username}`, async () => {
            const data = await this.users.findOne({ where: { username: username } });
            if (!data) throw new HttpException(400, `User not found`);
            return data;
        });

        return user;
    }

    public async deleteUser(userId: number): Promise<void> {
        const user = await this.users.findByPk(userId);
        if (!user) throw new HttpException(400, `User not found`);

        await deleteCacheData('users');
        await deleteCacheData(`user/${user.id}`);

        await user.destroy();
    }

    public async getBookedFlight(userId: number): Promise<BookFlight[]> {
        const user = await this.users.findByPk(userId);
        if (!user) throw new HttpException(400, `User not found`);

        const bookedFlights = await getOrSetCache(`booked/${user.id}`, async () => {
            const data = await user.getBookModels({ 
                include: [ 
                    { model: this.flights },
                    { model: this.tickets } 
                ] 
            }); 
            return data;
        });

        return bookedFlights;
    }
}