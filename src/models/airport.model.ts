import { Optional, Model, Sequelize, DataTypes } from "sequelize";
import { Airport } from "../interface";

export type AirportCreationAttributes = Optional<Airport, 'id'>

export class AirportModel extends Model<Airport, AirportCreationAttributes> implements Airport {
    declare id: number;
    declare code: string;
    declare city: string;
    declare name: string;
}

export default function (sequelize: Sequelize): typeof AirportModel {
    AirportModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            code: {
                type: DataTypes.STRING(5),
                allowNull: false,
                unique: true
            },
            city: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false
            }
        },
        {
            tableName: 'airports',
            sequelize
        }
    );

    return AirportModel;
}

