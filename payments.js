/**************************************************
 * PAYMENT + EARNINGS ENGINE
 **************************************************/

// Monday = start of the week
function getStartOfWeek() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon
  const diff = now.getDate() - day + 1;
  return new Date(now.setDate(diff));
}

let startOfWeek = getStartOfWeek();

/**************************************************
 * CALCULATE WEEKLY, MONTHLY & YEARLY EARNINGS
 **************************************************/
function calculateEarnings() {
  let weekly = 0;
  let monthly = 0;
  let yearly = 0;

  payments.forEach(p => {
    const amount = (p.paid || 0) + (p.prepaid || 0);

    weekly += amount;
    monthly += amount;
    yearly += amount;
  });

  earningsHistory.week = weekly;
  earningsHistory.month = monthly;
  earningsHistory.year = yearly;

  saveAllData();
  renderEarningsPage();
}

/**************************************************
 * RESET WEEKLY EARNINGS IF NEW WEEK STARTED
 **************************************************/
function resetWeeklyIfNeeded() {
  const savedWeek = localStorage.getItem("startOfWeek");

  if (savedWeek !== startOfWeek.toDateString()) {
    localStorage.setItem("startOfWeek", startOfWeek.toDateString());

    // Reset weekly expected + collected
    payments = [];
    saveAllData();
  }
}

function renderEarningsPage() {
  document.getElementById("earnWeek").textContent = "$" + earningsHistory.week.toFixed(2);
  document.getElementById("earnMonth").textContent = "$" + earningsHistory.month.toFixed(2);
  document.getElementById("earnYear").textContent = "$" + earningsHistory.year.toFixed(2);

  drawEarningsChart();
}

resetWeeklyIfNeeded();
calculateEarnings();
