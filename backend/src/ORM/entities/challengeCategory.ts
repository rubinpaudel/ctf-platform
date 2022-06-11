import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Challenge } from './challenge';

@Entity('ChallengeCategory')
export class ChallengeCategory {

    @PrimaryGeneratedColumn()
    Id : number;

    @Column({nullable: false, unique: true})
    Name : string;

    @OneToMany(type=> Challenge, (challenge) => challenge.ChallengeCategory)
    Challenges: Challenge[];
    
    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    constructor(Name: string)
    {
        this.Name = Name; 
    }

}