import { Request, Response } from 'express';
import TicketService from '../services/ticket.service';

export default class TicketController {
    public ticketService = new TicketService();

    public getAllTicket = async (req: Request, res: Response) => {
        try {
            return res.status(200).send(await this.ticketService.getAllTicket);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }

    public getTicketById = async (req: Request<{id: number}>, res: Response) => {
        try {
            const ticket = await this.ticketService.getDetailTicket(req.params.id);
            return res.status(200).send(ticket);
        } catch (err) {
            return res.status(400).send({ 'message': `${err}` });
        }
    }
}