// Lib
import Sequelize from 'sequelize';

// Config
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '../config';

// Model
import RoleModel from '../models/role.model';
import UserModel from '../models/user.model';
import refreshTokenModel from '../models/refreshToken.model';
import AirlineModel from '../models/airline.model';


const sequelize = new Sequelize.Sequelize(DB_DATABASE as string, DB_USER as string, DB_PASSWORD as string, {
    host: DB_HOST,
    dialect: 'postgres',
    port: Number(DB_PORT),
    pool: {
        max: 5,
        min: 0,
    },
});

const DB = {
    Users: UserModel(sequelize),
    Roles: RoleModel(sequelize),
    Airlines: AirlineModel(sequelize),
    RefreshToken: refreshTokenModel(sequelize),
    sequelize,
    Sequelize,
};

// #region User Assoc
DB.Users.belongsToMany(DB.Roles, { through: "userRoles" });
DB.Users.hasOne(DB.RefreshToken);
// #endregion

// #region Roles Assoc
DB.Roles.belongsToMany(DB.Users, { through: "userRoles" });
// #endregion

// #region RefreshToken Assoc
DB.RefreshToken.belongsTo(DB.Users);
// #endregion

export default DB;