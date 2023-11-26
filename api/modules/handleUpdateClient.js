import { CLIENTS } from "../index.js";
import { sendData, sendError } from "./send.js";
import fs from 'node:fs/promises';

export const handleUpdateClient = (req, res, segments) =>{
    let body = '';
    const ticketNumber = segments[1];
    try{
        req.on('data', (chunk) => {
            body += chunk;
        });
    }catch(error){
        console.log(`Error on reading of request`);
        sendError(res, 500, 'Error of server in the reading of request');
    }

    req.on('end', async()=>{
        try{
            
            const updateDataClient = JSON.parse(body);
            
            if(
                !updateDataClient.fullname ||
                !updateDataClient.phone ||
                !updateDataClient.ticketNumber ||
                !updateDataClient.booking
            ){
                sendError(res, 400, "Not correct the personal date of client")
                return;
            }

            if(
                updateDataClient.booking && (!updateDataClient.booking.length ||
                !Array.isArray(updateDataClient.booking) || 
                !updateDataClient.booking.every((item) => item.comedian && item.time))
                )
                {
                    sendError(res, 400, "Not correct the information in the booking form");
                    return;
                }

            const clientData = await fs.readFile(CLIENTS, 'utf8');
            const clients = JSON.parse(clientData);

            const clientIndex = clients.findIndex((c) => c.ticketNumber === ticketNumber);
                if (clientIndex === -1){
                    sendError(res, 404, "A client with this number of ticket not founded")
                }

                clients[clientIndex] = {
                    ...clients[clientIndex], ...updateDataClient,
                };

            await fs.writeFile(CLIENTS,JSON.stringify(clients));
            sendData(res, clients[clientIndex]);
        }
        catch(error){
            console.error(`error: ${error}`);
            sendError(res, 500, "Error of server in updating of date");
        }
    })
}


