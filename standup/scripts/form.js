import Inputmask from "inputmask";
import JustValidate from "just-validate";
import { Notification } from "./notification.js";
import { sendData } from "./api.js";
import { initChangeSection } from "./changeSection.js";


export const initForm = (bookingForm, bookingInputFullname, bookingInputPhone, bookingInputTicket, changeSection, bookingComediansList) =>{
//validation
const validate = new JustValidate(bookingForm, {
    errorFieldCssClass: 'booking__input_invalid',
    successFieldCssClass: 'booking__input_valid',
});


const phoneMask = new Inputmask("+99 999 999 999");
const ticketMask = new Inputmask("99999999");

phoneMask.mask(bookingInputPhone);
ticketMask.mask(bookingInputTicket);


validate.addField(bookingInputFullname, [
    {
    rule: 'required',
    errorMessage:"You need write a name",
},
]).addField(bookingInputPhone, [
    {
    rule: 'required',
    errorMessage:"You need write a phone",
},
{
    validator () {
        const phone = bookingInputPhone.inputmask.unmaskedvalue();
        return phone.length === 11 && !!Number(phone);
    },
    errorMessage: 'Incorrect phone number',
},
]).addField(bookingInputTicket, [
    {
    rule: 'required',
    errorMessage:"You need write a ticket",
},
{
    validator () {
        const ticket = bookingInputTicket.inputmask.unmaskedvalue();
        return ticket.length === 8 && !!Number(ticket);
    },
    errorMessage: 'Incorrect number of ticket',
},
]).onFail((fields)=>{
let errorMessage = "";

for (const key in fields) {
if (!Object.hasOwnProperty.call(fields, key)) {
    continue;
}
const element = fields[key];
if(!element.isValid){
    errorMessage += `${element.errorMessage}, `;
}
}
Notification.getInstance().show(errorMessage.slice(0, -2), false);
});

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if(!validate.isValid){
        return;
    }

    const data = {booking:[]};
    const times = new Set(); //get only unique

    new FormData(bookingForm).forEach((value, field)=>{
        if (field === 'booking'){
            const [comedian, time] = value.split(",");

            if(comedian && time){
                data.booking.push({comedian, time});
                times.add(time);
            }}else{
                data[field] = value;
        }
        
    });

    if(times.size !== data.booking.length){
        Notification.getInstance().show('You can not be in the same time in two place', false);
        return;
    }

    if(!times.size){
        Notification.getInstance().show('You don`t choose time');
        return;
    }

const method = bookingForm.getAttribute('method');
let isSend = false;

    if(method === 'PATCH'){
        isSend = await sendData(method, data, data.ticketNumber);
    }else{
        isSend = await sendData(method, data);
    }

    
    if(isSend){
        Notification.getInstance().show('Your booking ready', true);
        changeSection();
        bookingForm.reset();
        bookingComediansList.textContent = "";
    }
});
};
