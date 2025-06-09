document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dailyPlanForm");
  const todayGoalsList = document.getElementById("todayGoals");
  const completeDayBtn = document.getElementById("completeDayBtn");
  const weeklyLog = document.getElementById("weeklyLog");
  const calendarInput = document.getElementById("calendarInput");

  let goalsData = JSON.parse(localStorage.getItem("dailyGoals") || "{}");
  let persistentGoals = JSON.parse(localStorage.getItem("persistentGoals") || "[]");

  function getKey(date) {
    return date.toISOString().split("T")[0];
  }

  let currentDate = new Date();
  calendarInput.value = getKey(currentDate);
  loadGoalsForDate(currentDate);

  calendarInput.addEventListener("change", () => {
    currentDate = new Date(calendarInput.value);
    loadGoalsForDate(currentDate);
    renderWeeklyLog(); // Ensure weekly log is updated on date change
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input");
    const goalText = input.value.trim();
    if (!goalText) return;

    const dateKey = getKey(currentDate);
    const goal = { text: goalText, completed: false };
    if (!goalsData[dateKey]) goalsData[dateKey] = [];
    goalsData[dateKey].push(goal);
    localStorage.setItem("dailyGoals", JSON.stringify(goalsData));

    addGoalItem(goalText, false);
    input.value = "";
    renderWeeklyLog();
  });

  function addGoalItem(text, completed, dateSpecific = true) {
    const li = document.createElement("li");
    li.className = "checklist-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", () => {
      if (dateSpecific) {
        updateGoalCompletion(text, checkbox.checked);
      } else {
        persistentGoals = persistentGoals.map(goal =>
          goal.text === text ? { ...goal, completed: checkbox.checked } : goal
        );
        localStorage.setItem("persistentGoals", JSON.stringify(persistentGoals));
      }
      renderWeeklyLog();
    });

    const label = document.createElement("span");
    label.textContent = text;

    li.appendChild(checkbox);
    li.appendChild(label);
    todayGoalsList.appendChild(li);
  }

  function updateGoalCompletion(text, isChecked) {
    const dateKey = getKey(currentDate);
    if (!goalsData[dateKey]) return;
    goalsData[dateKey] = goalsData[dateKey].map(goal =>
      goal.text === text ? { ...goal, completed: isChecked } : goal
    );
    localStorage.setItem("dailyGoals", JSON.stringify(goalsData));
  }

  completeDayBtn.addEventListener("click", () => {
    alert("Day marked as complete. Your progress has been saved.");
    renderWeeklyLog();
  });

  function loadGoalsForDate(date) {
    todayGoalsList.innerHTML = "";
    const dateKey = getKey(date);
    if (goalsData[dateKey]) {
      goalsData[dateKey].forEach(goal => addGoalItem(goal.text, goal.completed));
    }
    persistentGoals.forEach(goal => addGoalItem(goal.text, goal.completed, false));
  }

  function getPastNDates(n) {
    const dates = [];
    for (let i = 0; i < n; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(getKey(d));
    }
    return dates;
  }

  function renderWeeklyLog() {
    weeklyLog.innerHTML = "";
    const pastDays = getPastNDates(7);
    let completedThisWeek = [];

    pastDays.forEach(dateKey => {
      const entry = goalsData[dateKey];
      if (entry) {
        entry.filter(goal => goal.completed).forEach(goal => {
          if (!completedThisWeek.includes(goal.text)) {
            completedThisWeek.push(goal.text);
          }
        });
      }
    });

    const container = document.createElement("div");
    container.className = "week-log";

    const header = document.createElement("h3");
    header.textContent = "Completed Goals This Week";
    container.appendChild(header);

    const list = document.createElement("ul");
    list.className = "checklist done";
    completedThisWeek.forEach(goal => {
      const li = document.createElement("li");
      li.textContent = goal;
      list.appendChild(li);
    });

    container.appendChild(list);
    weeklyLog.appendChild(container);
  }

  renderWeeklyLog();
});
