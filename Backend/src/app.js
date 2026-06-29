const express=require("express");
const cors=require("cors");

const app=express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes=require("./routes/authRoutes");
const accountRoutes=require("./routes/accountRoutes");
const transactionRoutes=require("./routes/transactionRoutes");
const meshRoutes=require("./routes/meshRoutes");
const bridgeRoutes=require("./routes/bridgeRoutes");

// Use routes
app.use("/api/auth",authRoutes);
app.use("/api/accounts",accountRoutes);
app.use("/api/transactions",transactionRoutes);
app.use("/api/mesh",meshRoutes);
app.use("/api/bridge",bridgeRoutes);

app.get("/",(req,res)=>{
    res.json("Mesh backend is running...");
})

module.exports = app;