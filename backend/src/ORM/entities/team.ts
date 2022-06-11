import bcrypt from 'bcrypt'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './';
import { Attempt } from './attempt';
import { PurchasedHint } from './purchasedHint';
import { SolvedChallenges } from './solvedChallenges';
import { UserCategory } from './userCategory';

@Entity('Team')
export class Team {

    @PrimaryGeneratedColumn()
    Id : number;

    @Column({nullable: false, unique: true})
    Name : string;

    @Column({nullable: false})
    Password : string;

    @OneToMany(() => User, user => user.Team)
    Members: User[];

    @OneToOne(() => User, {onDelete: "CASCADE"})
    @JoinColumn()
    Captain : User;

    @OneToMany(() => PurchasedHint, purchasedHint => purchasedHint.Team)
    PurchasedHints: PurchasedHint[];

    @OneToMany(() => SolvedChallenges, solvedChallenges => solvedChallenges.Team)
    SolvedChallenges: SolvedChallenges[]

    @OneToMany(() => Attempt, attempt => attempt.Team)
    Attempts: Attempt[];

    @Column({default: 0, nullable: false, type: "real"})
    Points: number;

    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    hashPassword() {
        if (this.Password == undefined)
            return;
        this.Password = bcrypt.hashSync(this.Password, 8);
    }

    checkPasswordMatch(inputPassword : string) {
        return bcrypt.compareSync(inputPassword, this.Password);
    }

    getPoints(): number {
        
        let points : number = this.Points;
        if(this.SolvedChallenges){
            this.SolvedChallenges.forEach(solved => {points+= solved.Challenge.Points;});
        }
        if(this.PurchasedHints){
            this.PurchasedHints.forEach(purchase => {
                if(purchase.Hint.Points != 0){
                    points -= purchase.Hint.Points;
                }
                else{
                    let toReduce: number = purchase.Challenge.Points * (purchase.Hint.PointsPercentage/100);
                    points -= toReduce; 
                }
            });
        }
        return points;
    }

    getPointsPerRound(): Array<Array<number>>{

        let dict = new Array<Array<number>>();
        let roundArray = new Array<number>();
        let valueArray = new Array<number>();

        if(this.SolvedChallenges){
            this.SolvedChallenges.forEach(solved => {
                if(roundArray.includes(solved.Challenge.Round.Id))
                    valueArray[roundArray.indexOf(solved.Challenge.Round.Id)] += solved.Challenge.Points;
                else
                {
                    roundArray.push(solved.Challenge.Round.Id);
                    valueArray[roundArray.indexOf(solved.Challenge.Round.Id)] = 0;
                    valueArray[roundArray.indexOf(solved.Challenge.Round.Id)] += solved.Challenge.Points;
                }
            });
        }
        if(this.PurchasedHints){
            this.PurchasedHints.forEach(purchase => {
                if(purchase.Hint.Points != 0){
                    if(roundArray.includes(purchase.Challenge.Round.Id)){
                        valueArray[roundArray.indexOf(purchase.Challenge.Round.Id)] -= purchase.Hint.Points;
                    }
                    else{
                        roundArray.push(purchase.Challenge.Round.Id);
                        valueArray[roundArray.indexOf(purchase.Challenge.Round.Id)] = 0;
                        valueArray[roundArray.indexOf(purchase.Challenge.Round.Id)] -= purchase.Hint.Points;
                    }
                }
                else{
                    if(roundArray.includes(purchase.Challenge.Round.Id)){
                        let toReduce: number = purchase.Challenge.Points * (purchase.Hint.PointsPercentage/100);
                        valueArray[roundArray.indexOf(purchase.Challenge.Round.Id)] -= toReduce;
                    }
                    else{
                        let toReduce: number = purchase.Challenge.Points * (purchase.Hint.PointsPercentage/100);
                        roundArray.push(purchase.Challenge.Round.Id);
                        valueArray[roundArray.indexOf(purchase.Challenge.Round.Id)] = 0;
                        valueArray[roundArray.indexOf(purchase.Challenge.Round.Id)] -= toReduce;
                    }
                }
            });
        }
        dict.push(roundArray);
        dict.push(valueArray);
        return dict;
    }

    getPointsOfUserForTeam(userId:number): number {
        let points : number = 0;
        this.SolvedChallenges.forEach(solved => {if(solved.User.Id == userId)points+= solved.Challenge.Points;});
        this.PurchasedHints.forEach(purchase => {
            if(purchase.User.Id == userId){
                if(purchase.Hint.Points != 0){
                    points -= purchase.Hint.Points;
                }
                else{
                    let toReduce: number = purchase.Challenge.Points * (purchase.Hint.PointsPercentage/100);
                    points -= toReduce; 
                }
            }
        });
        return points;
    }
    
    getHighestCategory(): UserCategory {
        let highestCategory: UserCategory = this.Members[0].UserCategory;
        this.Members.forEach(member => {
            if(member.UserCategory.Level > highestCategory.Level){
                highestCategory = member.UserCategory;
            }
        });
        return highestCategory;
    }

    constructor(Name: string, Password: string, Captain: User){
        this.Name = Name;
        this.Password = Password;
        this.hashPassword();
        this.Captain = Captain;
    }

}