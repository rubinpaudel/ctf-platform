import { Request, Response, NextFunction } from 'express';
import { ILike } from 'typeorm';
import { CTFDataSource } from '../../orm/dataSource';
import { PurchasedHint, SolvedChallenges, User } from '../../orm/entities';
import { APIError } from '../../utils/api-helpers/apiError';

/**
 * @param userId 
 * @returns points of user
 */
let getPoints = async (userId : number) => {

    let points: number = 0;
    
    (await CTFDataSource.getRepository(SolvedChallenges).find({relations: ['User','Challenge']})).filter(solved => solved.User.Id == userId).forEach(solved => {points+= solved.Challenge.Points;});

    (await CTFDataSource.getRepository(PurchasedHint).find({relations: ['User', 'Hint', 'Challenge']})).filter(purchases => purchases.User.Id == userId).forEach(purchase => {
        if(purchase.Hint.Points != 0){
            points -= purchase.Hint.Points;
        }
        else{
            let toReduce: number = purchase.Challenge.Points * (purchase.Hint.PointsPercentage/100);
            points -= toReduce; 
        }
    })

    return points;
}

export const listUsersWithFiltering =  async (req: Request, res: Response, next: NextFunction) => {

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
        const usersWithAllData: User[] = await CTFDataSource.getRepository(User).find({
            where: { Name: ILike('%'+filterName+'%'), isAdmin: false},
            order: { Name: direction}
        });
        let usersWithShowableData: {Id: number, Name: string, Points: number, Team: string, TeamId: number, UserCategory: string}[] = [];
        for (let user of usersWithAllData) {
            if(filterCategory == '' || filterCategory == user.UserCategory.Name){
                usersWithShowableData.push({
                    Id: user.Id,
                    Name: user.Name,
                    Team: user.Team?.Name,
                    TeamId: user.Team?.Id,
                    Points: await getPoints(user.Id),
                    UserCategory: user.UserCategory.Name
                });
            }
        }
        
        // If it should be sorted on points -> sort
        if(sortBy == 'points'){
            if(direction == 'asc'){
                usersWithShowableData.sort((a,b) => a.Points - b.Points)
            }
            else{
                usersWithShowableData.sort((a,b) => b.Points - a.Points)
            }
        }
        
        res.status(200).send({data: usersWithShowableData});
    } catch (err) {
        const ServerError : APIError = new APIError(400, 'Server', `Unknown server error`, null, err);
        return next(ServerError);
    }
}