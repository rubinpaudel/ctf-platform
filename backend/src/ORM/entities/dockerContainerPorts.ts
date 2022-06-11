import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { DockerContainer } from './';

@Entity('DockerContainerPorts')
export class DockerContainerPorts {

    @PrimaryGeneratedColumn()
    DockerContainerPortID : number

    @ManyToOne(()=> DockerContainer, {onDelete : "CASCADE", onUpdate : "CASCADE"})
    DockerContainer : DockerContainer;

    @Column({nullable: false, unique: true})
    PortMapping : string;

    constructor(DockerContainer : DockerContainer, PortMapping : string) {
        this.DockerContainer = DockerContainer;
        this.PortMapping = PortMapping;
    }

}