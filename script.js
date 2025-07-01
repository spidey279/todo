const input = document.querySelector(".search");
const button = document.querySelector(".add");
const clickSound = new Audio("./assets/button-202966.mp3");
const todos = document.querySelector(".todos");

let todoList = []; // this will store our todos in memory

// Load from localStorage
function loadTodos() {
  const data = localStorage.getItem("todos");
  if (data) {
    todoList = JSON.parse(data);
    todoList.forEach((todo) => renderTodo(todo));
  }
}

// Save to localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todoList));
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    button.click();
  }
});
input.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    input.value = "";
  }
});

button.addEventListener("click", () => {
  clickSound.play();
  button.disabled = true;
  setTimeout(() => {
    button.disabled = false;
  }, 2000);

  const value = input.value.trim();
  if (value === "") {
    return Toastify({
      text: "Task cannot be empty",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "red",
    }).showToast();
  }

  const newTodoObj = {
    text: value,
    completed: false,
  };

  todoList.push(newTodoObj);
  saveTodos();

  renderTodo(newTodoObj);
  input.value = "";
});

function renderTodo(todoObj) {
  const newTodo = document.createElement("div");
  newTodo.classList.add("todo");
  newTodo.innerHTML = `
    <div class="start">
      <span class="check" style="background-color: ${
        todoObj.completed ? "green" : "white"
      }; color: ${todoObj.completed ? "white" : "black"};">
        ${todoObj.completed ? '<i class="fa-solid fa-check"></i>' : ""}
      </span>
      <span class="task" style="
        font-weight: ${todoObj.completed ? "bold" : "normal"};
        text-decoration: ${todoObj.completed ? "line-through" : "none"};
        text-decoration-thickness: ${todoObj.completed ? "3px" : "0"};
        text-decoration-color: ${todoObj.completed ? "black" : "transparent"};
      ">${todoObj.text}</span>
    </div>
    <div class="actions">
      <span class="edit"><i class="fa-solid fa-pen-to-square"></i></span>
      <span class="delete"><i class="fa-solid fa-trash"></i></span>
    </div>
  `;
  todos.appendChild(newTodo);

  const deleteTask = newTodo.querySelector(".delete");
  const editTask = newTodo.querySelector(".edit");
  const checkTask = newTodo.querySelector(".check");
  const taskText = newTodo.querySelector(".task");

  deleteTask.addEventListener("click", () => {
    todos.removeChild(newTodo);
    todoList = todoList.filter((t) => t !== todoObj);
    saveTodos();
  });

  checkTask.addEventListener("click", () => {
    todoObj.completed = true;
    checkTask.innerHTML = `<i class="fa-solid fa-check"></i>`;
    checkTask.style.backgroundColor = "green";
    checkTask.style.color = "white";
    taskText.style.fontWeight = "bold";
    taskText.style.textDecoration = "line-through";
    taskText.style.textDecorationThickness = "3px";
    taskText.style.textDecorationColor = "black";
    editTask.style.display = "none";
    saveTodos();
  });

  const editModal = document.querySelector(".edit-modal");
  const editInputGlobal = editModal.querySelector(".edit-input");
  const saveEditBtn = editModal.querySelector(".save-edit");

  let taskBeingEdited = null;

  editInputGlobal.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveEditBtn.click();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      editModal.classList.add("hidden");
    }
  });

  editTask.addEventListener("click", () => {
    taskBeingEdited = { textEl: taskText, obj: todoObj };
    editInputGlobal.value = taskText.textContent;
    editModal.classList.remove("hidden");
    editInputGlobal.select();
  });

  saveEditBtn.addEventListener("click", () => {
    const newValue = editInputGlobal.value.trim();
    if (newValue !== "") {
      taskBeingEdited.textEl.textContent = newValue;
      taskBeingEdited.obj.text = newValue;
      editModal.classList.add("hidden");
      saveTodos();
    } else {
      Toastify({
        text: "Task cannot be empty",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    }
  });

  if (todoObj.completed) {
    editTask.style.display = "none";
  }
}

// Load everything on page load
loadTodos();
