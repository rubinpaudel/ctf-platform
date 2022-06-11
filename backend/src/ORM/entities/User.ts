import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Attempt } from './attempt';
import { PurchasedHint } from './purchasedHint';
import { Team } from './team';
import { UserCategory } from './userCategory';

@Entity('User')
export class User {

    @PrimaryGeneratedColumn()
    Id : number;

    @ManyToOne(() => Team, team => team.Members, {onDelete: "SET NULL", nullable: true, eager: true})
    @JoinColumn()
    Team : Team;
    
    @ManyToOne(() => UserCategory, userCategory => userCategory.Members, {onDelete: "SET NULL", nullable: true, eager: true})
    @JoinColumn()
    UserCategory : UserCategory;

    @Column({nullable: false, unique: true})
    Name : string;

    @Column({unique: true})
    Email : string;

    @Column()
    Password : string;

    @Column({default: false})
    isAdmin : boolean;

    @Column({nullable: true, unique: true})
    ActivationCode : string;

    @Column({nullable: false, default: false})
    Active : boolean;

    @OneToMany(type => Attempt, attempt => attempt.User, {nullable: true})
    Attempts: Attempt[];

    @OneToMany(type => PurchasedHint, purchasedHint => purchasedHint.User, {nullable: true})
    PurchasedHints: PurchasedHint[];

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

    constructor(Name: string, Email : string, Password: string, isAdmin : boolean, UserCategory?: UserCategory){
        this.Name = Name;
        this.Password = Password;
        this.UserCategory = UserCategory;
        this.Email = Email;
        this.isAdmin = isAdmin;
        this.ActivationCode = randomUUID();
        this.Active = false; 
        this.hashPassword();

    }

}