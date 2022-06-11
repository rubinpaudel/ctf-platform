import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from "../../orm/dataSource";
import { Round } from "../../orm/entities";
import { CompetitionConfig } from '../../types/CompetitionConfig';
import { APIError } from '../../utils/api-helpers/apiError';
import { GetCompetitionConfigObject } from '../../utils/server-config/getCompetitionConfigObject';



export const CreateRound = async (req : Request, res : Response, next : NextFunction) => {

    // Need to only return name and points
    const RoundRepository = CTFDataSource.getRepository(Round);

    const { Name, Description, StartTime, EndTime } = req.body;

    // Get the competition date;

    const competitionData : CompetitionConfig = await GetCompetitionConfigObject();

    try {

        let round = await RoundRepository.findOneBy({Name : Name});

        if (round) {
            const NoRoundFoundError = new APIError(404, 'General', `Round with name : ${Name} does exist!`);
            return next(NoRoundFoundError);
        }
        console.log(StartTime, EndTime);
        const StartDate = new Date(competitionData.CompetitionDate + ' ' + StartTime);
        const EndDate = new Date(competitionData.CompetitionDate + ' ' + EndTime)

        const newRound = new Round(Name, Description, StartDate, EndDate);

        await RoundRepository.save(newRound);

        res.status(200).send({message: 'Round Created', round : newRound});

    } catch (err) {
        const ServerError = new APIError(500, 'Server', 'Server Error', err.message);
        return next(ServerError);
    }



}