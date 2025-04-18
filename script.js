// Linked List Node
class TaskNode {
  constructor(task) {
    this.task = task;
    this.next = null;
  }
}

let head = null;
let idCounter = 1;
let currentSortType = 'id';

function addTask() {
  const task = {
    id: idCounter++,
    name: document.getElementById("taskName").value,
    dueDate: document.getElementById("taskDate").value,
    time: document.getElementById("taskTime").value,
    priority: document.getElementById("taskPriority").value,
    category: document.getElementById("taskCategory").value,
    isCompleted: false
  };
  const node = new TaskNode(task);
  node.next = head;
  head = node;
  renderTasks();
}

function priorityValue(p) {
  return p === "High" ? 1 : p === "Medium" ? 2 : 3;
}

function mergeSort(head, key) {
  if (!head || !head.next) return head;
  let mid = getMid(head);
  let left = head;
  let right = mid.next;
  mid.next = null;
  return merge(mergeSort(left, key), mergeSort(right, key), key);
}

function getMid(head) {
  let slow = head, fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

function merge(l1, l2, key) {
  let dummy = new TaskNode(null), cur = dummy;
  while (l1 && l2) {
    if (compare(l1.task, l2.task, key) < 0) {
      cur.next = l1;
      l1 = l1.next;
    } else {
      cur.next = l2;
      l2 = l2.next;
    }
    cur = cur.next;
  }
  cur.next = l1 || l2;
  return dummy.next;
}

function compare(a, b, key) {
  if (key === 'id') return a.id - b.id;
  if (key === 'date') return (a.dueDate + a.time).localeCompare(b.dueDate + b.time);
  if (key === 'priority') return priorityValue(a.priority) - priorityValue(b.priority);
  return 0;
}

function sortTasks(by) {
  currentSortType = by;
  head = mergeSort(head, by);
  renderTasks();
}

function updateSortLabel() {
  const icons = { id: "ID 🔢", date: "Due Date 📅", priority: "Priority ⬆️" };
  document.getElementById("currentSort").textContent = icons[currentSortType];
}

function formatTime12Hour(time) {
  if (!time) return '';
  const [hour, minute] = time.split(":");
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const adjustedHour = h % 12 || 12;
  return `${adjustedHour}:${minute} ${ampm}`;
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  updateSortLabel();

  let current = head;
  while (current) {
    const t = current.task;
    const li = document.createElement("li");
    li.className = "task-item";
    li.innerHTML = `
      <strong>${t.name}</strong> [${t.priority}] - 
      Due: ${t.dueDate} ${formatTime12Hour(t.time)} | ${t.category} 
      | Status: ${t.isCompleted ? "✅ Done" : "🕒 Pending"}
      <div class="edit-buttons">
        <button onclick="editTask(${t.id})">✏️ Edit</button>
        <button onclick="markDone(${t.id})">✅ Mark Done</button>
        <button onclick="deleteTask(${t.id})">🗑️ Delete</button>
      </div>`;
    list.appendChild(li);
    current = current.next;
  }
}

function findTaskNodeById(id) {
  let cur = head;
  while (cur) {
    if (cur.task.id === id) return cur;
    cur = cur.next;
  }
  return null;
}

function editTask(id) {
  const node = findTaskNodeById(id);
  if (!node) return alert("Task not found.");
  const t = node.task;

  const field = prompt("What do you want to edit? (name/dueDate/time/priority/category)");
  if (!field) return;

  const val = prompt(`Enter new value for ${field}:`);
  if (!val) return;

  switch (field) {
    case "name": t.name = val; break;
    case "dueDate": t.dueDate = val; break;
    case "time": t.time = val; break;
    case "priority": t.priority = val; break;
    case "category": t.category = val; break;
    default: alert("Invalid field."); return;
  }

  renderTasks();
}

function markDone(id) {
  const node = findTaskNodeById(id);
  if (node) {
    node.task.isCompleted = true;
    renderTasks();
  }
}

function deleteTask(id) {
  if (head && head.task.id === id) {
    head = head.next;
    return renderTasks();
  }

  let prev = head, cur = head?.next;
  while (cur) {
    if (cur.task.id === id) {
      prev.next = cur.next;
      break;
    }
    prev = cur;
    cur = cur.next;
  }
  renderTasks();
}

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("taskDate");
  const timeInput = document.getElementById("taskTime");

  // Works even on browsers without showPicker()
  dateInput.addEventListener("click", () => {
    dateInput.focus();
    setTimeout(() => dateInput.showPicker?.(), 10);
  });

  timeInput.addEventListener("click", () => {
    timeInput.focus();
    setTimeout(() => timeInput.showPicker?.(), 10);
  });
});
