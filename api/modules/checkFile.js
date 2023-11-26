import fs from 'node:fs/promises';

export const checkFile = async (path, createIfMissing) =>{
    if(createIfMissing){
try{
        await fs.access(path);
    }catch(error){
        console.log('error: ', error);
        console.error(`File${path} not found`);
        return true;
    }
    }
    
        try{
            await fs.access(path);
        }catch(error){
            console.log('error: ', error);
            console.log(`File ${path} was created`);
        return false;
        }
        return true;
    };