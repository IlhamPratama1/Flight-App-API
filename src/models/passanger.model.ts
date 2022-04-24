import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Passanger } from "../interface";

export type PassangerCreationAttributes = Optional<Passanger, 'id'>;

export class PassangerModel extends Model<Passanger, PassangerCreationAttributes> implements Passanger {
    declare id: number;
    declare title: string;
    declare name: string;
    declare age: string;
    declare noIdentity: string;
    declare nation: string;
    declare birthDate: Date;
}

export default function (sequelize: Sequelize): typeof PassangerModel {
    PassangerModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            age: {
                type: DataTypes.ENUM("adult", "child", "baby"),
                allowNull: false
            },
            noIdentity: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            nation: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            birthDate: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'passangers',
            sequelize
        }
    );

    return PassangerModel;
}