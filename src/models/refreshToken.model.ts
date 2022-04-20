import { Model, DataTypes, Sequelize, Optional, HasOneSetAssociationMixin, HasOneGetAssociationMixin } from "sequelize";
import { RefreshToken, User } from "../interface";

export type TokenreationAttributes = Optional<RefreshToken, 'id'>;

class RefreshTokenModel extends Model<RefreshToken, TokenreationAttributes> implements RefreshToken {
    declare id: number;
    declare token: string;
    declare expiryDate: Date;

    declare getUserModel: HasOneGetAssociationMixin<User>;
    declare setUserModel: HasOneSetAssociationMixin<User, number>;
}

export default function (sequelize: Sequelize): typeof RefreshTokenModel {
    RefreshTokenModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false
            },
            expiryDate: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'refreshToken',
            sequelize
        }
    );

    return RefreshTokenModel;
}