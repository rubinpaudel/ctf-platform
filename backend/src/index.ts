import 'reflect-metadata';
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
dotenv.config();

import { CTFDataSource } from './orm/dataSource';
import { ErrorHandler } from './middleware/errorHandler';
import { loadTestData } from './orm/loadTestData'
import jwt from 'jsonwebtoken';
import { JwtPayload } from "./types/JwtPayload";
import routes from './routes';
import io from './controllers/socket/socket'
import { CheckAdminSocketConnection } from './middleware/socket/CheckAdminSocketConnection';
import { Socket } from 'socket.io';
import { CheckUserSocketConnection } from './middleware/socket/CheckUserSocketConnection';
import { InspectContainer } from './controllers/docker/inspectContainer';
import {  User } from './orm/entities';
import { CleanAll } from './orm/cleanAll';

CTFDataSource.initialize()
    .then(async () => {

        const app = express();

        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({extended: false}));
        
        app.use('/', routes);
        
        app.use(ErrorHandler);

        const port = process.env.PORT || 3000;
        
        const server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

        // Socket
        io.initialisation(server);

        let users: {id: number, socketId: string[]}[]=[];
        try {


            const adminNamespace = io.getIO().of('/admin');
            const userNamespace = io.getIO().of('/user');


            
            adminNamespace.use(CheckAdminSocketConnection);
            
            adminNamespace.on('connection', async (socket : Socket) => {

                let JwtToken : string = socket.handshake.query.token as string; 
                let JwtPayload : JwtPayload;
                JwtPayload = jwt.verify(JwtToken, process.env.JWT_SECRET as string) as JwtPayload;
                let userId = JwtPayload.UserID;

                await addSocketIdToUser(socket.id, userId);


                socket.on('send-notification', ({title, message}) => {
                    userNamespace.emit('notification', {title, message});
                })
                socket.on('send-refresh-chart', () => {
                    userNamespace.emit('refresh-chart', true);
                })
                socket.on('send-refresh-chart', () => {
                    adminNamespace.emit('refresh-chart', true);
                })

                socket.on('docker-logs', async ({ContainerName}) => {
                    await InspectContainer(socket, ContainerName);
                })

                socket.on('new-usercategory', () => {
                    adminNamespace.emit("new-usercategory");
                    userNamespace.emit("new-usercategory");
                })

                socket.on('new-challengecategory', () => {
                    adminNamespace.emit("new-challengecategory");
                    userNamespace.emit("new-challengecategory");
                })

                socket.on('new-round', () => {
                    adminNamespace.emit("new-round");
                    userNamespace.emit("new-round");
                })

                socket.on('new-teamsize', () => {
                    adminNamespace.emit("new-teamsize");
                    userNamespace.emit("new-teamsize");
                })

                socket.on('new-team', () => {
                    adminNamespace.emit("new-team");
                    userNamespace.emit("new-team");
                })
                socket.on('delete-user', async({userId, teamId}) => {
                    const socketIds = await getSocketIdsByUserId(userId);
                    if(teamId != -1) {
                        userNamespace.to(teamId.toString()).emit("new-member");
                        socketIds.forEach(socketId => {
                            userNamespace.sockets.get(socketId).leave(teamId.toString());
                            userNamespace.sockets.get(socketId).emit("delete-user");
                        });
                    }else{
                        socketIds.forEach(socketId => {
                            userNamespace.sockets.get(socketId).emit("delete-user");
                        });
                    }
                    adminNamespace.emit("new-team");
                    userNamespace.emit("new-team");
                    removeUser(userId);
                })

                socket.on('new-image', () => {
                    adminNamespace.emit("new-image");
                })

                socket.on('new-container', () => {
                    adminNamespace.emit("new-container");
                })
                
                socket.on('new-time', () => {
                    adminNamespace.emit("new-time");
                    userNamespace.emit("new-time");
                })

                //DONE
                socket.on('delete-team', ({teamId, memberIds}) => {
                    const socketIds = getSocketIdsByUserIds(memberIds);
                    userNamespace.to(teamId.toString()).emit("kicked");
                    socketIds.forEach(socketId => {
                        userNamespace.sockets.get(socketId)?.leave(teamId.toString());
                    });
                    adminNamespace.emit("new-team");
                    userNamespace.emit("new-team");
                })

                //DONE
                socket.on('delete-solve', (teamId) => {
                    userNamespace.to(teamId.toString()).emit("new-solve");
                    adminNamespace.emit("new-team");
                    userNamespace.emit("new-team");
                })

                //DONE
                socket.on('delete-purchase', (teamId) => {
                    userNamespace.to(teamId.toString()).emit("new-purchase");
                    adminNamespace.emit("new-team");
                    userNamespace.emit("new-team");
                })

                socket.on('disconnect', async() => {
                    await removeSocketIdFromUser(socket.id, userId);
                })
            })
        

            userNamespace.use(CheckUserSocketConnection);

            userNamespace.on('connection', async(socket : Socket) => {

                let JwtToken : string = socket.handshake.query.token as string; 
                let JwtPayload : JwtPayload;
                JwtPayload = jwt.verify(JwtToken, process.env.JWT_SECRET as string) as JwtPayload;
                let userId = JwtPayload.UserID;

                await addSocketIdToUser(socket.id, userId);
                
                
                // Set user in team room
                const user = (await CTFDataSource.getRepository(User).findOne({where: {Id: userId}, select: ["Team"]}));
                if(user?.Team){
                    socket.join(user.Team.Id.toString())
                }

                // DONE
                socket.on('create-team', async(userId) => {
                    const teamId = (await CTFDataSource.getRepository(User).findOne({where: {Id: userId}})).Team.Id.toString()
                    const ids = await getSocketIdsByUserId(userId);
                    ids.forEach(socketId => {
                        userNamespace.sockets.get(socketId).join(teamId);
                    });
                    adminNamespace.emit("new-team");
                    userNamespace.emit("new-team");
                })
                
                // NOT DONE
                socket.on('new-solve', async() => {
                    const teamId = (await CTFDataSource.getRepository(User).findOne({where: {Id: userId}})).Team.Id.toString()
                    userNamespace.to(teamId.toString()).emit("new-solve");
                    adminNamespace.emit("new-team");
                    userNamespace.emit("new-team");
                })

                // DONE
                socket.on('join-team', async({teamId, userId}) => {
                    const socketIds = await getSocketIdsByUserId(userId);
                    userNamespace.to(teamId.toString()).emit("new-member");
                    socketIds.forEach(socketId => {
                        userNamespace.sockets.get(socketId).join(teamId.toString());
                    });
                    adminNamespace.emit("new-team");
                    userNamespace.emit("new-team");
                })

                // DONE
                socket.on('leave-team', async({teamId, userId}) => {
                    const socketIds = await getSocketIdsByUserId(userId);
                    socketIds.forEach(socketId => {
                        userNamespace.sockets.get(socketId).emit('kicked');
                        userNamespace.sockets.get(socketId).leave(teamId.toString());
                    });
                    userNamespace.to(teamId.toString()).emit("new-member");
                    adminNamespace.emit("new-team");
                    userNamespace.emit("new-team");
                })
                
                //DONE
                socket.on('delete-team', ({teamId, memberIds}) => {
                    const socketIds = getSocketIdsByUserIds(memberIds);
                    userNamespace.to(teamId.toString()).emit("kicked");
                    socketIds.forEach(socketId => {
                        userNamespace.sockets.get(socketId).leave(teamId.toString());
                    });
                    adminNamespace.emit("new-team");
                    userNamespace.emit("new-team");
                })
                
                //DONE
                socket.on('kick-member', async({teamId, kickedId}) => {
                    const socketIds = await getSocketIdsByUserId(kickedId);
                    socketIds.forEach(socketId => {
                        userNamespace.sockets.get(socketId).emit("kicked");
                    });
                    socketIds.forEach(socketId => {
                        userNamespace.sockets.get(socketId).leave(teamId.toString());
                    });
                    userNamespace.to(teamId.toString()).emit("new-member");
                    adminNamespace.emit("new-team");
                    userNamespace.emit("new-team");
                })

                //DONE
                socket.on('new-purchase', (teamId) => {
                    userNamespace.to(teamId.toString()).emit("new-purchase");
                    adminNamespace.emit("new-team");
                    userNamespace.emit("new-team");
                })

                //DONE
                socket.on('new-solve', () => {
                    userNamespace.to(user.Team.Id.toString()).emit("new-solve");
                    adminNamespace.emit("new-team");
                    userNamespace.emit("new-team");
                })

                socket.on('send-refresh-chart', () => {
                    userNamespace.emit('refresh-chart', true);
                })
                socket.on('send-refresh-chart', () => {
                    adminNamespace.emit('refresh-chart', true);
                })

                socket.on('disconnect', async() => {
                    await removeSocketIdFromUser(socket.id, userId);
                    const team = (await CTFDataSource.getRepository(User).findOne({where: {Id: userId}, select: ["Team"]}));
                    if(team){
                        socket.leave(team.Id.toString())
                    }
                })
            })

            
        } catch (error) {
            console.log(error)
        }

        const getSocketIdsByUserIds = (userIds: number[]) => {
            let ids = [];
            for(const user of users){
                if(userIds.includes(user.id)){
                    if(user.socketId.length > 1){
                        user.socketId.forEach((socketId)=>ids.push(socketId))
                    }
                    else if(user.socketId.length == 1){
                        ids.push(user.socketId[0]);
                    }
                }
            }
            return ids;
        }

        const removeUser = async(userId: number) =>{
            let userIndex = 0;
            let found = false;
            for(const [index, user] of users.entries()){
                if(user.id == userId){
                    found = true;
                    userIndex = index;
                    break;
                }
            }
            if(found){
                users.splice(userIndex, 1);
            }
        }

        const getSocketIdsByUserId = async(userId: number) => {
            for(const user of users){
                if(userId == user.id){
                    return user.socketId;
                }
            }
            return [];
        }


        const removeSocketIdFromUser = async(idSocket: string, userId: number) =>{
            let userIndex = -1;
            let socketIndex = 0;
            let hasMultipleSockets = false;
            let found = false;
            for(const [index, user] of users.entries()){
                if(user.id == userId){
                    found = true;
                    userIndex = index;
                    if(user.socketId.length > 1){
                        hasMultipleSockets = true;
                        for(let indexS = 0; indexS < user.socketId.length; indexS++){
                            if(user.socketId[indexS] == idSocket){
                                socketIndex = indexS;
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            if(found){
                if(hasMultipleSockets){
                    users[userIndex].socketId.splice(socketIndex,1);
                }
                else{
                    users.splice(userIndex, 1);
                }
            }
        }
        
        const addSocketIdToUser = async(idSocket:string, userId: number) =>{
            if(users.length > 0){
                let alreadyIn = false;
                for(const user of users){
                    if(user.id == userId){
                        alreadyIn = true;
                        user.socketId.push(idSocket);
                        break;
                    }
                }
                if(!alreadyIn){
                    users.push({id: userId, socketId: [idSocket]})
                }
            }else{
                users.push({id: userId, socketId: [idSocket]})
            }
        }

        // USE THIS FOR LOADING DATA, USE 1 TIME ONLY FOR NOW
        //CleanAll();
        //loadTestData();
              
    })
    .catch((err) => console.log(err));