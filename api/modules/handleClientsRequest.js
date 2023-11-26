import fs from "node:fs/promises";
import { sendData, sendError } from "./send.js";
import { CLIENTS } from "../index.js";

export const handleClientsRequest = async (req, res, ticketNumber)=>{
try{
    const clientData = await fs.readFile(CLIENTS, 'utf8')
    const clients = JSON.parse(clientData);

    const client = clients.find(c => c.ticketNumber === ticketNumber)
    if (!client){
        sendError(res, 404, "There is not a client with this number of ticket")
        return;
    }
    sendData(res, client);
}
catch(error){
    console.log(`Error in working request: ${error}`)
    sendError(res, 500, "Error of server in request of client");
}
}