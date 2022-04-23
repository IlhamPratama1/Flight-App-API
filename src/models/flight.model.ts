import { Optional, Model, Sequelize, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin } from "sequelize";
import { Airline, Airport, Flight } from "../interface";

export type FlightCreationAttributes = Optional<Flight, 'id'>;

export class FlightModel extends Model<Flight, FlightCreationAttributes> implements Flight {
    declare id: number;
    declare code: string;
    declare flightDate: Date;
    declare arrivalDate: Date;
    declare flightTime: Date;
    declare arrivalTime: Date;
    declare adultPx: number;
    declare childPx: number;
    declare babyPx: number;
    declare seatType: string;
    declare totalSeat: number;
    declare baggage: number;

    declare getAirlineModel: BelongsToGetAssociationMixin<Airline>;
    declare setAirlineModel: BelongsToSetAssociationMixin<Airline, number>;

    declare getAirportModel: BelongsToGetAssociationMixin<Airport>;
    declare setAirportModel: BelongsToSetAssociationMixin<Airport, number>;
}

export default function (sequelize: Sequelize): typeof FlightModel {
    FlightModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            code: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true
            },
            flightDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            arrivalDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            flightTime: {
                type: DataTypes.TIME,
                allowNull: false
            },
            arrivalTime: {
                type: DataTypes.TIME,
                allowNull: false
            },
            adultPx: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            childPx: {
                type: DataTypes.DECIMAL,
                allowNull: false
            },
            babyPx: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            seatType: {
                type: DataTypes.ENUM("economic", "premium", "bussiness", "first"),
                allowNull: false
            },
            totalSeat: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            baggage: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'flights',
            sequelize
        },
    );

    return FlightModel;
}