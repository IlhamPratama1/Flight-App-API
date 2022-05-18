// Lib
import express from "express";
import helmet from "helmet";
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS } from "./config";
import { redisClient } from './cache';
import DB from "./databases";
import { Routes } from "./interface";
import { 
    HomeRoute, AuthRoute, UserRoute, 
    AirlineRoute, FlightRoute, AirportRoute, TicketRoute
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
            new TicketRoute()
        ]
        
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeRedis();
        this.initializeSwagger();
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
        DB.sequelize.sync({ force: true }).then(() => {
            initializeData();
        });

        function initializeData() {
            DB.Roles.bulkCreate([
                {
                    name: 'user'
                },
                {
                    name: 'admin'
                },
                {
                    name: 'moderator'
                }
            ]);
        }
    }

    private initializeRedis() {
        redisClient.on('error', (err) => console.log('Redis Client Errors', err));
        redisClient.connect();
        redisClient.on('connect', function() {
            console.log("Connected to redis");
        });
    }

    private initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'Flight App API',
                    version: '1.0.0',
                    description: 'Flight App API Documentation',
                },
            },
            apis: ['swagger.yaml'],
        };
        
        const specs = swaggerJSDoc(options);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }
}

export default App;