// Lib
import { Model, Sequelize, DataTypes, Optional, HasManyGetAssociationsMixin, BelongsToManyGetAssociationsMixin, BelongsToManySetAssociationsMixin } from 'sequelize';
import { User, Role, BookFlight } from '../interface';

export type UserCreationAttributes = Optional<User, 'id'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
    declare id: number;
    declare username: string;
    declare email: string;
    declare password: string;
    declare isVerfied: boolean;
    declare confirmationCode: string;
    declare profilePicture: string;

    declare getRoleModels: BelongsToManyGetAssociationsMixin<Role>;
    declare setRoleModels: BelongsToManySetAssociationsMixin<Role, number>;

    declare getBookModels: HasManyGetAssociationsMixin<BookFlight>;
}

export default function (sequelize: Sequelize): typeof UserModel {
    UserModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            username: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING(45)
            },
            email: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING(255)
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING(255)
            },
            isVerfied: {
                type: DataTypes.BOOLEAN
            },
            confirmationCode: {
                unique: true,
                type: DataTypes.STRING(255)
            },
            profilePicture: {
                type: DataTypes.STRING(255)
            }
        },
        {
            tableName: 'users',
            sequelize,
        },
    );
  
    return UserModel;
  }