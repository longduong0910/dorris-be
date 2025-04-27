import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import resetPasswordRoutes from './routes/resetPassword.route.js';

const App = express();

App.use(cors());
App.use(express.json());
App.use('/auth', authRoutes);
App.use('/reset-password', resetPasswordRoutes);

export default App;