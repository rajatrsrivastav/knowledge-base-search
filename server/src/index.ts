import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv'

const app = express();

dotenv.config()
app.use(express.json());

app.use('/', (req:Request,res:Response)=>{
    res.status(200).json({message:"server is active"})
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

export default app;