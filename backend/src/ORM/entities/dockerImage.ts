import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Challenge } from './';
import { DockerContainer } from './dockerContainer';

@Entity('DockerImage')
export class DockerImage {

    @PrimaryGeneratedColumn()
    DockerImageID : number;

    @Column({unique: true, nullable: false})
    Name : string

    @OneToOne(()=> Challenge, {onDelete: "CASCADE"})
    @JoinColumn()
    Challenge : Challenge;


    @OneToOne(()=> DockerContainer, {nullable: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
    @JoinColumn()
    Container : DockerContainer;

    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    setContainer(container : DockerContainer) {
        this.Container = container;
    }

    constructor(DockerImageName : string, Challenge : Challenge) {
        this.Name = DockerImageName;
        this.Challenge = Challenge;
    }

}