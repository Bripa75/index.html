/**************************************************
 * CHARTS
 **************************************************/

let studentsPieChart;
let hoursBarChart;
let earningsBarChart;

/**************************************************
 * STUDENTS PIE CHART
 **************************************************/
function drawStudentsChart() {
  const canvas = document.getElementById("studentsChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const gradeCount = {};
  students.forEach(s => {
    if (!gradeCount[s.grade]) gradeCount[s.grade] = 0;
    gradeCount[s.grade]++;
  });

  if (studentsPieChart) studentsPieChart.destroy();

  studentsPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(gradeCount),
      datasets: [
        {
          data: Object.values(gradeCount),
          backgroundColor: ["#60a5fa", "#818cf8", "#34d399", "#f97316", "#f43f5e"]
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: "white" }
        }
      }
    }
  });
}

/**************************************************
 * HOURS PER DAY BAR CHART
 **************************************************/
function drawHoursChart() {
  const canvas = document.getElementById("hoursChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const hoursByDay = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0
  };

  schedule.forEach(s => {
    if (hoursByDay[s.day] !== undefined) {
      hoursByDay[s.day] += parseFloat(s.duration) || 0;
    }
  });

  if (hoursBarChart) hoursBarChart.destroy();

  hoursBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(hoursByDay),
      datasets: [
        {
          label: "Hours",
          data: Object.values(hoursByDay),
          backgroundColor: "#3b82f6"
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: "white" }
        }
      },
      scales: {
        x: {
          ticks: { color: "white" }
        },
        y: {
          ticks: { color: "white" }
        }
      }
    }
  });
}

/**************************************************
 * EARNINGS BAR CHART (Week / Month / Year)
 **************************************************/
function drawEarningsChart() {
  const canvas = document.getElementById("earningsChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let currentWeek = 0;
  payments.forEach(p => {
    currentWeek += (p.paid || 0) + (p.prepaid || 0);
  });

  const monthTotal = earningsHistory.month + currentWeek;
  const yearTotal  = earningsHistory.year + currentWeek;

  if (earningsBarChart) earningsBarChart.destroy();

  earningsBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Week", "Month", "Year"],
      datasets: [
        {
          label: "Earnings",
          data: [currentWeek, monthTotal, yearTotal],
          backgroundColor: ["#22c55e", "#38bdf8", "#a855f7"]
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: "white" }
        }
      },
      scales: {
        x: {
          ticks: { color: "white" }
        },
        y: {
          ticks: { color: "white" }
        }
      }
    }
  });
}

// Initial draw after everything loads
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    drawStudentsChart();
    drawHoursChart();
    drawEarningsChart();
  }, 400);
});

