import axios from "axios"
import {payloadModel} from "./db.js";
import {retry} from "./retryWorker.js";


const clientURL="http://localhost:3000/webhook"


 async function sendEvent(eventType, data) {
    const eventId = Math.floor((Math.random()*5))+1; //Generates random number from 1 to 5.
    const payload = {
        eventId,
        eventType,
        data
    };

    
    //tries to send to the client server when the event is triggered.
    try {
        const response=await axios.post(clientURL, payload)
        console.log(`Sent: ${eventType}, status: ${response.status}`)
      
    //else stores it in a db and retries after exponential intervals.
    } catch (err) {

        await payloadModel.create({
            url:clientURL,
            payload:{
                eventId:eventId,
                eventType:eventType,
                data:data,
            },
            
    })
        console.error(`Failed to sent ${eventType} event to the clientServer, moving it into db for retries....`)
        retry(clientURL)
    }
    
}


sendEvent('payment.success', { name: "Machine Learning Course from Coursera", price:"500" });






