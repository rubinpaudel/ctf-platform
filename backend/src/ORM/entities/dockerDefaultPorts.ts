import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { DockerImage } from './';

@Entity('DockerDefaultPorts')
export class DockerDefaultPorts {

    @PrimaryGeneratedColumn()
    DockerDefaultPortID : number

    @ManyToOne(()=> DockerImage, {onDelete : "CASCADE", onUpdate : "CASCADE"})
    DockerImage: DockerImage;

    @Column({nullable: false, unique: false})
    PortMapping : string;

    constructor(DockerImage : DockerImage, PortMapping : string) {
        this.DockerImage = DockerImage;
        this.PortMapping = PortMapping;
    }
}