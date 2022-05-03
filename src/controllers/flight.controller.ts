// Lib
import { Request, Response } from 'express';

// Component
import { getOrSetCache } from '../cache';
import FlightService from '../services/flight.service';
import PaginationService from '../services/pagination.service';
import PaymentService from '../services/payment.service';
import TicketService from '../services/ticket.service';
import { 
    FlightData, Flight, SearchFlight, 
    FlightFacility, RequestWithUserGeneric, Passanger, PaymentData 
} from "../interface";

export default class FlightController {
    private flightService = new FlightService();
    private paymentService = new PaymentService();
    private ticketService = new TicketService();
    private pagination = new PaginationService(3);

    public allFlight = async (req: Request<{}, {}, {}, { page: string }>, res: Response) => {
        try {
            const data = await getOrSetCache('allFlight', async () => {
                const flights: Flight[] = await this.flightService.getAllFlight();
                return flights;
            });
            return res.status(200).send(this.pagination.paginate<Flight>(data, req.query.page));
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public searchFlight = async (req: Request<{}, {}, {}, SearchFlight>, res: Response) => {
        try {
            const data = await getOrSetCache(`flight?${JSON.stringify(req.query)}`, async () => {
                const flights: Flight[]= await this.flightService.searchFlight(req.query);
                return flights;
            });
            return res.status(200).send(this.pagination.paginate<Flight>(data, req.query.page));
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

    public checkOutFlight = async (req: RequestWithUserGeneric<{ id: number }>, res: Response) => {
        try {
            const paymentData: PaymentData = req.body;
            const { paymentId, customerId } = await this.paymentService.CheckOut(req.params.id, paymentData, req.user);
            const tickets = await this.ticketService.generateTicket(req.params.id, paymentId, customerId);
            return res.status(200).send(tickets);
        } catch (err: any) {
            return res.status(400).send({ 'message': `${err}` });

        }
    }

    public payFlight = async (req: Request, res: Response) => {
        try {
            const response = await this.paymentService.PayFlight();
            return res.status(200).send(response);
        } catch (err: any) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }
}