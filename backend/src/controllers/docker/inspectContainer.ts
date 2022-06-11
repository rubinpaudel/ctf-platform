import { Container } from "dockerode";
import { Socket } from "socket.io";
import { CTFDataSource } from "../../orm/dataSource";
import { DockerContainer } from "../../orm/entities";
import { Stream } from "stream";

const Docker = require('dockerode');

const docker = new Docker({socketPath: '/var/run/docker.sock'});

export const InspectContainer = async (socket : Socket, ContainerName : string) => {


    const DockerContainerRepository = CTFDataSource.getRepository(DockerContainer);
    let container : DockerContainer = null;
    try {
        container = await DockerContainerRepository.findOneOrFail({where: {Name: ContainerName}});
    } catch (err) { return socket.emit('docker-logs-error', { data : `Container with name ${ContainerName} doesn't exist!`}); }


    try {
        
        const dockerContainer : Container = docker.getContainer(container.Name)
        
        const containerInspectInfo = await dockerContainer.inspect();

        dockerContainer.attach({logs: true, stream: true, stdout: true, stderr: true}, (err, stream) => {

            if (err) console.log(err);
            
            let stdout = new Stream.PassThrough();
            let stderr = new Stream.PassThrough();
            
            dockerContainer.modem.demuxStream(stream, stdout, stderr);
            stdout.setEncoding("utf-8");
            stdout.on("data", (data) => {
                socket.emit("log-stream", ({data, isError : false}))
            });
            stderr.setEncoding("utf-8");
            stderr.on("data", (data) => {
                socket.emit("log-stream", ({data, isError : true}));
            })

            
        })


    } catch (err) {
        console.log(err)   
    }

}