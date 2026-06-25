//Import library
const mongoose=require("mongoose");

//create connection 
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DataBase connected");
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}
module.export= connectDB ;