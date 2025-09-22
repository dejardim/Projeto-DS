import { ENV } from '@config/env';
import { logger } from '@config/logger';

import type { SendMailOptions, Transporter } from 'nodemailer';
import nodemailer from 'nodemailer';

const smtpTransporter: Transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_SECURE,
    auth: {
        user: ENV.SMTP_LOGIN,
        pass: ENV.SMTP_PASSWORD,
    },
});

const loggerTransporter: Pick<Transporter, 'sendMail'> = {
    async sendMail(mail: SendMailOptions) {
        logger.info(
            {
                event: 'email.send',
                to: mail.to,
                subject: mail.subject,
                text: mail.text,
            },
            'Email captured in development mode',
        );
        return Promise.resolve();
    },
};

export const mailTransporter: Transporter | typeof loggerTransporter =
    ENV.NODE_ENV === 'development' ? loggerTransporter : smtpTransporter;
