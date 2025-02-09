import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import identifyRoutes from './routes/identifyRoutes';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', identifyRoutes);

// Serve index.html for the root route "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
