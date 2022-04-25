import { 
    Optional, Model, BelongsToGetAssociationMixin, 
    BelongsToSetAssociationMixin, HasManyGetAssociationsMixin, HasManySetAssociationsMixin, 
    Sequelize, DataTypes, BelongsToManyGetAssociationsMixin, BelongsToManySetAssociationsMixin 
} from 'sequelize';
import { BookFlight, Facilities, Flight, Passanger, User } from "../interface";

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

    declare getFacilityModels: BelongsToManyGetAssociationsMixin<Facilities>;
    declare setFacilityModels: BelongsToManySetAssociationsMixin<Facilities, number>;
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
                type: DataTypes.DECIMAL,
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

