import http from "node:http";
import fs from "node:fs/promises"; //read modules file from PC
import { sendError } from "./modules/send.js";
import { checkFileExist, createFileIfNotExist } from "./modules/checkFile.js";
import { handleComediansRequest } from "./modules/handleComediansRequest.js";
import { handleAddClient } from "./modules/handleAddClient.js";
import { handleClientsRequest } from "./modules/handleClientsRequest.js";
import { handleUpdateClient } from "./modules/handleUpdateClient.js";


const PORT = 8080;
const COMEDIANS = './comedians.json';
export const CLIENTS = './clients.json';

const startServer = async (port)=>{
    if (!(await checkFile(COMEDIANS))){//if return F its go be T
        return;
    } 
    //await checkFile(CLIENTS, true)
    await createFileIfNotExist(CLIENTS);

    const comediansData = await fs.readFile(COMEDIANS, 'utf-8');
    const comedians = JSON.parse(comediansData);

    http.createServer(async (req, res) => {
try{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type');

if(req.method === 'OPTIONS'){
    res.writeHead(204);
    res.end();
    return;
}

    const segments = req.url.split('/').filter(Boolean);
    
    if(!segments.length){
        sendError(res, 404, 'Not found');
        return;
    }
    const [resource, id] = segments;

        /*if(req.method === "GET" && segments[0] === 'comedians'){
            handleComediansRequest(req, res, comedians, segments);
            return;
        }  
        if(req.method === 'POST' && segments[0] === 'clients'){
            //POST / clients, add client
            handleAddClient(req, res);
            return;
        }
        if(req.method === 'GET' && segments[0] === 'clients' && segments.length === 2){
            //GET / clients/ticket, reciving client by number of ticket
            const ticketNumber = segments[1]
            handleClientsRequest(req, res, ticketNumber);
            return;
        }

        if(req.method === 'PATCH' && segments[0] === 'clients' && segments.length === 2){
            //PATCH / clients/:ticket, renovation client by number of ticket
            handleUpdateClient(req, res, segments);
            return;
        }
*/
if (req.method === "GET" && resource === "comedians") {
          handleComediansRequest(req, res, comedians, id);
          return;
        }

        if (req.method === "POST" && resource === "clients") {
          handleAddClient(req, res);
          return;
        }

        if (req.method === "GET" && resource === "clients" && id) {
          handleClientsRequest(req, res, id);
          return;
        }

        if (req.method === "PATCH" && resource === "clients" && id) {
          handleUpdateClient(req, res, id);
          return;
        }
        sendError(res, 404, 'Not found');
    }

    catch(error){
        sendError(res, 500, 'Server not found');
    }
            
    })
    .listen(port, ()=>{
        console.log(`Server on http://localhost:${port}`);
    });
};

startServer(PORT);
