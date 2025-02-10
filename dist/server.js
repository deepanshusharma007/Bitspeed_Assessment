"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const identifyRoutes_1 = __importDefault(require("./routes/identifyRoutes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', identifyRoutes_1.default);
// Serve index.html for the root route "/"
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
});
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
