import './style.css';
import TomSelect from 'tom-select';

const bookingComediansList = document.querySelector('.booking__comedians');
const MAX_COMEDIANS = 6;

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
}

init()