import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Challenge } from './challenge';
import { User } from './';
import { Team } from './team';

@Entity('Attempt')
export class Attempt {

    @PrimaryGeneratedColumn()
    Id : number;

    @ManyToOne(() => Challenge, {onDelete: "CASCADE"})
    Challenge : Challenge;
    
    @ManyToOne(() => User, user => user.Attempts, {onDelete: "CASCADE"})
    User : User;

    @ManyToOne(() => Team, team => team.Attempts, {onDelete: "CASCADE"})
    Team : Team;

    @Column({nullable: false})
    Flag : string;

    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    constructor(Challenge: Challenge, User: User, Team: Team, Flag: string){
        this.Challenge = Challenge; 
        this.User = User;
        this.Team = Team; 
        this.Flag = Flag;
    }
}