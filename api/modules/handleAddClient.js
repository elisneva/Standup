import { CLIENTS } from "../index.js";
import { sendData, sendError } from "./send.js";
import fs from 'node:fs/promises';

export const handleAddClient = (req, res) =>{
    let body = '';
    try{
        req.on('data', chunk => {
            body += chunk;
        });
    }catch(error){
        console.log(`Error on reading of request`);
        sendError(res, 500, 'Error of server in the reading of request');
    }

    req.on('end', async()=>{
        try{
            
            const newClient = JSON.parse(body);
            
            if(
                !newClient.fullname ||
                !newClient.phone ||
                !newClient.ticketNumber ||
                !newClient.booking
            ){
                sendError(res, 400, "Not correct the personal date of client")
                return;
            }

            if(
                newClient.booking && (!newClient.booking.length ||
                !Array.isArray(newClient.booking) || 
                !newClient.booking.every((item) => item.comedian && item.time))
                )
                {
                    sendError(res, 400, "Not correct the information in the booking form");
                    return;
                }

            const clientData = await fs.readFile(CLIENTS, 'utf8');
            const clients = JSON.parse(clientData);

            clients.push(newClient);
            await fs.writeFile(CLIENTS,JSON.stringify(clients));
            sendData(res, newClient);
        }
        catch(error){
            console.log('error: ', error);
        }
    })
}