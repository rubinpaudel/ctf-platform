import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne } from 'typeorm';
import { Hint, Team, User } from './';
import { Challenge } from './challenge';

@Entity('PurchasedHint')
export class PurchasedHint {

    @PrimaryGeneratedColumn()
    Id : number;

    @ManyToOne(()=> User, {eager: true, nullable: false, onDelete: 'CASCADE'})
    User : User;

    @ManyToOne(()=> Challenge, {eager: true, nullable: false, onDelete: 'CASCADE'})
    Challenge : Challenge;

    @ManyToOne(()=> Team, (team) => team.PurchasedHints, {onDelete: "CASCADE"})
    Team : Team;

    @ManyToOne(()=> Hint, {eager: true, nullable: false, onDelete: 'CASCADE'})
    Hint : Hint;

    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    constructor(User: User, Challenge : Challenge, Team: Team, Hint: Hint){
        this.User = User;
        this.Challenge = Challenge;
        this.Team = Team;
        this.Hint = Hint;
    }

}