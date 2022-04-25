// Lib
import Sequelize from 'sequelize';

// Config
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '../config';

// Model
import RoleModel from '../models/role.model';
import UserModel from '../models/user.model';
import refreshTokenModel from '../models/refreshToken.model';
import AirlineModel from '../models/airline.model';
import flightModel from '../models/flight.model';
import AirportModel from '../models/airport.model';
import PassangerModel from '../models/passanger.model';
import BookModel from '../models/book.model';
import TicketModel from '../models/ticket.model';
import facilityModel from '../models/facility.model';


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
    RefreshToken: refreshTokenModel(sequelize),
    Airlines: AirlineModel(sequelize),
    Flights: flightModel(sequelize),
    Airport: AirportModel(sequelize),
    Books: BookModel(sequelize),
    Passangers: PassangerModel(sequelize),
    Tickets: TicketModel(sequelize),
    Facilities: facilityModel(sequelize),
    sequelize,
    Sequelize,
};

// #region User Assoc
DB.Users.belongsToMany(DB.Roles, { through: "userRoles" });
DB.Users.hasOne(DB.RefreshToken);
DB.Users.hasMany(DB.Books);
// #endregion

// #region Roles Assoc
DB.Roles.belongsToMany(DB.Users, { through: "userRoles" });
// #endregion

// #region RefreshToken Assoc
DB.RefreshToken.belongsTo(DB.Users);
// #endregion

// #region Airline Assoc
DB.Airlines.hasMany(DB.Flights);
// #endregion Airline Assoc

// #region Flight Assoc
DB.Flights.belongsTo(DB.Airlines);
DB.Flights.belongsTo(DB.Airport, { as: 'fromAirport', foreignKey: 'fromAirportId' });
DB.Flights.belongsTo(DB.Airport, { as: 'toAirport', foreignKey: 'toAirportId' });
DB.Flights.hasMany(DB.Books);
// #endregion Flight Assoc

// #region Airport Assoc
DB.Airport.hasMany(DB.Flights);
// #endregion

// #region Book flight Assoc
DB.Books.belongsTo(DB.Users);
DB.Books.belongsTo(DB.Flights);
DB.Books.hasMany(DB.Passangers);
DB.Books.hasMany(DB.Tickets);
DB.Books.belongsToMany(DB.Facilities, { through: 'bookFacility'});
// #endregion

// #region Ticket Assoc
DB.Tickets.belongsTo(DB.Books);
DB.Tickets.hasOne(DB.Passangers);
// #endregion

// #region Passanger Assoc
DB.Passangers.belongsTo(DB.Books);
DB.Passangers.belongsTo(DB.Tickets);
// #endregion

// #region Facility Assoc
DB.Facilities.belongsToMany(DB.Books, { through: 'bookFacility' });
// #endregion

export default DB;