import nodemailer from 'nodemailer'
import { User } from '../../orm/entities';
import { transportConfig } from "./nodemailerConfig";


export const sendResetPasswordEmail = async (user : User) => {
    
    const transporter = nodemailer.createTransport(transportConfig);

    const resetLink = `http://localhost:8080/reset-password/${user.ActivationCode}`;

    const mailConfig = {
        from: 'psopvctf@gmail.com',
        to: user.Email,
        subject: 'Reset Password',
        html: `
                <h3> ${user.Name} </h3>
                <p> You can reset your password with the following <a href='${resetLink}'>link</a>. </p>
            `
    };

    const info = transporter.sendMail(mailConfig);

    return info;

}