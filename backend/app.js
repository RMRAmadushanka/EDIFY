/**
 * node express app
 */
import dotenv from "dotenv";
dotenv.config();
import  express from 'express';
import  session from 'express-session';
import { initKeycloak } from './config/keyclock-config.js';
//
const memoryStore = new session.MemoryStore();
const keycloak = initKeycloak(memoryStore);
//
import  xss from 'xss-clean';
import  mongoSanitize from 'express-mongo-sanitize';
import  compression from 'compression';
import  cors from 'cors';
//
const app = express();
// parse json request body
app.use(express.json({ limit: '50mb' }));

// parse urlencoded request body
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());
//
// keycloak
app.use(session({
    secret: 'ECC3A9BWRwADB11B11Gl8yhirbXIRDXY',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
app.set('trust proxy', false);
app.use(keycloak.middleware());
//
export default app;
