import http from "node:http";
import fs from "node:fs/promises"; //read modules file from PC

const PORT = 8080;

http.createServer(async (req, res) => {
    if(req.method === "GET" && req.url === '/comedians'){
try{
        const data = await fs.readFile('comedians.json', 'utf-8');
        res.writeHead(200, {
    "Content-Type": "text/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
});
res.end(data);
}catch(error){
res.writeHead(500,{
    "Content-Type": "text/plain; charset=utf-8",
});
res.end(`Error of server: ${error}`);
}


    }else{
        res.writeHead(404,{
            "Content-Type": "text/json; charset=utf-8", //for Russian
        }); 
        res.end('Not found');
    }
}).listen(PORT);
