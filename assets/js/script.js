let scheduleData = JSON.parse(localStorage.getItem('schedule')) || [];
console.log(scheduleData);

// Toast message
const sendToastMessage = (status, message, confirm = false) => {
  let html;

  if (confirm) {
    html = `
        <div id="toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-body">
            ${message}
            <div class="mt-2 pt-2 border-top">
              <button type="button" class="btn btn-primary btn-sm confirm-delete-btn">Confirm</button>
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Cancel</button>
            </div>
          </div>
        </div>`;
  } else {
    html = `
        <div
          id="toast"
          class="toast align-items-center text-bg-${status} border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button
              type="button"
              class="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>`;
  }

  const toastContainer = document.querySelector('.toast-container');
  toastContainer.insertAdjacentHTML('afterbegin', html);

  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(
    document.getElementById('toast')
  );
  toastBootstrap.show();

  setTimeout(() => {
    toastContainer.removeChild(document.getElementById('toast'));
  }, 6000);
};

// FLATPICKR
document.addEventListener('DOMContentLoaded', function () {
  flatpickr('#schedule-date-picker--add', {
    dateFormat: 'Y-m-d',
  });
});

document.addEventListener('DOMContentLoaded', function () {
  flatpickr('#date-picker', {
    dateFormat: 'Y-m-d',
  });
});

// Declare dom element
const calendarContainer = document.querySelector('.header-calendar');
const calendar = document.querySelector('.calendar');
const datePicker = document.getElementById('date-picker');

