// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";

import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const button = document.querySelector('.btn');
const datetimePicker = document.querySelector('#datetime-picker');
const valueDays = document.querySelector('.valueDays');
const valueHours = document.querySelector('.valueHours');
const valueMinute = document.querySelector('.valueMinute');
const valueSec = document.querySelector('.valueSec');
let intervalId;
let userSelectedDate = 0;

function convertMs(ms) {
  const days = Math.floor(ms / DAY);
  const hours = Math.floor((ms % DAY) / HOUR);
  const minutes = Math.floor(((ms % DAY) % HOUR) / MINUTE);
  const seconds = Math.floor((((ms % DAY) % HOUR) % MINUTE) / SECOND);
  return { days, hours, minutes, seconds };
}

function updateTimeDisplay(days, hours, minutes, seconds) {
  valueDays.innerHTML = addLeadingZero(days);
  valueHours.innerHTML = addLeadingZero(hours);
  valueMinute.innerHTML = addLeadingZero(minutes);
  valueSec.innerHTML = addLeadingZero(seconds);
}

function updateButtonStyles() {
  button.style.backgroundColor = 'rgb(207, 207, 207)';
  button.style.cursor = 'default';
  datetimePicker.style.cursor = 'default';
}

function disableControls() {
  datetimePicker.setAttribute('disabled', '');
  button.setAttribute('disabled', '');
}

function enableControls() {
  datetimePicker.removeAttribute('disabled');
  button.removeAttribute('disabled');
}

function handleTimerEnd() {
  clearInterval(intervalId);
  enableControls();
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function timeGo() {
  updateButtonStyles();
  disableControls();

  const currentTime = Date.now();
  const timeDifference = userSelectedDate - currentTime;

  if (timeDifference <= 0) {
    handleTimerEnd();
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeDifference);
  updateTimeDisplay(days, hours, minutes, seconds);
}

button.addEventListener('click', () => {
  disableControls();
  timeGo();
  intervalId = setInterval(timeGo, SECOND);
});

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const timeNow = Date.parse(new Date());

    if (timeNow > Date.parse(selectedDates[0])) {
      iziToast.error({
        backgroundColor: 'rgb(239, 64, 64)',
        messageColor: 'white',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      button.setAttribute('disabled', '');
    } else {
      userSelectedDate = Date.parse(selectedDates[0]);
      button.removeAttribute('disabled', '');
      button.style.backgroundColor = '#4e75ff';
    }
  },
};

flatpickr('#datetime-picker', options);
