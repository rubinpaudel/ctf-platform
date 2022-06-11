import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Challenge } from './challenge';

@Entity('ChallengeFlags')
export class ChallengeFlag {

    @PrimaryGeneratedColumn()
    Id : number

    @ManyToOne(()=> Challenge, {onDelete: "CASCADE"})
    Challenge : Challenge;

    @Column({nullable: false})
    Flag : string;

    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    constructor(Challenge: Challenge, Flag: string)
    {
        this.Challenge = Challenge; 
        this.Flag = Flag; 
    }

}