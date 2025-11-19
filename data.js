/**********************************************
 * STUDENT DATA
 * - Eva: flat $27 per week (40 min)
 * - Gabriel: two separate entries (Calc & History)
 * - Timothy: $60/hr
 **********************************************/

let students = JSON.parse(localStorage.getItem("students")) || [
  { id: 1, name: "Diana", grade: "4th", rate: 40, flat: false },
  { id: 2, name: "Lucas", grade: "6th", rate: 45, flat: false },
  { id: 3, name: "Eva", grade: "4th", rate: 27, flat: true },          // ALWAYS $27 per week
  { id: 4, name: "Milana", grade: "4th", rate: 45, flat: false },
  { id: 5, name: "Leo", grade: "1st", rate: 30, flat: false },
  { id: 6, name: "Stephanie", grade: "4th", rate: 35, flat: false },
  { id: 7, name: "Gabriel (Calc)", grade: "College", rate: 60, flat: false },
  { id: 8, name: "Gabriel (History)", grade: "College", rate: 85, flat: false },
  { id: 9, name: "Maksim", grade: "7th", rate: 65, flat: false },
  { id: 10, name: "Savion", grade: "College", rate: 60, flat: false },
  { id: 11, name: "Eric", grade: "College", rate: 75, flat: false },
  { id: 12, name: "Timothy", grade: "4th", rate: 60, flat: false }     // 60/hr
];

/**********************************************
 * WEEKLY SCHEDULE
 * - Each entry = one recurring session
 * - duration: hours per session
 * - Eva: 40 min → 0.67 hours (for hours chart),
 *   but money stays flat because flat:true
 **********************************************/

let schedule = JSON.parse(localStorage.getItem("schedule")) || [
  // Monday
  { id: 1, day: "Monday", student: "Diana", time: "6:30–7:30 pm", duration: 1 },

  // Tuesday
  { id: 2, day: "Tuesday", student: "Eva", time: "4:20–5:00 pm", duration: 0.67 },
  { id: 3, day: "Tuesday", student: "Lucas", time: "5:00–6:00 pm", duration: 1 },
  { id: 4, day: "Tuesday", student: "Timothy", time: "7:00–8:00 pm", duration: 1 },

  // Thursday
  { id: 5, day: "Thursday", student: "Leo", time: "3:00–4:00 pm", duration: 1 },
  { id: 6, day: "Thursday", student: "Lucas", time: "5:00–6:00 pm", duration: 1 },
  { id: 7, day: "Thursday", student: "Stephanie", time: "6:00–7:00 pm", duration: 1 },

  // Friday
  { id: 8, day: "Friday", student: "Savion", time: "time TBD", duration: 1 },
  { id: 9, day: "Friday", student: "Gabriel (Calc)", time: "1:00–2:00 pm", duration: 1 },
  { id: 10, day: "Friday", student: "Leo", time: "3:00–4:00 pm", duration: 1 },
  { id: 11, day: "Friday", student: "Diana", time: "4:00–5:00 pm", duration: 1 },
  { id: 12, day: "Friday", student: "Maksim", time: "5:00–6:00 pm", duration: 1 },

  // Saturday
  { id: 13, day: "Saturday", student: "Milana", time: "11:00 am–12:00 pm", duration: 1 },

  // Sunday
  { id: 14, day: "Sunday", student: "Maksim", time: "10:00–11:00 am", duration: 1 },
  { id: 15, day: "Sunday", student: "Eric", time: "11:00 am–12:00 pm", duration: 1 },
  { id: 16, day: "Sunday", student: "Gabriel (History)", time: "12:00–1:00 pm", duration: 1 }
];

/**********************************************
 * PAYMENTS (ONE ROW PER STUDENT, NOT PER SESSION)
 **********************************************/

let payments = JSON.parse(localStorage.getItem("payments")) || [];

/**********************************************
 * EARNINGS HISTORY (completed weeks only)
 * - week: stored historical weeks so far? (not used)
 * - month: finished weeks this month
 * - year:  finished weeks this year
 **********************************************/

let earningsHistory = JSON.parse(localStorage.getItem("earningsHistory")) || {
  month: 0,
  year: 0
};

/**********************************************
 * META INFO (for week/month/year rollover)
 **********************************************/

let meta = JSON.parse(localStorage.getItem("meta")) || {
  weekKey: null,
  month: null,
  year: null
};

/**********************************************
 * SAVE ALL DATA
 **********************************************/

function saveAllData() {
  localStorage.setItem("students", JSON.stringify(students));
  localStorage.setItem("schedule", JSON.stringify(schedule));
  localStorage.setItem("payments", JSON.stringify(payments));
  localStorage.setItem("earningsHistory", JSON.stringify(earningsHistory));
  localStorage.setItem("meta", JSON.stringify(meta));
}

/**********************************************
 * HELPER: expected money per student per week
 **********************************************/

function getExpectedForStudent(name) {
  let total = 0;

  schedule.forEach(s => {
    if (s.student !== name) return;

    const stu = students.find(st => st.name === name);
    if (!stu) return;

    if (stu.flat) {
      // flat per week regardless of duration
      total += stu.rate;
    } else {
      total += stu.rate * (s.duration || 1);
    }
  });

  return total;
}

