import { Request, Response } from 'express';

export default class IndexController {
    public index = (req: Request, res: Response) => {
        try {
            return res.status(200).send({
                message: "Hello World! asolole"
            });
        } catch (error) {
            return res.status(404).send({
                message: error
            });
        }
    }
}