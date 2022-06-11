import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Challenge } from './challenge';

@Entity('Round')
export class Round {

    @PrimaryGeneratedColumn()
    Id : number;

    @Column({nullable: false})
    Name : string;

    @Column()
    Description : string;

    @OneToMany(type => Challenge, (challenge) => challenge.Round)
    Challenges: Challenge[];
    
    @Column()
    @CreateDateColumn()
    StartTime: Date;

    @Column()
    @CreateDateColumn()
    EndTime: Date;

    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    constructor(Name: string, Description: string, StartTime: Date, EndTime: Date){
        this.Name = Name;
        this.Description = Description;
        this.StartTime = StartTime;
        this.EndTime = EndTime;
    }
}