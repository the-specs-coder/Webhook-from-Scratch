import express from "express"
import { paymentDB } from "./db2.js";
const app = express();

/*This is an in memory storage data structure, when the client server restarts due to any issue all the 
  elements or data inside it is gone, so not a best choice, use a DB instead.*/
// const processedEvents = new Set();

app.use(express.json());

app.post('/webhook', async(req, res) => {
    const body= req.body;

    if(body)
    {
        const paymentStatus=await paymentDB.create({
          eventId:body.eventId,
          eventType:body.eventType
        })

        if(!await paymentDB.findOne({eventId:body.eventId}))
        {
            console.log("Event processed successfully")

            return res.status(200).json({
              message:"Payment Successful"
            })
        }
        
        else{
          return res.status(400).json({
            message:"Event Id already exists"
          })
        }
    }
    
    else
    {
       return res.status(400).json({
        message:"Bad Request"
       })
    }
});

app.listen(3000, () => console.log("Webhook Receiver running on port 3000"));
