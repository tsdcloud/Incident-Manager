import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const DB_URL = process.env.DB_URL;
export const USERS_API = process.env.USERS_API;
export const ADDRESS = process.env.ADDRESS;
export const ENTITY_API = process.env.ENTITY_API;
export const prisma = new PrismaClient();

export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_HOST_USER = process.env.EMAIL_HOST_USER;
export const EMAIL_HOST_PASSWORD = process.env.EMAIL_HOST_PASSWORD;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_USE_TLS = process.env.EMAIL_USE_TLS;
export const EMAIL_TIMEOUT = process.env.EMAIL_TIMEOUT;

export const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY
export const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY
export const NODE_ENV = process.env.NODE_ENV;