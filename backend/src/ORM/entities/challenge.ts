import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { ChallengeCategory } from './challengeCategory';
import { ChallengeFlag } from './challengeFlag';
import { Hint } from './hint';
import { Round } from './round';

export type ChallengeType = 'Normal' | 'Quiz' | 'Dockerized';

@Entity('Challenge')
export class Challenge {

    @PrimaryGeneratedColumn()
    Id : number;

    @ManyToOne(type => Round, (round) => round.Challenges, {eager: true, nullable: false, onDelete: 'CASCADE'})
    @JoinColumn()
    Round : Round;
    
    @OneToMany(() => Hint, (hint) => hint.Challenge)
    Hints : Hint[]
    
    @ManyToOne(type => ChallengeCategory, (challengeCategory) => challengeCategory.Challenges, {eager: true, nullable: false, onDelete: 'CASCADE'})
    @JoinColumn()
    ChallengeCategory : ChallengeCategory;

    @Column({nullable: false})
    Name : string;

    @Column()
    Description : string;

    @Column({nullable: false})
    Points : number;


    @Column({
        type: 'enum',
        enum: ["Normal", "Quiz", "Dockerized"],
        default: "Normal"
      })
      type: ChallengeType

    // @OneToMany(type => ChallengeFlag, flag => flag.Challenge, {nullable: false})
    // Flags : ChallengeFlag;
    @Column("text", { array: true })
    Flags: string[];

    @Column('jsonb', {nullable : true})
    Quiz : JSON;

    @Column({default: true})
    Status: boolean;

    @ManyToMany(() => Challenge, {nullable: true})
    @JoinTable({name:"RequiredChallenge"})
    RequiredChallenges: Challenge[];

    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    constructor(Round: Round, Name: string, Description: string, ChallengeCategory: ChallengeCategory, Points: number, ChallengeType : ChallengeType, Flags: string[], Quiz?: JSON, RequiredChallenges?: Challenge[], Hints ?: [])
    {
        this.Round = Round;
        this.ChallengeCategory = ChallengeCategory; 
        this.Name = Name;
        this.Description = Description;
        this.Points = Points;
        this.Flags = Flags;
        this.Quiz = Quiz;
        this.RequiredChallenges = RequiredChallenges;
        this.type = ChallengeType;
        this.Hints = Hints;
    }


}