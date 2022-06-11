import nodemailer from 'nodemailer'
import { User } from '../../orm/entities';
import { transportConfig } from "./nodemailerConfig";


export const sendActivationEmail = async (user : User) => {
    
    const transporter = nodemailer.createTransport(transportConfig);

    const activationLink = `http://localhost:3000/v1/auth/activate/${user.ActivationCode}`;

    const mailConfig = {
        from: 'psopvctf@gmail.com',
        to: user.Email,
        subject: 'Account Activation',
        html: `<p> Please <a href='${activationLink}'> confirm your account </a> so you can start competing.</p>`
    };

    const info = transporter.sendMail(mailConfig);


    return info;

}