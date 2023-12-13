import { createComediansBlock } from "./comedians.js";


export const initChangeSection = (bookingForm, event, booking, eventBtnReserve, eventBtnEdit, bookingTitle, comedians, bookingComediansList) =>{

eventBtnEdit.style.transition = 'opacity 0.5s, visibility 0.5s';
eventBtnReserve.style.transition = 'opacity 0.5s, visibility 0.5s';
eventBtnReserve.classList.remove('event__btn_hidden');
eventBtnEdit.classList.remove('event__btn_hidden');

const changeSection = () =>{
    event.classList.toggle('event__hidden');
    booking.classList.toggle('booking__hidden');
    
if(!booking.classList.contains('booking__hidden')){
    const comedianBlock = createComediansBlock(comedians, bookingComediansList);
    bookingComediansList.append(comedianBlock);
}
    
};

eventBtnEdit.addEventListener('click',()=>{
    changeSection();
bookingTitle.textContent ='Edit your order';
bookingForm.method = 'PATCH';
});
eventBtnReserve.addEventListener('click',()=>{
    changeSection();
    bookingTitle.textContent ='Order your ticket';
    bookingForm.method = 'POST';
});

return changeSection;
};