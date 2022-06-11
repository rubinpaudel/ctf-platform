import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Challenge } from './challenge';

@Entity('Hint')
export class Hint {

    @PrimaryGeneratedColumn()
    Id : number;

    @ManyToOne(type => Challenge, (challenge) => challenge, {eager: true, nullable: false, onDelete: 'CASCADE'})
    Challenge : Challenge;

    @Column()
    Order: number;
    
    @Column()
    Description : string;

    @Column({nullable: true})
    Points : number;

    @Column({nullable: true})
    PointsPercentage : number;

    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    constructor(Challenge: Challenge, Order: number, Description: string, Points?: number, PointsPercentage?: number){
        this.Challenge = Challenge;
        this.Order = Order;
        this.Description = Description;
        this.Points = Points;
        this.PointsPercentage = PointsPercentage;
    }
}