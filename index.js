import express from "express";
import apiRouter from "./src/routes/api.js";
import cookieParser from "cookie-parser"; 
import cors from "cors";

const initFunctions = () => {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());
  app.use(cors({
    origin: [
      'http://localhost:5173', 
      'https://eat-burgir.vercel.app'
    ] ,
    credentials: true 
  }));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api", apiRouter);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
initFunctions();