import { Notification } from './scripts/notification.js';
import './style.css';
import TomSelect from 'tom-select';
import Inputmask from "inputmask";
import JustValidate from 'just-validate';

const bookingComediansList = document.querySelector('.booking__comedians');
const MAX_COMEDIANS = 6;

const notification = Notification.getInstance();


const bookingForm = document.querySelector('.booking__form');

const createComediansBlock = (comedians) =>{
    const bookingComedian = document.createElement('li');
    bookingComedian.classList.add('booking__comedian');

    const bookingSelectComedian = document.createElement('select');
    bookingSelectComedian.classList.add('booking__select', 'booking__select_comedian');

    const bookingSelectTime = document.createElement('select');
    bookingSelectTime.classList.add('booking__select', 'booking__select_time');

    const inputHidden = document.createElement('input');
    inputHidden.type = 'hidden';
    inputHidden.name = 'booking';

    const bookingHall = document.createElement('button');
    bookingHall.classList.add('booking__hall');
    bookingHall.type = 'button';

    bookingComedian.append(bookingSelectComedian, bookingSelectTime, inputHidden)
    
    const bookingTomSelectComedian = new TomSelect(bookingSelectComedian, {
        hideSelected: true,
        placeholder: 'Choose your comedian',
        options: comedians.map(item=>({
    value: item.id,
    text: item.comedian,
        }))
    });
    const bookingTomSelectTime = new TomSelect(bookingSelectTime, {
        hideSelected: true,
        placeholder: 'Choose time',
        
    });

    bookingTomSelectTime.disable();

    bookingTomSelectComedian.on('change',(id)=>{
        bookingTomSelectTime.enable();
        bookingTomSelectComedian.blur();

        const { performances } = comedians.find((item)=>item.id === id);
        bookingTomSelectTime.clear();
        bookingTomSelectTime.clearOptions();
        bookingTomSelectTime.addOptions(performances.map(item=>({
            value:item.time,
            text:item.time,
        }))
        
        );
        bookingHall.remove();

    });
    
    bookingTomSelectTime.on('change',(time)=>{
        if(!time){
            return;
        };
        const idComedian = bookingTomSelectComedian.getValue();
        const { performances } = comedians.find((item)=>item.id === idComedian);
        const { hall } = performances.find((item)=>item.time === time);
        inputHidden.value = `${idComedian},${time}`;

        bookingTomSelectTime.blur();
        bookingHall.textContent = hall;
        bookingComedian.append(bookingHall);

        //!
        
    });
    const createNextBookingComedian =()=>{
        if (bookingComediansList.children.length < MAX_COMEDIANS){
            const nextComediansBlock=createComediansBlock(comedians);
            bookingComediansList.append(nextComediansBlock);
        }
        bookingTomSelectTime.off('change', createNextBookingComedian);
    };
    bookingTomSelectTime.on('change',createNextBookingComedian);


    return bookingComedian;
};
//request to server, for that we do async
const getComedians = async ()=>{
    const response = await fetch('http://localhost:8080/comedians');
    return response.json();
};
const init = async()=>{
    //for server
    const countComedians = document.querySelector('.event__info-item .event__info-number')
    const comedians = await getComedians();
    countComedians.textContent = comedians.length;
    console.log('comedians', comedians);

    const comedianBlock = createComediansBlock(comedians);
    bookingComediansList.append(comedianBlock)

    //validation
    const validate = new JustValidate(bookingForm, {
        errorFieldCssClass: 'booking__input_invalid',
        successFieldCssClass: 'booking__input_valid',
    });
    const booingInputFullname = document.querySelector(".booking__input_fullname");
    const bookingInputPhone = document.querySelector(".booking__input_phone");
    const bookingInputTicket = document.querySelector(".booking__input_ticket");

new Inputmask('+34(654)-101-242').mask(bookingInputPhone);
new Inputmask('14586790').mask(bookingInputTicket);

    validate
    .addField(booingInputFullname,[{
        rule: 'required',
        errorMessage:"You need write a name",
    },{
        validator: ()=> {},
        errorMessage: 'Incorrect name or fullname',
    }])
    .addField(bookingInputPhone, [{
        rule: 'required',
        errorMessage:"You need write a phone",
    },{
        validator: () => {
            const phone = bookingInputPhone.Inputmask.unmaskedvalue();
            return phone.length === 10;
        },
        errorMessage: 'Incorrect phone number',
    }])
    .addField(bookingInputTicket, [{
        rule: 'required',
        errorMessage:"You need write a ticket",
    },{
        validator: () => {
            const ticket = bookingInputTicket.Inputmask.unmaskedvalue();
            return ticket.length === 8 && !!Number(ticket);
        },
        errorMessage: 'Incorrect number of ticket',
    },
])
.onFail((fields)=>{
let errorMessage = '';

for (const key in fields) {
    if (!Object.hasOwnProperty.call(fields, key)) {
        continue;
    }
    const element = fields[key];
    if(!element.isValid){
        errorMessage+= `${element.errorMessage}, `;
    }
}
notification.show(errorMessage.slice(0, -2), false);
});

    //
    bookingForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        const data = {booking:[]};
        const times = new Set(); //get only unique

        new FormData(bookingForm).forEach((value, field)=>{
            if (field === 'booking'){
                const [comedian, time] = value.split(",");

                if(comedian && time){
                    data.booking.push({comedian, time})
                    times.add(time);
                }}else{
                    data[field] = value;
            }
            if(times.size !== data.booking.length){
                notification.show('You can not be in the same time in two place', false);
            }
        });
    });
};

init();