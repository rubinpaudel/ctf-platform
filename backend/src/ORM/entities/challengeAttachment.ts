import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Challenge } from './challenge';

@Entity('ChallengeAttachments')
export class ChallengeAttachments {

    @PrimaryGeneratedColumn()
    Id : number;

    @ManyToOne(()=> Challenge, {onDelete : "CASCADE", onUpdate : "CASCADE"})
    Challenge : Challenge;

    @Column({nullable: false})
    Path : string;

    @Column({nullable: false})
    Name: string;

    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    constructor(Challenge: Challenge, Path: string, Name: string)
    {
        this.Challenge = Challenge; 
        this.Path = Path;
        this.Name = Name;
    }

}