/**************************************************
 * CHARTS FOR OVERVIEW + EARNINGS
 **************************************************/

let studentsPieChart;
let hoursBarChart;
let earningsLineChart;

/**************************************************
 * STUDENTS PIE CHART
 **************************************************/
function drawStudentsChart() {
  const ctx = document.getElementById("studentsChart").getContext("2d");

  const gradeCount = {};

  students.forEach(s => {
    if (!gradeCount[s.grade]) gradeCount[s.grade] = 0;
    gradeCount[s.grade]++;
  });

  if (studentsPieChart) studentsPieChart.destroy();

  studentsPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(gradeCount),
      datasets: [{
        data: Object.values(gradeCount),
        backgroundColor: ["#60a5fa", "#818cf8", "#34d399", "#f87171", "#fbbf24"]
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: "white" } }
      }
    }
  });
}

/**************************************************
 * HOURS PER DAY CHART
 **************************************************/
function drawHoursChart() {
  const ctx = document.getElementById("hoursChart").getContext("2d");

  const hoursByDay = {
    Monday: 0, Tuesday: 0, Wednesday: 0,
    Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0
  };

  schedule.forEach(s => {
    hoursByDay[s.day] += parseFloat(s.duration);
  });

  if (hoursBarChart) hoursBarChart.destroy();

  hoursBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(hoursByDay),
      datasets: [{
        label: "Hours",
        data: Object.values(hoursByDay),
        backgroundColor: "#3b82f6"
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: "white" } }
      },
      scales: {
        x: { ticks: { color: "white" } },
        y: { ticks: { color: "white" } }
      }
    }
  });
}

/**************************************************
 * EARNINGS LINE CHART
 **************************************************/
function drawEarningsChart() {
  const ctx = document.getElementById("earningsChart").getContext("2d");

  if (earningsLineChart) earningsLineChart.destroy();

  earningsLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["Week", "Month", "Year"],
      datasets: [{
        label: "Earnings",
        data: [
          earningsHistory.week,
          earningsHistory.month,
          earningsHistory.year
        ],
        borderColor: "#34d399",
        tension: 0.3
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: "white" } }
      },
      scales: {
        x: { ticks: { color: "white" } },
        y: { ticks: { color: "white" } }
      }
    }
  });
}

/**************************************************
 * RUN ALL CHARTS
 **************************************************/
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    drawStudentsChart();
    drawHoursChart();
    drawEarningsChart();
  }, 400);
});
