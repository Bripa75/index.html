/**************************************************
 * PAGE SWITCHING (Sidebar Navigation)
 **************************************************/
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelector(`#${pageId}`).classList.add("active");

  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  document.querySelector(`.sidebar li[onclick="showPage('${pageId}')"]`).classList.add("active");

  // refresh charts when switching to relevant pages
  if (pageId === "overview") {
    drawStudentsChart();
    drawHoursChart();
  }
  if (pageId === "earnings") {
    drawEarningsChart();
  }
}

/**************************************************
 * RENDER ALL TABLES ON PAGE LOAD
 **************************************************/
document.addEventListener("DOMContentLoaded", () => {
  renderStudents();
  renderSchedule();
  renderPaymentsTable();
  updateOverviewStats();
  updateEarningsPage();
});

/**************************************************
 * ========== STUDENTS ==========
 **************************************************/
function renderStudents() {
  const tbody = document.querySelector("#studentsTable tbody");
  tbody.innerHTML = "";

  students.forEach(student => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><input class="table-input" value="${student.name}"
           onchange="updateStudent(${student.id}, 'name', this.value)" /></td>

      <td><input class="table-input" value="${student.grade}"
           onchange="updateStudent(${student.id}, 'grade', this.value)" /></td>

      <td><input class="table-input" type="number" value="${student.rate}"
           onchange="updateStudent(${student.id}, 'rate', parseFloat(this.value) || 0)" /></td>

      <td>
        <button class="action-btn delete" onclick="deleteStudent(${student.id})">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  document.getElementById("totalStudents").textContent = students.length;
}

function updateStudent(id, field, value) {
  const student = students.find(s => s.id === id);
  if (!student) return;
  student[field] = value;
  saveAllData();
  renderPaymentsTable();
  updateOverviewStats();
  updateEarningsPage();
}

function addStudentRow() {
  const newId = Date.now();

  students.push({
    id: newId,
    name: "New Student",
    grade: "",
    rate: 0,
    flat: false
  });

  saveAllData();
  renderStudents();
  renderPaymentsTable();
}

function deleteStudent(id) {
  const removed = students.find(s => s.id === id);
  students = students.filter(s => s.id !== id);

  // Also remove from payments
  if (removed) {
    payments = payments.filter(p => p.student !== removed.name);
  }

  saveAllData();
  renderStudents();
  renderPaymentsTable();
  updateOverviewStats();
  updateEarningsPage();
}

/**************************************************
 * ========== SCHEDULE ==========
 **************************************************/
function renderSchedule() {
  const tbody = document.querySelector("#scheduleTable tbody");
  tbody.innerHTML = "";

  schedule.forEach(session => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><input class="table-input" value="${session.day}"
           onchange="updateSession(${session.id}, 'day', this.value)" /></td>

      <td><input class="table-input" value="${session.student}"
           onchange="updateSession(${session.id}, 'student', this.value)" /></td>

      <td><input class="table-input" value="${session.time}"
           onchange="updateSession(${session.id}, 'time', this.value)" /></td>

      <td><input class="table-input" type="number" step="0.1" value="${session.duration}"
           onchange="updateSession(${session.id}, 'duration', parseFloat(this.value) || 0)" /></td>

      <td>
        <button class="action-btn delete" onclick="deleteSession(${session.id})">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  renderPaymentsTable();
  updateOverviewStats();
  updateEarningsPage();
}

function updateSession(id, field, value) {
  const session = schedule.find(s => s.id === id);
  if (!session) return;
  session[field] = value;
  saveAllData();
  renderSchedule();
}

function addScheduleRow() {
  const newId = Date.now();

  schedule.push({
    id: newId,
    day: "Day",
    student: "Student",
    time: "Time",
    duration: 1
  });

  saveAllData();
  renderSchedule();
}

function deleteSession(id) {
  schedule = schedule.filter(s => s.id !== id);
  saveAllData();
  renderSchedule();
}

/**************************************************
 * ========== PAYMENTS (ONE ROW PER STUDENT) ==========
 **************************************************/
function renderPaymentsTable() {
  const tbody = document.querySelector("#paymentsTable tbody");
  tbody.innerHTML = "";

  students.forEach(student => {
    const expected = getExpectedForStudent(student.name);

    // Locate or create a payment row for this student
    let payRecord = payments.find(p => p.student === student.name);
    if (!payRecord) {
      payRecord = {
        student: student.name,
        expected: expected,
        paid: 0,
        prepaid: 0,
        status: "Not Paid",
        notes: ""
      };
      payments.push(payRecord);
    } else {
      payRecord.expected = expected; // keep updated from schedule
    }

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${student.name}</td>
      <td>$${expected.toFixed(2)}</td>

      <td><input class="table-input" type="number" value="${payRecord.paid}"
          onchange="updatePayment('${student.name}', 'paid', parseFloat(this.value) || 0)" /></td>

      <td><input class="table-input" type="number" value="${payRecord.prepaid}"
          onchange="updatePayment('${student.name}', 'prepaid', parseFloat(this.value) || 0)" /></td>

      <td>
        <select class="table-input" onchange="updatePayment('${student.name}', 'status', this.value)">
          <option value="Paid" ${payRecord.status === "Paid" ? "selected" : ""}>Paid</option>
          <option value="Partial" ${payRecord.status === "Partial" ? "selected" : ""}>Partial</option>
          <option value="Not Paid" ${payRecord.status === "Not Paid" ? "selected" : ""}>Not Paid</option>
        </select>
      </td>

      <td><input class="table-input" value="${payRecord.notes}"
          onchange="updatePayment('${student.name}', 'notes', this.value)" /></td>

      <td>
        <button class="action-btn delete" onclick="clearPayment('${student.name}')">Clear</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  saveAllData();
  updateOverviewStats();
  updateEarningsPage();
}

function updatePayment(studentName, field, value) {
  const payRecord = payments.find(p => p.student === studentName);
  if (!payRecord) return;

  payRecord[field] = value;
  saveAllData();
  updateOverviewStats();
  updateEarningsPage();
}

function clearPayment(studentName) {
  const payRecord = payments.find(p => p.student === studentName);
  if (!payRecord) return;

  payRecord.paid = 0;
  payRecord.prepaid = 0;
  payRecord.status = "Not Paid";
  payRecord.notes = "";
  saveAllData();
  renderPaymentsTable();
}

/**************************************************
 * ========== OVERVIEW STATS ==========
 **************************************************/
function updateOverviewStats() {
  let totalExpected = 0;
  let collected = 0;

  payments.forEach(p => {
    totalExpected += p.expected || 0;
    collected += (p.paid || 0) + (p.prepaid || 0);
  });

  const outstanding = totalExpected - collected;

  document.getElementById("weekExpected").textContent = "$" + totalExpected.toFixed(2);
  document.getElementById("weekCollected").textContent = "$" + collected.toFixed(2);
  document.getElementById("weekOutstanding").textContent = "$" + outstanding.toFixed(2);
}

/**************************************************
 * ========== EARNINGS PAGE ==========
 * weekly = current week's paid+prepaid
 * month  = history.month + current week
 * year   = history.year + current week
 **************************************************/
function updateEarningsPage() {
  let currentWeek = 0;
  payments.forEach(p => {
    currentWeek += (p.paid || 0) + (p.prepaid || 0);
  });

  const monthTotal = earningsHistory.month + currentWeek;
  const yearTotal  = earningsHistory.year + currentWeek;

  document.getElementById("earnWeek").textContent  = "$" + currentWeek.toFixed(2);
  document.getElementById("earnMonth").textContent = "$" + monthTotal.toFixed(2);
  document.getElementById("earnYear").textContent  = "$" + yearTotal.toFixed(2);
}
