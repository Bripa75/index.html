/**************************************************
 * PAGE SWITCHING (Sidebar Navigation)
 **************************************************/
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelector(`#${pageId}`).classList.add("active");

  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  document.querySelector(`.sidebar li[onclick="showPage('${pageId}')"]`).classList.add("active");
}

/**************************************************
 * RENDER ALL TABLES ON PAGE LOAD
 **************************************************/
document.addEventListener("DOMContentLoaded", () => {
  renderStudents();
  renderSchedule();
  renderPaymentsTable();
  updateOverviewStats();
});

/**************************************************
 * ========== STUDENT TABLE ==========
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

      <td><input class="table-input" value="${student.rate}"
           onchange="updateStudent(${student.id}, 'rate', parseFloat(this.value))" /></td>

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
  student[field] = value;
  saveAllData();
}

function addStudentRow() {
  const newId = Date.now();

  students.push({
    id: newId,
    name: "New Student",
    grade: "",
    rate: 0
  });

  saveAllData();
  renderStudents();
}

function deleteStudent(id) {
  students = students.filter(s => s.id !== id);
  saveAllData();
  renderStudents();
}


/**************************************************
 * ========== SCHEDULE TABLE ==========
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
           onchange="updateSession(${session.id}, 'duration', parseFloat(this.value))" /></td>

      <td>
        <button class="action-btn delete" onclick="deleteSession(${session.id})">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function updateSession(id, field, value) {
  const session = schedule.find(s => s.id === id);
  session[field] = value;
  saveAllData();
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
 * ========== PAYMENTS TABLE ==========
 **************************************************/
function renderPaymentsTable() {
  const tbody = document.querySelector("#paymentsTable tbody");
  tbody.innerHTML = "";

  schedule.forEach(session => {
    const student = students.find(s => s.name === session.student);
    if (!student) return;

    const expected = student.rate * session.duration;

    // Find payment entry
    let payRecord = payments.find(p => p.sessionId === session.id);
    if (!payRecord) {
      payRecord = {
        sessionId: session.id,
        student: session.student,
        expected: expected,
        paid: 0,
        prepaid: 0,
        status: "not paid",
        notes: ""
      };
      payments.push(payRecord);
    }

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${session.student}</td>

      <td>$${expected.toFixed(2)}</td>

      <td><input class="table-input" type="number" value="${payRecord.paid}"
          onchange="updatePayment(${session.id}, 'paid', parseFloat(this.value))" /></td>

      <td><input class="table-input" type="number" value="${payRecord.prepaid}"
          onchange="updatePayment(${session.id}, 'prepaid', parseFloat(this.value))" /></td>

      <td>
        <select class="table-input" onchange="updatePayment(${session.id}, 'status', this.value)">
          <option value="paid" ${payRecord.status === "paid" ? "selected" : ""}>Paid</option>
          <option value="partial" ${payRecord.status === "partial" ? "selected" : ""}>Partial</option>
          <option value="not paid" ${payRecord.status === "not paid" ? "selected" : ""}>Not Paid</option>
        </select>
      </td>

      <td><input class="table-input" value="${payRecord.notes}"
          onchange="updatePayment(${session.id}, 'notes', this.value)" /></td>

      <td>
        <button class="action-btn delete" onclick="clearPayment(${session.id})">Clear</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  saveAllData();
  updateOverviewStats();
  updateEarningsPage();
}

function updatePayment(sessionId, field, value) {
  const payRecord = payments.find(p => p.sessionId === sessionId);
  payRecord[field] = value;
  saveAllData();
  updateOverviewStats();
  updateEarningsPage();
  renderPaymentsTable();
}

function clearPayment(sessionId) {
  payments = payments.filter(p => p.sessionId !== sessionId);
  saveAllData();
  renderPaymentsTable();
}


/**************************************************
 * ========== OVERVIEW STATS ==========
 **************************************************/
function updateOverviewStats() {
  let expected = 0;
  let collected = 0;

  payments.forEach(p => {
    expected += p.expected;
    collected += p.paid + p.prepaid;
  });

  document.getElementById("weekExpected").textContent = "$" + expected.toFixed(2);
  document.getElementById("weekCollected").textContent = "$" + collected.toFixed(2);
  document.getElementById("weekOutstanding").textContent = "$" + (expected - collected).toFixed(2);
}


/**************************************************
 * Force refresh earnings
 **************************************************/
function updateEarningsPage() {
  let week = 0;
  let month = 0;
  let year = 0;

  payments.forEach(p => {
    week += p.paid + p.prepaid;
    month += p.paid + p.prepaid;
    year += p.paid + p.prepaid;
  });

  document.getElementById("earnWeek").textContent = "$" + week.toFixed(2);
  document.getElementById("earnMonth").textContent = "$" + month.toFixed(2);
  document.getElementById("earnYear").textContent = "$" + year.toFixed(2);

  earningsHistory.week = week;
  earningsHistory.month = month;
  earningsHistory.year = year;

  saveAllData();
}
