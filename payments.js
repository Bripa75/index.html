/**************************************************
 * PAYMENT + EARNINGS ENGINE
 * - Weekly resets
 * - Month & year accumulate
 * - Prepaid DOES count as revenue now
 **************************************************/

function getStartOfWeek() {
  const now = new Date();
  const day = now.getDay();   // 0=Sun, 1=Mon
  const diff = now.getDate() - day + 1; // Monday as start
  now.setHours(0, 0, 0, 0);
  return new Date(now.setDate(diff));
}

function rolloverWeekIfNeeded() {
  const now = new Date();
  const weekKeyCurrent = getStartOfWeek().toDateString();
  const monthCurrent = now.getMonth();
  const yearCurrent  = now.getFullYear();

  // first ever load → just set baseline
  if (!meta.weekKey) {
    meta.weekKey = weekKeyCurrent;
    meta.month   = monthCurrent;
    meta.year    = yearCurrent;
    saveAllData();
    return;
  }

  // calendar month changed → reset month counter
  if (meta.year !== yearCurrent) {
    earningsHistory.year = 0;
    earningsHistory.month = 0;
  } else if (meta.month !== monthCurrent) {
    earningsHistory.month = 0;
  }

  // new week? → move last week's collected into history, then clear paid fields
  if (meta.weekKey !== weekKeyCurrent) {
    let lastWeekTotal = 0;
    payments.forEach(p => {
      lastWeekTotal += (p.paid || 0) + (p.prepaid || 0);
      // reset weekly payment fields
      p.paid = 0;
      p.prepaid = 0;
      p.status = "Not Paid";
      p.notes = "";
    });

    // add finished week to month/year totals
    earningsHistory.month += lastWeekTotal;
    earningsHistory.year  += lastWeekTotal;

    meta.weekKey = weekKeyCurrent;
    meta.month   = monthCurrent;
    meta.year    = yearCurrent;

    saveAllData();
  }
}

// run automatically when page loads
document.addEventListener("DOMContentLoaded", () => {
  rolloverWeekIfNeeded();
});
