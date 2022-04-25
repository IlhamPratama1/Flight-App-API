import { Optional, Model, Sequelize, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin } from "sequelize";
import { BookFlight, Flight, Passanger, Ticket } from "../interface";

export type TicketCreationAttributes = Optional<Ticket, 'id'>;

export class TicketModel extends Model<Ticket, TicketCreationAttributes> implements Ticket {
    declare id: number;
    declare code: string;
    declare customerId: string;
    declare paymentId: string;
    declare covidInsurance: boolean;
    declare baggageInsurance: boolean;
    declare fullProtection: boolean;

    declare getFlightModel: BelongsToGetAssociationMixin<Flight>;
    declare setFlightModel: BelongsToSetAssociationMixin<Flight, number>;

    declare getBookModel: BelongsToGetAssociationMixin<BookFlight>;
    declare setBookModel: BelongsToSetAssociationMixin<BookFlight, number>;

    declare getPassangerModel: HasOneGetAssociationMixin<Passanger>;
    declare setPassangerModel: HasOneSetAssociationMixin<Passanger, number>;
}

export default function (sequelize: Sequelize): typeof TicketModel {
    TicketModel.init(
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
            customerId: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            paymentId: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            covidInsurance: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            baggageInsurance: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            fullProtection: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
        },
        {
            tableName: 'tickets',
            sequelize
        }
    );

    return TicketModel;
}