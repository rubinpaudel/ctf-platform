import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user';

@Entity('UserCategory')
export class UserCategory {

    @PrimaryGeneratedColumn()
    Id : number;

    @Column({nullable: false})
    Name: string;

    @Column()
    Level: number;

    @OneToMany(() => User, (user) => user.UserCategory)
    Members: User[];

    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    constructor(Name: string, Level: number){
        this.Level = Level;
        this.Name = Name;
    }
}