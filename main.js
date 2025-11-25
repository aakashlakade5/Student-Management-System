// ✅ Core Imports
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Session, Flash & Middleware Setup
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';

app.use(session({
  secret: 'secretKey123',
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/sessionDB' }),
  resave: false,
  saveUninitialized: false,
  cookie: { 
    
  } // 1 day
}));

app.use(flash());

// 🔄 Make session data available in all views
app.use((req, res, next) => {
  res.locals.schoolId = req.session.schoolId || null;
  next();
});

// ✅ View Engine & Static Files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Database Connection
import { connectDB } from './config/database.js';
connectDB();

// ✅ Routes Import
import StudentRouter from './routes/studentsRoute.js';
import AuthRouter from './routes/authRoute.js';
import HomeRouter from './routes/indexRoute.js';
import DashboardRouter from './routes/indexRoute.js';

// ✅ Custom Middleware Example
const myMiddleware = (req, res, next) => {
  console.log('middleware');
  next();
};

// ✅ Mount Routes
app.use('/', HomeRouter);                         // Home and landing routes
app.use('/', myMiddleware, DashboardRouter);      // Dashboard with middleware
app.use('/', StudentRouter);                      // Student CRUD routes
app.use('/', AuthRouter);                         // Auth routes (login/signup/logout)

// ✅ 404 Error Page
app.use((req, res) => {
  res.status(404).render('errorHandling/404', {
    title: 'Error code 404',
    message: 'Page not found'
  });
});

// ✅ 500 Error Page
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errorHandling/500', {
    title: 'Error code 500',
    message: err.message
  });
  next();
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