// Get current month, year and date
let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();
const monthsInWord = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
let currentDate = new Date().getDate();
let weekdaysInWord = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Create calendar
const createCalendar = async function (
  currentMonth,
  currentYear,
  date = new Date().getDate()
) {
  // Calculate the first day of the month to weekday (Gauss's algorithm)
  // 1. Leap year or common year
  const leapYear =
    (currentYear % 4 == 0 && currentYear % 100 != 0) || currentYear % 400 == 0;

  // 2. Get month offset with current month
  let m;
  if (currentMonth === 1) {
    m = 0;
  }
  if (currentMonth === 2) {
    m = 3;
  }
  if (leapYear) {
    switch (currentMonth) {
      case 3:
        m = 4;
        break;
      case 4:
        m = 0;
        break;
      case 5:
        m = 2;
        break;
      case 6:
        m = 5;
        break;
      case 7:
        m = 0;
        break;
      case 8:
        m = 3;
        break;
      case 9:
        m = 6;
        break;
      case 10:
        m = 1;
        break;
      case 11:
        m = 4;
        break;
      case 12:
        m = 6;
        break;
    }
  } else {
    switch (currentMonth) {
      case 3:
        m = 3;
        break;
      case 4:
        m = 6;
        break;
      case 5:
        m = 1;
        break;
      case 6:
        m = 4;
        break;
      case 7:
        m = 6;
        break;
      case 8:
        m = 2;
        break;
      case 9:
        m = 5;
        break;
      case 10:
        m = 0;
        break;
      case 11:
        m = 3;
        break;
      case 12:
        m = 5;
        break;
    }
  }

  // 3. Calculate with formula
  const weekday =
    (1 +
      m +
      5 * ((currentYear - 1) % 4) +
      4 * ((currentYear - 1) % 100) +
      6 * ((currentYear - 1) % 400)) %
    7;

  // Calculate the number of days of the month and the previous month
  const numDays = new Date(currentYear, currentMonth, 0).getDate();
  const numDaysP = new Date(currentYear, currentMonth - 1, 0).getDate();

  // Insert days to html calendar
  let html = '',
    wd = 0;

  // 1. Insert days of previous month if the first day of current month is not on sunday
  if (weekday != 0) {
    for (let i = numDaysP - weekday + 1; i <= numDaysP; i++) {
      html += `<div class="calendar-item calendar-item--not-month" style="color: var(--gray-color-1)">${weekdaysInWord[
        wd
      ].substring(0, 2)}<div>${i}</div></div>`;
      wd++;
    }
    // Insert days of current month for full week
    for (let i = 1; i <= 7 - weekday; i++) {
      html += `<div class="calendar-item ${
        i == currentDate &&
        currentMonth == new Date().getMonth() + 1 &&
        currentYear == new Date().getFullYear()
          ? 'calendar-item-current'
          : ''
      }" id="${i}">${weekdaysInWord[wd].substring(0, 2)}<div>${i}</div></div>`;
      wd++;
    }
    calendar.insertAdjacentHTML('beforeend', html);
  }

  // 2. Insert next days of current month
  html = '';
  let i = weekday != 0 ? 7 - weekday + 1 : 1;
  let c = 0;
  while (i <= numDays) {
    for (let j = 0; j < 7; j++) {
      html += `<div class="calendar-item ${
        i == currentDate &&
        currentMonth == new Date().getMonth() + 1 &&
        currentYear == new Date().getFullYear()
          ? 'calendar-item-current'
          : ''
      }"  id="${i}">${
        weekday == 0 && c < 7 ? `${weekdaysInWord[wd].substring(0, 2)}` : ''
      }<div>${i}</div></div>`;
      i++;
      c++;
      wd++;
      if (i > numDays) break;
    }
  }
  calendar.insertAdjacentHTML('beforeend', html);

  // 3. Insert remain days if calendar is not full
  let remainDays = 0;
  if (calendar.children.length < 42) {
    remainDays = 42 - calendar.children.length;
    for (let i = 1; i <= remainDays; i++) {
      calendar.insertAdjacentHTML(
        'beforeend',
        `<div class="calendar-item calendar-item--not-month" style="color: var(--gray-color-1)"><div>${i}</div></div>`
      );
    }
  }

  const daysInMonth = [...calendar.children].filter((day) => day.id);

  // 4. Insert schedules to calendar
  if (scheduleData) {
    scheduleData.forEach((schedule, i) => {
      if (
        +schedule.date.split('-')[1] == currentMonth &&
        +schedule.date.split('-')[0] == currentYear
      ) {
        daysInMonth[+schedule.date.slice(-2) - 1].insertAdjacentHTML(
          'beforeend',
          `<div id="${schedule.id}" class="schedule--month-view ${schedule.category}" data-date="${schedule.date}" data-category="${schedule.category}" title="${schedule.title}" data-time="${schedule.from}-${schedule.to}" data-location="${schedule.location}"><span style="color: var(--gray-color); font-weight: 300">${schedule.from}-${schedule.to}</span> | <span style="font-weight: bold">${schedule.title}</span></div>`
        );
      }
    });
  }

  // 5. Update date picker value
  datePicker.value = `${currentYear}-${
    currentMonth < 10 ? '0' : ''
  }${currentMonth}-${date < 10 ? '0' : ''}${date}`;

  flatpickr('#date-picker', {
    dateFormat: 'Y-m-d',
    defaultDate: `${currentYear}-${
      currentMonth < 10 ? '0' : ''
    }${currentMonth}-${date < 10 ? '0' : ''}${date}`,
  });

  // 6. Add event listener to calendar item
  const calendarItems = [...document.querySelectorAll('.calendar-item')];

  document.addEventListener('click', function (e) {
    const calendarItem = e.target.closest('.calendar-item');

    if (!calendarItem) return;

    calendarItems.forEach((item) => {
      item.classList.remove('calendar-item-selected');
      item.classList.remove('first-line');
    });

    if (!calendarItem.classList.contains('calendar-item-current')) {
      calendarItem.classList.add('calendar-item-selected');
      if (calendarItems.indexOf(calendarItem) < 7)
        calendarItem.classList.add('first-line');
    }

    // Update date picker value
    datePicker.value = `${currentYear}-${
      currentMonth < 10 ? '0' : ''
    }${currentMonth}-${calendarItem.id < 10 ? '0' : ''}${calendarItem.id}`;

    flatpickr('#date-picker', {
      dateFormat: 'Y-m-d',
      defaultDate: `${currentYear}-${
        currentMonth < 10 ? '0' : ''
      }${currentMonth}-${calendarItem.id < 10 ? '0' : ''}${calendarItem.id}`,
    });
  });
};

// Call to create calendar for the current time when user access
createCalendar(currentMonth, currentYear);

// HANDLE DATE PICKER
const handleMonthChange = function (date = new Date().getDate()) {
  // Reset current calendar
  calendar.innerHTML = '';

  // Update calendar with changed time
  createCalendar(currentMonth, currentYear, date);
};

