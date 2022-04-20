// Lib
import { Model, DataTypes, Sequelize, Optional } from "sequelize";
import { Role } from "../interface";

export type RoleCreationAttributes = Optional<Role, 'id'>;

class RoleModel extends Model<Role, RoleCreationAttributes> implements Role {
    declare id: number;
    declare name: string;
}

export default function (sequelize: Sequelize): typeof RoleModel {
    RoleModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        },
        {
            tableName: 'roles',
            sequelize,
        },
    );
    
    return RoleModel;
}