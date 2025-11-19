/**********************************************
 * STUDENT DATA (Editable in dashboard)
 **********************************************/

let students = JSON.parse(localStorage.getItem("students")) || [
  { id: 1, name: "Diana", grade: "4th", rate: 40 },
  { id: 2, name: "Lucas", grade: "5th", rate: 45 },
  { id: 3, name: "Eva", grade: "4th", rate: 27 },
  { id: 4, name: "Milana", grade: "5th", rate: 45 },
  { id: 5, name: "Leo", grade: "2nd", rate: 30 },
  { id: 6, name: "Stephanie", grade: "4th", rate: 35 },
  { id: 7, name: "Gabriel (Calc)", grade: "College", rate: 60 },
  { id: 8, name: "Gabriel (History)", grade: "College", rate: 85 },
  { id: 9, name: "Maksim", grade: "7th", rate: 65 },
  { id: 10, name: "Savion", grade: "College", rate: 60 },
  { id: 11, name: "Eric", grade: "College", rate: 75 },
  { id: 12, name: "Timothy", grade: "4th", rate: 35 } // Placeholder if needed
];

/**********************************************
 * WEEKLY SCHEDULE (Editable)
 **********************************************/

let schedule = JSON.parse(localStorage.getItem("schedule")) || [

  // ----- Monday -----
  { id: 1, day: "Monday", student: "Diana", time: "6:30-7:30 PM", duration: 1 },

  // ----- Tuesday -----
  { id: 2, day: "Tuesday", student: "Eva", time: "4:20-5:00 PM", duration: 0.666 },
  { id: 3, day: "Tuesday", student: "Lucas", time: "5:00-6:00 PM", duration: 1 },
  { id: 4, day: "Tuesday", student: "Timothy", time: "7:00-8:00 PM", duration: 1 },

  // ----- Thursday -----
  { id: 5, day: "Thursday", student: "Leo", time: "3:00-4:00 PM", duration: 1 },
  { id: 6, day: "Thursday", student: "Lucas", time: "5:00-6:00 PM", duration: 1 },
  { id: 7, day: "Thursday", student: "Stephanie", time: "6:00-7:00 PM", duration: 1 },

  // ----- Friday -----
  { id: 8, day: "Friday", student: "Savion", time: "12:00-1:00 PM", duration: 1 },
  { id: 9, day: "Friday", student: "Gabriel (Calc)", time: "1:00-2:00 PM", duration: 1 },
  { id: 10, day: "Friday", student: "Leo", time: "3:00-4:00 PM", duration: 1 },
  { id: 11, day: "Friday", student: "Diana", time: "4:00-5:00 PM", duration: 1 },
  { id: 12, day: "Friday", student: "Maksim", time: "5:00-6:00 PM", duration: 1 },

  // ----- Saturday -----
  { id: 13, day: "Saturday", student: "Milana", time: "11:00 AM - 12:00 PM", duration: 1 },

  // ----- Sunday -----
  { id: 14, day: "Sunday", student: "Maksim", time: "10:00-11:00 AM", duration: 1 },
  { id: 15, day: "Sunday", student: "Eric", time: "11:00 AM - 12:00 PM", duration: 1 },
  { id: 16, day: "Sunday", student: "Gabriel (History)", time: "12:00-1:00 PM", duration: 1 }
];

/**********************************************
 * PAYMENT DATA (Stored per week)
 **********************************************/

let payments = JSON.parse(localStorage.getItem("payments")) || [];

/**********************************************
 * EARNINGS HISTORY (For month/year charts)
 **********************************************/

let earningsHistory = JSON.parse(localStorage.getItem("earningsHistory")) || {
  week: 0,
  month: 0,
  year: 0
};

/**********************************************
 * SAVE ALL DATA (Called by app.js)
 **********************************************/

function saveAllData() {
  localStorage.setItem("students", JSON.stringify(students));
  localStorage.setItem("schedule", JSON.stringify(schedule));
  localStorage.setItem("payments", JSON.stringify(payments));
  localStorage.setItem("earningsHistory", JSON.stringify(earningsHistory));
}
