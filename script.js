const input = document.querySelector(".search");
const button = document.querySelector(".add");
const clickSound = new Audio("./assets/button-202966.mp3");
const todos = document.querySelector(".todos");

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

  const newTodo = document.createElement("div");
  newTodo.classList.add("todo");
  newTodo.innerHTML = `
    <div class="start">
      <span class="check" style="background-color: white;"></span>
      <span class="task">${value}</span>
    </div>
    <div class="actions">
      <span class="edit"><i class="fa-solid fa-pen-to-square"></i></span>
      <span class="delete"><i class="fa-solid fa-trash"></i></span>
    </div>
  `;

  todos.appendChild(newTodo);
  input.value = "";

  // Select only inside this todo
  const deleteTask = newTodo.querySelector(".delete");
  const editTask = newTodo.querySelector(".edit");
  const checkTask = newTodo.querySelector(".check");
  const taskText = newTodo.querySelector(".task");

  deleteTask.addEventListener("click", () => {
    todos.removeChild(newTodo);
  });

  checkTask.addEventListener("click", () => {
    checkTask.innerHTML = `<i class="fa-solid fa-check"></i>`;
    checkTask.style.backgroundColor = "green";
    checkTask.style.color = "white";
    taskText.style.fontWeight = "bold";
    taskText.style.textDecoration = "line-through";
    taskText.style.textDecorationThickness = "3px";
    taskText.style.textDecorationColor = "black";
    editTask.style.display = "none";
  });

  const editModal = document.querySelector(".edit-modal");
  const editInputGlobal = editModal.querySelector(".edit-input");
  const saveEditBtn = editModal.querySelector(".save-edit");

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

  let taskBeingEdited = null; // reference to the .task span we are editing

  editTask.addEventListener("click", () => {
    taskBeingEdited = taskText; // save the current task span
    editInputGlobal.value = taskText.textContent; // fill input with current text
    editModal.classList.remove("hidden"); // show modal
    editInputGlobal.focus();
    const length = editInputGlobal.value.length;

    editInputGlobal.select();
  });

  // Save changes
  saveEditBtn.addEventListener("click", () => {
    const newValue = editInputGlobal.value.trim();
    if (newValue !== "") {
      taskBeingEdited.textContent = newValue;
      editModal.classList.add("hidden"); // hide modal
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
});
