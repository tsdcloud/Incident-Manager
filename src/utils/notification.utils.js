import nodemailer from 'nodemailer';
import { EMAIL_HOST, EMAIL_HOST_PASSWORD, EMAIL_HOST_USER, EMAIL_PORT, EMAIL_USE_TLS } from '../config.js';

export const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false,
    auth: {
      user: EMAIL_HOST_USER,
      pass: EMAIL_HOST_PASSWORD
    },
  });