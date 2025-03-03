import { createTransport } from 'nodemailer';
import { AttachmentLike, Options } from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Readable } from 'stream';

export interface IMailOptions extends Options {
    from: string;
    to: string[];
    subject: string;
    html: string | Buffer | Readable | AttachmentLike | undefined;
}

export const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.HOST_EMAIL_PASSWORD,
    },
});

export const sendMail = (mailOptions: Options): Promise<SMTPTransport.SentMessageInfo> => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};
