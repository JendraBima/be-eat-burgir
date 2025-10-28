import express from "express";
import apiRouter from "./src/routes/api.js";
import cookieParser from "cookie-parser"; 
import cors from "cors";

const initFunctions = () => {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use("/api", apiRouter);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
initFunctions();