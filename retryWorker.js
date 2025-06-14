import axios from "axios"
import { payloadModel } from "./db.js "

const maxretries=5;

async function retry(clientURL){
   
    
    //Find the event associated with the given URL from the database
    const events=await payloadModel.findOne({url:clientURL})

    if(!events) return;

    if(events.status=='delivered')
    {
        await payloadModel.deleteOne({url:clientURL})
        return 
    }

   
    if(events.status==='pending' || events.status=='failed')
    {
        try{
             //Try sending the payload to the client server
            const response=await axios.post(clientURL,events.payload)

            // If the server responds with success
            if(response.status==200)
            {
                events.status='delivered'
                await payloadModel.deleteOne({url:clientURL}) //Remove event from DB
                
                return
            }

        }
         
        catch(err){
            // This block handles network errors (e.g. client server is offline or crashed)
            console.error('Failed to send to client,retrying.....')

                events.status='failed'
                events.retryCount+=1
                await events.save()
                let delay=1000*Math.pow(2,events.retryCount)  // Exponential backoff
                
                if(events.retryCount<=maxretries)
                {
                    console.log(`Retry count:${events.retryCount}`)
                    setTimeout(()=>{
                        retry(clientURL)
                    },delay)
                }

                else
                {
                    return
                }
        }

         

    }

}


export{
    retry
}