datePicker.addEventListener('change', () => {
  const year = +datePicker.value.substring(0, 4);
  const month = +datePicker.value.substring(5, 7);
  const date = +datePicker.value.slice(-2);

  currentMonth = month;
  currentYear = year;

  handleMonthChange(date);
});

// HANDLE ADD SCHEDULE FORM
const openAddScheduleForm = document.querySelector('.add-schedule-open-btn');
const addScheduleForm = document.querySelector('#add-schedule-form');
const addScheduleBtn = document.querySelector('.add-schedule-btn');
const scheduleTitleInput = document.querySelector('#schedule-title-input--add');
const scheduleDateInput = document.querySelector('#schedule-date-picker--add');
const scheduleTimeFromInput = document.querySelector(
  '#schedule-time-input--from--add'
);
const scheduleTimeToInput = document.querySelector(
  '#schedule-time-input--to--add'
);
const scheduleLocationInput = document.querySelector(
  '#schedule-location-input--add'
);
const categoryOptions = document.querySelectorAll('.category-option');

openAddScheduleForm.addEventListener('click', () => {
  addScheduleForm.classList.toggle('open');
  scheduleTitleInput.focus();
  flatpickr('#schedule-date-picker--add', {
    dateFormat: 'Y-m-d',
    defaultDate: datePicker.value,
  });
});

document.addEventListener('click', (e) => {
  if (
    !e.target.closest('#add-schedule-form') &&
    !e.target.closest('.add-schedule-open-btn') &&
    !e.target.closest('.flatpickr-calendar')
  )
    addScheduleForm.classList.remove('open');
});

let category;

const handleSelectCategory = (categories) => {
  categories.forEach((option, i) => {
    option.addEventListener('click', (e) => {
      category = e.target.classList[1];
      e.target.classList.add('selected');
      [...e.target.parentElement.children].forEach((otherOption, j) => {
        if (i != j) otherOption.classList.remove('selected');
      });
    });
  });
};

handleSelectCategory(categoryOptions);

addScheduleForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!scheduleDateInput.value) {
    sendToastMessage('warning', "Schedule's date is not selected");
    return;
  }

  if (scheduleTimeFromInput.value >= scheduleTimeToInput.value) {
    sendToastMessage('warning', "Schedule's time is not valid");
    return;
  }

  if (!category) {
    sendToastMessage('warning', "Schedule's category is not selected");
    return;
  }

  const schedule = {
    id: scheduleData.length,
    title: scheduleTitleInput.value,
    date: scheduleDateInput.value,
    from: scheduleTimeFromInput.value,
    to: scheduleTimeToInput.value,
    location: scheduleLocationInput.value,
    category,
  };

  scheduleData.push(schedule);

  if (
    +schedule.date.split('-')[1] == currentMonth &&
    +schedule.date.split('-')[0] == currentYear
  ) {
    const daysInMonth = [...calendar.children].filter((day) => day.id);
    daysInMonth[+schedule.date.slice(-2) - 1].insertAdjacentHTML(
      'beforeend',
      `<div class="schedule--month-view ${schedule.category}" data-date="${schedule.date}" data-category="${schedule.category}" title="${schedule.title}" data-time="${schedule.from}-${schedule.to}" data-location="${schedule.location}"><span style="color: var(--gray-color); font-weight: 300">${schedule.from}-${schedule.to}</span> | <span style="font-weight: bold">${schedule.title}</span></div>`
    );
  }

  localStorage.setItem('schedule', JSON.stringify(scheduleData));

  sendToastMessage('success', 'Schedule was added successfully!');
  setTimeout(() => {
    location.reload();
  }, 2000);
});

