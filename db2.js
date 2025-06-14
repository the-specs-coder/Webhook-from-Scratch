import mongoose from "mongoose";

mongoose.connect(process.env.DATABASE_URL_2)

const User=new mongoose.Schema({
    eventId:{
        type:Number,
        require:true
    },
    eventType:{
        type:String,
        require:true
    },

    paymentStatus:{
        type:Boolean,
        default:true
    }
})


const paymentDB=mongoose.model('paymentInfo',User)

export{
    paymentDB
}