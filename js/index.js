
// variables initialization
const CURR_DATE = getCurrDate();

const PERIOD = {};
PERIOD.length = 7; // by default
PERIOD.begin = setPeriod(CURR_DATE, PERIOD.length); // by default
PERIOD.end = CURR_DATE; // by default

const CALENDAR = {
  from: {
    mainDate: null,
    firstDay: null,
    firstDayNum: null,
    daysInMonth: null,
    daysInPrevMonth: null
  },
  to: {
    mainDate: null,
    firstDay: null,
    firstDayNum: null,
    daysInMonth: null,
    daysInPrevMonth: null
  }
};

const monthFormatterShort = new Intl.DateTimeFormat("en-us", { month: "short" });
const monthFormatterLong = new Intl.DateTimeFormat("en-us", { month: "long" });
const dateFormatter = new Intl.DateTimeFormat("en-us",
  {
    year: "2-digit",
    month: "short",
    day: "2-digit"
  });

init();

function init() {

  updateWidget();
  addListeners();
}

function updateWidget() {
  //
  let widgetTitlePeriod = getElement('.widget-title__text');
  widgetTitlePeriod.innerHTML = `${dateFormatter.format(PERIOD.begin)} - ${dateFormatter.format(PERIOD.end)}`;

  let periodOptionCurrValue = getElement('.period-dropdown__text');
  periodOptionCurrValue.innerHTML = 'Last 7 days'; // By default;  there shuld be an update-function in this place

  updateDatePickers();
}

function updateDatePickers() {

  updatePickerTitles();
  updateCalendar(PERIOD.begin, true);
  updateCalendar(PERIOD.end, false);
}

function updatePickerTitles() {

  let monthBegin = monthFormatterLong.format(PERIOD.begin);
  let monthEnd = monthFormatterLong.format(PERIOD.end);
  let yearBegin = PERIOD.begin.getFullYear();
  let yearEnd = PERIOD.end.getFullYear();
  let pickerTitleBegin = `${monthBegin} ${yearBegin}`;
  let pickerTitleEnd = `${monthEnd} ${yearEnd}`;

  let pickerElemBegin = getElement('.datepicker-title_begin');
  pickerElemBegin.innerHTML = pickerTitleBegin;

  let pickerElemEnd = getElement('.datepicker-title_end');
  pickerElemEnd.innerHTML = pickerTitleEnd;
}



function updateCalendar(date, isFrom) {

  let mainDate = date;

  let firstMonthDay = new Date(mainDate.getFullYear(), mainDate.getMonth(), 1); // date of the main month first day
  let firstMonthDayNum = firstMonthDay.getDay(); // number of day in the week
  let daysInMonth = new Date(mainDate.getFullYear(), mainDate.getMonth() + 1, 0).getDate(); // number of days in the main month
  let daysInPrevMonth = new Date(mainDate.getFullYear(), mainDate.getMonth(), 0).getDate(); // number of days in the previous month

  let key = '';

  if (isFrom) {
    key = 'from';
  } else {
    key = 'to';
  }

  CALENDAR[key] = {
    mainDate: mainDate,
    firstDay: firstMonthDay,
    firstDayNum: firstMonthDayNum,
    daysInMonth: daysInMonth,
    daysInPrevMonth: daysInPrevMonth
  };

  let datesArray = formDatesArray(CALENDAR[key]);

  fillCalendar(datesArray, isFrom);

}

function formDatesArray(currCalendar) {

  let datesArray = [];
  let week = -1;

  for (let day = 0; day < 35; day++) {

    if ( day % 7 === 0) {week++};

    datesArray[day] = addDay(week, day, currCalendar);
  }

  return datesArray;
}

function addDay (week, day, currCalendar) {

  if ((week === 0) && (day < currCalendar.firstDayNum)) {

    return {
      date: currCalendar.daysInPrevMonth - currCalendar.firstDayNum + day + 1,
      class: 'other-month'
    }; // previous month days
  }

  if ((week === 4) && (day > currCalendar.daysInMonth + 1)) {

    return {
      date: day - currCalendar.daysInMonth - 1,
      class: 'other-month'
    }; // next month days
  }

  return {
    date: day - currCalendar.firstDayNum + 1,
    class: 'main-month'
  }; // main month days

}

function fillCalendar(datesArray, isFrom) {

  let query = '';

  if (isFrom) {
    query = '.datepicker-begin';
  } else {
    query = '.datepicker-end';
  }

  let table = getElement('.calendar-table', getElement(query));

  let weekCounter = 0;

  datesArray.forEach((item, num) => {

    if ( num % 7 === 0 ) {
      weekCounter++;
      table.children[0].appendChild(document.createElement('tr'));
    };

    table.children[0].children[weekCounter].innerHTML+=`<td class="calendar-day ${item.class}">${item.date}</td>`;
  });
}


function setPeriod(firstDate, days) {

  let resDate = new Date(firstDate);
  resDate.setDate(resDate.getDate() - days);

  return resDate;
}


function getElement(query, parentNode) {

  if (parentNode) {
    return parentNode.querySelector(query);
  }

  return document.body.querySelector(query);
}

function getCurrDate() {

  return new Date();
}

function addListeners() {

  periodOptionsListeners();
  datesOptionsListeners();
}

function periodOptionsListeners() {
  // time period option
  let periodOption = getElement('.period-dropdown__pseudo-button');
  let periodDropdownContent = getElement('.period-dropdown__content');
  periodOption.addEventListener('click', () => {
    if (periodDropdownContent.classList.contains('hidden')) {
      periodDropdownContent.classList.remove('hidden');

      return;
    }

    periodDropdownContent.classList.add('hidden');
  });
}

function datesOptionsListeners() {
    // dates
    let dateFrom = getElement('.from-date__option');
    let pickerBegin = getElement('.datepicker-begin');

    dateFrom.addEventListener('click', () => {
      if (pickerBegin.classList.contains('hidden')) {
        pickerBegin.classList.remove('hidden');

        return;
      }

      pickerBegin.classList.add('hidden');
    });

    let dateTo = getElement('.to-date__option');
    let pickerEnd = getElement('.datepicker-end');

    dateTo.addEventListener('click', () => {
      if (pickerEnd.classList.contains('hidden')) {
        pickerEnd.classList.remove('hidden');

        return;
      }

      pickerEnd.classList.add('hidden');
    });
  }