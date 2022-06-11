import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Team } from '../../orm/entities/team';
import { Round, User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

export const RoundNameAvailable =  async (req: Request, res: Response, next: NextFunction) => {

    const RoundRepository = CTFDataSource.getRepository(Round);

    let name: string = req.params.name;

    try {
        const round = await RoundRepository.findOne({where: {Name: name}});
        let r : boolean = true;
        if (round) {
            r = false;
        }
        res.status(200).send({available : r});
    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }
}