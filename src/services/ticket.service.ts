import DB from '../databases';
import { HttpException } from '../exceptions/HttpException';
import { Ticket } from '../interface';


export default class TicketService {
    public books = DB.Books;
    public tickets = DB.Tickets;

    public async generateTicket(flightBookId: number, paymentId: string, customerId: string): Promise<Ticket[]> {
        const flightBook = await this.books.findByPk(flightBookId);
        if (!flightBook) throw new HttpException(400, `Flight Book not found`);

        const passangers = await flightBook.getPassangerModels();
        let tickets: Ticket[] = [];
        for (let i = 0; i < passangers.length; i++) {
            const ticket = await this.tickets.create({
                code: `${flightBookId}_${passangers[i].id}_${customerId}`,
                customerId: customerId,
                paymentId: paymentId,
                covidInsurance: true,
                baggageInsurance: true,
                fullProtection: true
            });

            await ticket.setFlightModel(await flightBook.getFlightModel());
            await ticket.setBookModel(flightBook);
            await ticket.setPassangerModel(passangers[i]);
            tickets.push(ticket);
        }

        return tickets;
    }
}