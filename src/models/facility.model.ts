import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Facilities } from '../interface';

export type FacilityCreationAttiributes = Optional<Facilities, 'id'>;

export class FacilityModel extends Model<Facilities, FacilityCreationAttiributes> implements Facilities {
    declare id: number;
    declare code: string;
    declare name: string;
    declare price: number;
}

export default function (sequelize: Sequelize): typeof FacilityModel {
    FacilityModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            code: {
                type: DataTypes.STRING(5),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
        },
        {
            tableName: 'facilities',
            sequelize
        }
    );

    return FacilityModel;
}