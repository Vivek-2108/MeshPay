const express=require("express");
const cors=require("cors");

const app=express();

app.use(cors());
app.use(express.json());
//Routes
const authRoutes=require("./routes/authRoutes");

//use route
app.use("/api/auth",authRoutes);


app.get("/",(req,res)=>{
    res.json("Mesh backend is running...");
})

module.exports = app;