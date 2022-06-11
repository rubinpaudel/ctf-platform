import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { DockerImage } from './';

@Entity('DockerContainer')
export class DockerContainer {

    @PrimaryGeneratedColumn()
    DockerContainerID : number;

    @Column()
    Name : string;
    
    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    constructor(DockerContainerName: string)
    {
        this.Name = DockerContainerName; 
    }
}