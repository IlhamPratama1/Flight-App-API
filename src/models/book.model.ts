import { Optional, Model, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, HasManyGetAssociationsMixin, HasManySetAssociationsMixin, Sequelize, DataTypes } from 'sequelize';
import { BookFlight, Flight, Passanger, User } from "../interface";

export type BookCreationAttributes = Optional<BookFlight, 'id'>;

export class BookModel extends Model<BookFlight, BookCreationAttributes> implements BookFlight {
    declare id: number;
    declare expiryDate: Date;
    declare status: string;
    declare amount: number;

    declare getUserModel: BelongsToGetAssociationMixin<User>;
    declare setUserModel: BelongsToSetAssociationMixin<User, number>;

    declare getFlightModel: BelongsToGetAssociationMixin<Flight>;
    declare setFlightModel: BelongsToSetAssociationMixin<Flight, number>;

    declare getPassangerModels: HasManyGetAssociationsMixin<Passanger>;
    declare setPassangerModels: HasManySetAssociationsMixin<Passanger, number>;
}

export default function (sequelize: Sequelize): typeof BookModel {
    BookModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            expiryDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM("PENDING", "COMPLETE", "FAILED"),
                allowNull: false
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'books',
            sequelize
        }
    );

    return BookModel;
}

