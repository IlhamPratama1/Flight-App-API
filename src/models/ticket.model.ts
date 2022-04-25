import { Optional, Model, Sequelize, DataTypes, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin } from "sequelize";
import { BookFlight, Flight, Passanger, Ticket } from "../interface";

export type TicketCreationAttributes = Optional<Ticket, 'id'>;

export class TicketModel extends Model<Ticket, TicketCreationAttributes> implements Ticket {
    declare id: number;
    declare code: string;
    declare customerId: string;
    declare paymentId: string;

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
            }
        },
        {
            tableName: 'tickets',
            sequelize
        }
    );

    return TicketModel;
}