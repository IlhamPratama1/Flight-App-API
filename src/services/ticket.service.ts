import { deleteCacheData, getOrSetCache } from '../cache';
import DB from '../databases';
import { HttpException } from '../exceptions/HttpException';
import { Ticket } from '../interface';

export default class TicketService {
    public books = DB.Books;
    public tickets = DB.Tickets;
    public flights = DB.Flights;
    public passangers = DB.Passangers;

    public async generateTicket(flightBookId: number, paymentId: string, customerId: string): Promise<Ticket[]> {
        const flightBook = await this.books.findByPk(flightBookId);
        if (!flightBook) throw new HttpException(400, `Flight Book not found`);

        const passangers = await flightBook.getPassangerModels();
        let tickets: Ticket[] = [];
        for (let i = 0; i < passangers.length; i++) {
            const ticket = await this.tickets.create({
                code: `${flightBookId}_${passangers[i].id}_${customerId}`,
                customerId: customerId,
                paymentId: paymentId
            });

            await ticket.setBookModel(flightBook);
            await ticket.setPassangerModel(passangers[i]);
            tickets.push(ticket);
        }

        await deleteCacheData(`booked/${await flightBook.getUserModel()}`);
        await deleteCacheData('tickets');

        const flight = await this.flights.findByPk((await flightBook.getFlightModel()).id);
        if(!flight) throw new HttpException(400, `Flight not found`);

        flight.totalSeat = flight.totalSeat - passangers.length;
        await flight.save();

        return tickets;
    }

    public async getAllTicket() {
        const tickets = await getOrSetCache('tickets', async () => {
            const data = await this.tickets.findAll(); 
            return data;
        });
        return tickets;
    }

    public async getDetailTicket(ticketId: number): Promise<Ticket> {
        const ticket = await getOrSetCache(`ticket/${ticketId}`,async () => {
            const data = await this.tickets.findByPk(ticketId, {
                include: [
                    { model: this.passangers },
                    { model: this.books, include: [ { model: this.flights } ]}
                ]
            });
            if (!data) throw new HttpException(400, `Tickets not found`); 
            return data;
        });
        return ticket;
    }

    public async deleteTicket(ticketId: number): Promise<void> {
        const ticket = await this.tickets.findByPk(ticketId);
        if(!ticket) throw new HttpException(400, `Airport not found`);
        
        await deleteCacheData('tickets');
        await deleteCacheData(`ticket/${ticket}`);
        await ticket.destroy();
    }
}