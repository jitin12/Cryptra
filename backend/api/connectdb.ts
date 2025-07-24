import mongoose from "mongoose";


export default function connectDB(){
    
    mongoose.connect("mongodb+srv://<db_username>:<db_password>@cluster0.9ymstek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>{console.log("Mongo Connected")})
    .catch((err)=>{
      console.log("error connecting mongo")
    })
}