import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Challenge, Team, User } from './';


@Entity('SolvedChallenges')
export class SolvedChallenges {

    @PrimaryGeneratedColumn()
    Id : number;

    @ManyToOne(()=> Team, (team)=>team.SolvedChallenges, {onDelete : "CASCADE"})
    Team : Team;
    
    @ManyToOne(()=> User, {onDelete: "CASCADE"})
    User : User;

    @ManyToOne(()=> Challenge, {onDelete: "CASCADE"})
    Challenge : Challenge;

    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    constructor(Team: Team, User: User, Challenge: Challenge){
        this.Team = Team; 
        this.User = User;
        this.Challenge = Challenge;
    }
}