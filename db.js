import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()
mongoose.connect(process.env.DATABASE_URL_1)

const eventPayload=new mongoose.Schema({
    url:{
     type:String,
     required:true
    },
    payload:{
      eventId:{
        type:String,
        required:true,
    },

      eventType:{
        type:String,
        required:true
    },
      data:{
        type:mongoose.Schema.Types.Mixed,
        required:true
      },
    },

      status:{
        type:String,
        enum:['pending','delivered','failed'],
        default:'pending'
      },

      retryCount:{
        type:Number,
        default:0
      },
    
})

const payloadModel=mongoose.model('eventPayload',eventPayload)

export{
    payloadModel
}