// HANDLE OPEN SCHEDULE DETAIL
document.addEventListener('click', (e) => {
  const scheduleMonthEl = e.target.closest('.schedule--month-view');
  let scheduleEditFormEl = document.querySelector('#edit-schedule-form');

  if (!scheduleMonthEl && !e.target.closest('#edit-schedule-form')) {
    if (scheduleEditFormEl)
      document.querySelector('body').removeChild(scheduleEditFormEl);

    return;
  }

  const scheduleMonth = {
    title: scheduleMonthEl.title,
    month: currentMonth,
    date: scheduleMonthEl.dataset.date,
    category: scheduleMonthEl.dataset.category,
  };

  let html = '';
  let top =
    visualViewport.height - scheduleMonthEl.getBoundingClientRect().top < 328
      ? `top: ${
          visualViewport.height -
          scheduleMonthEl.getBoundingClientRect().bottom +
          40
        }px`
      : `top: ${scheduleMonthEl.getBoundingClientRect().top}px`;
  let left =
    visualViewport.width - scheduleMonthEl.getBoundingClientRect().right > 360
      ? scheduleMonthEl.getBoundingClientRect().right + 12
      : scheduleMonthEl.getBoundingClientRect().left - 415;

  scheduleMonth.year = currentYear;
  scheduleMonth.timeFrom = scheduleMonthEl.dataset.time.split('-')[0];
  scheduleMonth.timeTo = scheduleMonthEl.dataset.time.split('-')[1];
  scheduleMonth.location = scheduleMonthEl.dataset.location;

  html = `<form action="" id="edit-schedule-form" style="${top}; left: ${left}px">
              <input
                type="text"
                class="form-control"
                id="schedule-title-input--edit"
                placeholder="Enter schedule title"
                value="${scheduleData[scheduleMonthEl.id].title}"
                required
              />
              <div class="schedule-input-box">
                <label for="schedule-date-picker">
                  <i class="fa-light fa-calendar"></i>
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="schedule-date-picker--edit"
                  placeholder="YYYY-MM-DD"
                  value="${scheduleData[scheduleMonthEl.id].date}"
                  required
                />
              </div>
              <div class="schedule-input-box">
                <label for="schedule-time-input"
                  ><i class="fa-light fa-clock"></i
                ></label>
                <input
                  type="time"
                  class="form-control"
                  id="schedule-time-input--from--edit"
                  value="${scheduleData[scheduleMonthEl.id].from}"
                  required
                />
                <span style="margin: 0 8px">-</span>
                <input
                  type="time"
                  class="form-control"
                  id="schedule-time-input--to--edit"
                  value="${scheduleData[scheduleMonthEl.id].to}"
                  required
                />
              </div>
              <div class="schedule-input-box">
                <label for="schedule-location-input">
                  <i class="fa-light fa-location-dot"></i>
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="schedule-location-input--edit"
                  placeholder="Enter schedule location"
                  value="${scheduleData[scheduleMonthEl.id].location}"
                />
              </div>
              <div class="category-selection-box">
                <div class="category-option personal ${
                  scheduleData[scheduleMonthEl.id].category == 'personal'
                    ? 'selected'
                    : ''
                }">personal</div>
                <div class="category-option work ${
                  scheduleData[scheduleMonthEl.id].category == 'work'
                    ? 'selected'
                    : ''
                }">work</div>
                <div class="category-option health ${
                  scheduleData[scheduleMonthEl.id].category == 'health'
                    ? 'selected'
                    : ''
                }">health</div>
                <div class="category-option event ${
                  scheduleData[scheduleMonthEl.id].category == 'event'
                    ? 'selected'
                    : ''
                }">event</div>
              </div>
              <div style="display: flex">
                <button type="submit" class="save-schedule-btn">save</button>
                <div class="delete-schedule-btn">delete</div>
              </div>
            </form>`;

  if (scheduleEditFormEl) {
    document.querySelector('body').removeChild(scheduleEditFormEl);
  }
  document.body.insertAdjacentHTML('beforeend', html);

  flatpickr('#schedule-date-picker--edit', {
    dateFormat: 'Y-m-d',
  });

  scheduleEditFormEl = document.querySelector('#edit-schedule-form');

  const scheduleTitleInput = document.querySelector(
    '#schedule-title-input--edit'
  );
  const scheduleDateInput = document.querySelector(
    '#schedule-date-picker--edit'
  );
  const scheduleTimeFromInput = document.querySelector(
    '#schedule-time-input--from--edit'
  );
  const scheduleTimeToInput = document.querySelector(
    '#schedule-time-input--to--edit'
  );
  const scheduleLocationInput = document.querySelector(
    '#schedule-location-input--edit'
  );
  const categoryOptions = [...scheduleEditFormEl.children[4].children];
  handleSelectCategory(categoryOptions);

  // HANDLE EDIT SCHEDULE
  scheduleEditFormEl.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!scheduleDateInput.value) {
      sendToastMessage('warning', "Schedule's date is not selected");
      return;
    }

    if (scheduleTimeFromInput.value >= scheduleTimeToInput.value) {
      sendToastMessage('warning', "Schedule's time is not valid");
      return;
    }

    const schedule = {
      id: +scheduleMonthEl.id,
      title: scheduleTitleInput.value,
      date: scheduleDateInput.value,
      from: scheduleTimeFromInput.value,
      to: scheduleTimeToInput.value,
      location: scheduleLocationInput.value,
      category: categoryOptions.filter((category) =>
        category.classList.contains('selected')
      )[0].textContent,
    };

    scheduleData[scheduleMonthEl.id] = schedule;

    localStorage.setItem('schedule', JSON.stringify(scheduleData));
    sendToastMessage('success', 'Schedule was updated successfully!');
    setTimeout(() => {
      location.reload();
    }, 2000);
  });

  const deleteScheduleBtn = document.querySelector('.delete-schedule-btn');
  deleteScheduleBtn.addEventListener('click', () => {
    sendToastMessage('', 'Are you sure to delete this schedule?', true);

    const confirmDelete = document.querySelector('.confirm-delete-btn');
    confirmDelete.addEventListener('click', () => {
      scheduleData[scheduleMonthEl.id] = [];
      scheduleData = scheduleData.flat();

      localStorage.setItem('schedule', JSON.stringify(scheduleData));
      sendToastMessage('success', 'Schedule was deleted successfully!');
      setTimeout(() => {
        location.reload();
      }, 2000);
    });
  });
});

