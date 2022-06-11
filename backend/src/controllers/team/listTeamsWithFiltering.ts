import { Request, Response, NextFunction } from 'express';
import { CTFDataSource } from '../../orm/dataSource';
import { Team } from '../../orm/entities';
import { ILike } from 'typeorm';
import { APIError } from '../../utils/api-helpers/apiError';

export const listTeamsWithFiltering = async (req : Request, res : Response, next : NextFunction) => {

    /**
     * filterName       : can filter users on some string
     * filterCategory   : can filter on given category.
     * sortDirection    : can be asc or desc
     * sortBy           : can sort on points of users or name
    */
    
    const filterParameters: any = req.query;
    const filterName          = filterParameters.filterName;
    const filterCategory      = filterParameters.filterCategory;
    const sortDirection       = filterParameters.sortDirection;
    const sortBy              = filterParameters.sortBy;

    let direction : 'asc' | 'desc' = 'asc';
 
    // If empty => asc
    if(sortDirection != "") 
        direction = sortDirection;
 
     // We start ordering already on name because Array.sort only supported for numbers; if you want string, need to write your own compare function. This way its better. 
    try {
        const teamsWithAllData: Team[] = await CTFDataSource.getRepository(Team).find({
            where: { Name: ILike('%'+filterName+'%')}, order: { Name: direction}, relations: ['Members', 'PurchasedHints', 'SolvedChallenges', 'SolvedChallenges.Challenge', 'Captain']
        });
        
        let teamsWithShowableData: {Id: number, Name: string, Points: number, Captain: string, Category: string, MemberCount : number}[] = [];
        for(let team of teamsWithAllData){
            if(filterCategory == '' || filterCategory == team.getHighestCategory().Name){
                teamsWithShowableData.push({
                    Id: team.Id,
                    Name: team.Name,
                    Captain: team.Captain.Name,
                    Points: team.getPoints(),
                    Category: team.getHighestCategory().Name,
                    MemberCount : team.Members.length
                });
            }
        }
        
        // If it should be sorted on points -> sort
        if(sortBy == 'points'){
            if(direction == 'asc'){
            teamsWithShowableData.sort((a,b) => a.Points - b.Points)
            }
            else{
            teamsWithShowableData.sort((a,b) => b.Points - a.Points)
            }
        }
        
        res.status(200).send({Teams: teamsWithShowableData});
    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }

}