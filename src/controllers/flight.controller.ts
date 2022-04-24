// Lib
import { Request, Response } from 'express';

// Component
import FlightService from '../services/flight.service';
import PaginationService from '../services/pagination.service';
import PaymentService from '../services/payment.service';
import { 
    FlightData, Flight, SearchFlight, 
    FlightFacility, RequestWithUserGeneric, Passanger 
} from "../interface";

export default class FlightController {
    private flightService = new FlightService();
    private paymentService = new PaymentService();
    private pagination = new PaginationService(3);

    public allFlight = async (req: Request<{}, {}, {}, { page: string }>, res: Response) => {
        try {
            const flights: Flight[] = await this.flightService.getAllFlight();
            return res.status(200).send(this.pagination.paginate<Flight>(flights, req.query.page));
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public searchFlight = async (req: Request<{}, {}, {}, SearchFlight>, res: Response) => {
        try {
            const flights = await this.flightService.searchFlight(req.query);
            return res.status(200).send(flights);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public createFlight = async (req: Request, res: Response) => {
        try {
            const flightData: FlightData = req.body;
            const flight = await this.flightService.createFlight(flightData);
    
            return res.status(200).send(flight);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public updateFlight = async (req: Request<{ id: number }>, res: Response) => {
        try {
            const flightData: FlightData = req.body;
            const flight = await this.flightService.updateFlight(req.params.id, flightData);
    
            return res.status(200).send(flight);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public deleteFlight = async (req: Request<{ id: number }>, res: Response) => {
        try {
            await this.flightService.deleteFlight(req.params.id);
            return res.status(200).send({ 'message': 'Flight delete success' });
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public processOrder = async (req: Request<{ id: number }, {}, {}, FlightFacility>, res: Response) => {
        try {
            const flight: Flight = await this.flightService.processOrder(req.params.id, req.query);
            return res.status(200).send(flight);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public bookOrder =async (req: RequestWithUserGeneric<{ id: number }>, res: Response) => {
        try {
            const passangersData: Passanger[] = req.body.passangers;
            const flightFacility: FlightFacility = req.body.facilities;
            const bookFlight = await this.flightService.bookOrder(req.user.id, req.params.id, flightFacility, passangersData);
            return res.status(200).send(bookFlight);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public checkOutFlight = async (req: Request, res: Response) => {
        try {
            const payment = await this.paymentService.CheckOut();
            return res.status(200).send(payment);
        } catch (err: any) {
            return res.status(400).send({ 'message': `${err}` });

        }
    }
}