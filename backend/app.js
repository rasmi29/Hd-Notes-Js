//import express
import express from "express";

//create server
const app = express();

//json & form parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

//import routes 
import authRouter from "./src/routes/auth.routes.js"
import noteRouter from "./src/routes/note.routes.js"
import userRouter from "./src/routes/user.routes.js"

//routing
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/note", noteRouter);

//export app
export default app; 