const isValid = (schedule) => {
  // Check if id is an integer
  if (!Number.isInteger(schedule.id)) return false;

  // Check if title is not an empty string
  if (typeof schedule.title !== 'string' || schedule.title.trim() === '')
    return false;

  // Check if date is valid
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(schedule.date) || isNaN(Date.parse(schedule.date)))
    return false;

  // Check if from and to are valid times and from is less than to
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(schedule.from) || !timeRegex.test(schedule.to))
    return false;
  if (schedule.from >= schedule.to) return false;

  // Check if category is one of the valid options
  const validCategories = ['personal', 'work', 'health', 'event'];
  if (!validCategories.includes(schedule.category.toLowerCase())) return false;

  // If all checks pass, return true
  return true;
};

// Toggle the options menu
function toggleOptionsMenu() {
  document.getElementById('options-content').classList.toggle('show');
}

// Export schedules to Excel
function exportSchedules() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(scheduleData);
  XLSX.utils.book_append_sheet(wb, ws, 'Schedules');
  XLSX.writeFile(wb, 'schedules.xlsx');
  sendToastMessage('success', 'Schedules exported successfully!');
}

// Import schedules from Excel
function importSchedules(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Validate and merge imported data
    if (!jsonData.every((item) => isValid(item))) {
      sendToastMessage('danger', 'Imported data is not valid');
      return;
    }

    let diff = 0;
    jsonData.forEach((item) => {
      if (!scheduleData.find((schedule) => schedule.id === item.id)) {
        // Add new schedules
        scheduleData.push(item);
        diff++;
      } else {
        // Update existed schedules to match with the Excel file
        let oldSchedule = scheduleData.find(
          (schedule) => schedule.id === item.id
        );
        oldSchedule.title = item.title;
        oldSchedule.date = item.date;
        oldSchedule.from = item.from;
        oldSchedule.to = item.to;
        oldSchedule.location = item.location;
        oldSchedule.category = item.category;
      }
    });

    localStorage.setItem('schedule', JSON.stringify(scheduleData));
    sendToastMessage('success', `Imported ${diff} schedules successfully!`);
    setTimeout(() => {
      location.reload();
    }, 2000);
  };
  reader.readAsArrayBuffer(file);
  toggleOptionsMenu(); // Close the menu after importing
}

const optionsBtn = document.getElementById('options-btn');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importInput = document.getElementById('import-input');

optionsBtn.addEventListener('click', toggleOptionsMenu);
exportBtn.addEventListener('click', exportSchedules);

importBtn.addEventListener('click', function () {
  importInput.click();
});

importInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    importSchedules(file);
  }
});
