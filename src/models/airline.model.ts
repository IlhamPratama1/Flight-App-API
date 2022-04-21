import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Airline } from "../interface";

export type AirlineCreationAttributes = Optional<Airline, 'id'>;

export class AirlineModel extends Model<Airline, AirlineCreationAttributes> implements Airline {
    declare id: number;
    declare name: string;
    declare picture: string;
}

export default function (sequelize: Sequelize): typeof AirlineModel {
    AirlineModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING(255)
            },
            picture: {
                type: DataTypes.STRING(255)
            }
        },
        {
            tableName: 'airlines',
            sequelize
        }
    );

    return AirlineModel;
}