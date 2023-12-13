import './style.css';
import { getComedians } from './scripts/api.js';
import { initForm } from './scripts/form.js';
import { initChangeSection } from './scripts/changeSection.js';
import { createComediansBlock } from './scripts/comedians.js';

const init = async()=>{
    const bookingComediansList = document.querySelector('.booking__comedians');
    const bookingForm = document.querySelector('.booking__form');
    const countComedians = document.querySelector('.event__info-item_comedians .event__info-number')
    
    const bookingInputFullname = document.querySelector(".booking__input_fullname");
    const bookingInputPhone = document.querySelector(".booking__input_phone");
    const bookingInputTicket = document.querySelector(".booking__input_ticket");

    const event = document.querySelector('.event');
    const booking = document.querySelector('.booking');
    const eventBtnReserve = document.querySelector('.event__btn_reserve');
    const eventBtnEdit = document.querySelector('.event__btn_edit');
    const bookingTitle = document.querySelector('.booking__title');

    const comedians = await getComedians();


    if (comedians) {
    countComedians.textContent = comedians.length;
    const changeSection = initChangeSection(bookingForm, event, booking, eventBtnReserve, eventBtnEdit, bookingTitle, comedians, bookingComediansList);
    initForm(
        bookingForm, bookingInputFullname, bookingInputPhone, bookingInputTicket, changeSection, bookingComediansList
    );
}
};

init();