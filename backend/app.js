/**
 * node express app
 */
import  express from 'express';
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
export default app;
