// Lib
import express from "express";
import helmet from "helmet";
import cors from 'cors';

// Config
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS } from "./config";

// Database
import DB from "./databases";

// Interface
import { Routes } from "./interface";

// Routes
import { 
    HomeRoute, AuthRoute, UserRoute, 
    AirlineRoute, FlightRoute, AirportRoute
} from "./routes";
class App {
    public app: express.Application;
    public env: string;
    public port: string | number;
    public routes: Routes[];
    
    constructor() {
        this.app = express();
        this.env = NODE_ENV || 'development';
        this.port = PORT || 3000;
        this.routes = [
            new HomeRoute(),
            new AuthRoute(),
            new UserRoute(),
            new AirlineRoute(),
            new FlightRoute(),
            new AirportRoute(),
        ]
        
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    public listen() {
        try {
            this.app.listen(this.port, (): void => {
                console.log(`Connected successfully on port ${this.port}`);
            });
        } catch(error) {
            console.error(`Error occured: ${error}`);
        }
    }

    private initializeMiddlewares() {
        this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use('/static', express.static('static'));
    }

    private initializeRoutes() {
        this.routes.forEach(route => {
            this.app.use('/', route.router);
        });
    }

    private connectToDatabase() {
        DB.sequelize.sync({ force: false });
    }
}

export default App;