import { Notification } from './notification.js'
//request to server, for that we do async
export const getComedians = async () => {
    try{
        const response = await fetch('http://localhost:8080/comedians');
        if (!response.ok) {
            throw new Error(`Server return: ${response.status} error`);
        }
        return response.json();
    }
    catch(error){
        Notification.getInstance().show('There is error, try again');
    }
};


export const sendData = async(method, data, id) => {
    try{
        const response = await fetch(
            `http://localhost:8080/clients${id ? `/${id}` : ""}`,
        {
            method,
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data),
        },
        );
        if(!response.ok){
            throw new Error(`Server return: ${response.status} error`);
        }
        return true;
    }
    catch(error){
        Notification.getInstance().show('There is error, try again');
        return false;
    }
};