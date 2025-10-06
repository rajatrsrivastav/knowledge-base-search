import express, {} from 'express';
import dotenv from 'dotenv';
const app = express();
dotenv.config();
app.use(express.json());
app.use('/', (req, res) => {
    res.status(200).json({ message: "server is active" });
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
export default app;
//# sourceMappingURL=index.js.map