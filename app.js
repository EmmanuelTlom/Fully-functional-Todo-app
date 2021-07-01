const form = document.querySelector(".input-form");
const todo = document.getElementById("todo");
const addTodoBtn = document.getElementById("submit-btn");
const itemsLeftt = document.querySelector(".items-left");
const todoContainer = document.querySelector(".todo-con");
const todoItems = document.querySelector(".todo-items");
const clearBtn = document.querySelector(".clear-btn");
const alertDisplays = document.querySelector(".alert");
const darkMode = document.getElementById("mode-icon");
const body = document.getElementById("body");
const header = document.querySelector(".header");
const allBtn = document.getElementById("all");
const activeBtn = document.getElementById("active");
const completedBtn = document.getElementById("completed");
const pComplete = document.querySelector(".pcompleted");
const pActive = document.querySelector(".pactive");

const mode = localStorage.getItem("mode");
darkMode.addEventListener("click", () => {
  let mode = localStorage.getItem("mode", "dark");

  if (mode !== "dark") {
    enableMode();
  } else {
    disableMode();
  }
});

function enableMode() {
  localStorage.setItem("mode", "dark");
  body.classList.add("mode");
  header.classList.add("show");
}
function disableMode() {
  localStorage.setItem("mode", null);
  body.classList.remove("mode");
  header.classList.remove("show");
}

if (mode === "dark") {
  enableMode();
}

let edit;
let editFlag = false;
let editingId = "";

window.addEventListener("DOMContentLoaded", setUp);
form.addEventListener("submit", addTodo);
clearBtn.addEventListener("click", clearAllTodos);
completedBtn.addEventListener("click", checkComplete);
allBtn.addEventListener("click", allTodos);
activeBtn.addEventListener("click", activeTodos);

function addTodo(e) {
  e.preventDefault();

  const todoItem = todo.value;
  //console.log(todoItem);
  const id = new Date().getTime().toString();
  //console.log(id);

  if (todoItem !== "" && !editFlag) {
    const todoDiv = document.createElement("article");
    todoDiv.classList.add("todos");
    const idVal = document.createAttribute("data-id");
    idVal.value = id;
    todoDiv.setAttributeNode(idVal);

    todoDiv.innerHTML = `<p class="title">${todoItem}</p></div>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
              <button type="button" class="done-btn">
                <i class="fas fa-check"></i>
              </button>
            </div>
    `;

    const deleteBtn = todoDiv.querySelector(".delete-btn");
    const editBtn = todoDiv.querySelector(".edit-btn");
    const doneBtn = todoDiv.querySelector(".done-btn");
    deleteBtn.addEventListener("click", deleteTodo);
    editBtn.addEventListener("click", editTodo);
    doneBtn.addEventListener("click", doneFunc);

    todoItems.appendChild(todoDiv);
    todoContainer.classList.add("show");
    //const cla = document.querySelectorAll("title");
    displayAlert("Todo added", "alert-success");
    setBackToDefault();
    itemsLeft();
    //checkComplete();
    addToLs(todoItem, id);
  } else if (todoItem !== "" && editFlag) {
    edit.innerHTML = todoItem;

    displayAlert("Value changed", "alert-success");
    editLsItem(todoItem, editingId);
    setBackToDefault();
  } else {
    displayAlert("Please enter a value", "alert-danger");
  }
}

function deleteTodo(e) {
  const ele = e.currentTarget.parentElement.parentElement;
  todoItems.removeChild(ele);
  const id = ele.dataset.id;

  if (todoItems.children.length === 0) {
    todoContainer.classList.remove("show");
  }

  displayAlert("Todo Removed", "alert-danger");
  setBackToDefault();
  itemsLeft();
  checkComplete();
  deleteFromLs(id);
}

function editTodo(e) {
  const ele = e.currentTarget.parentElement.parentElement;
  const id = ele.dataset.id;
  //console.log(ele);
  edit = e.currentTarget.parentElement.previousElementSibling;
  //console.log(edit);

  todo.value = edit.innerHTML;
  editFlag = true;
  editingId = id;
  addTodoBtn.textContent = "Edit todo";
  //console.log(edit);
}

function clearAllTodos() {
  const element = document.querySelectorAll(".todos");
  element.forEach((todo) => {
    todoItems.removeChild(todo);
  });

  todoContainer.classList.remove("show");
  itemsLeft();
  //checkComplete();
  localStorage.removeItem("todoList");
  //todoContainer.classList.remove("show");
}

function setBackToDefault() {
  todo.value = "";
  addTodoBtn.textContent = "Add todo";
  editFlag = false;
}

function doneFunc(e) {
  //e.currentTarget.parentElement.previousElementSibling.classList.toggle("done");
  e.currentTarget.parentElement.parentElement.classList.toggle("donee");
}

function itemsLeft() {
  const element = document.querySelectorAll(".todos");
  itemsLeftt.textContent = `Items left: ${element.length}`;
}

function displayAlert(alertMsg, alertColor) {
  alertDisplays.textContent = alertMsg;
  alertDisplays.classList.add(alertColor);

  setTimeout(() => {
    alertDisplays.textContent = "";
    alertDisplays.classList.remove(alertColor);
  }, 1000);
}

function addToLs(todo, id) {
  const item = { todo, id };
  let todoFigs = getLocalStorage();
  todoFigs.push(item);
  localStorage.setItem("todoList", JSON.stringify(todoFigs));
  console.log(todoFigs);
}

function getLocalStorage() {
  return localStorage.getItem("todoList")
    ? JSON.parse(localStorage.getItem("todoList"))
    : [];
}

function deleteFromLs(id) {
  //console.log(id);

  let todoFigs = getLocalStorage();
  todoFigs = todoFigs.filter((todo) => {
    //console.log(todo.id);
    if (todo.id !== id) {
      return todo;
    }
  });

  localStorage.setItem("todoList", JSON.stringify(todoFigs));
}

function editLsItem(todo, id) {
  let todoFigs = getLocalStorage();
  todoFigs = todoFigs.map((item) => {
    if (item.id === id) {
      item.todo = todo;
    }

    return item;
  });

  localStorage.setItem("todoList", JSON.stringify(todoFigs));
}

function setUp() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items = items.forEach((item) => {
      createTodoItems(item.todo, item.id);
    });
  }
  todoContainer.classList.add("show");
  itemsLeft();
}

function createTodoItems(todoItem, id) {
  const todoDiv = document.createElement("article");
  todoDiv.classList.add("todos");
  const idVal = document.createAttribute("data-id");
  idVal.value = id;
  todoDiv.setAttributeNode(idVal);

  todoDiv.innerHTML = `<p class="title">${todoItem}</p></div>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
              <button type="button" class="done-btn">
                <i class="fas fa-check"></i>
              </button>
            </div>
    `;

  const deleteBtn = todoDiv.querySelector(".delete-btn");
  const editBtn = todoDiv.querySelector(".edit-btn");
  const doneBtn = todoDiv.querySelector(".done-btn");
  deleteBtn.addEventListener("click", deleteTodo);
  editBtn.addEventListener("click", editTodo);
  doneBtn.addEventListener("click", doneFunc);

  todoItems.appendChild(todoDiv);
}

/*function checkComplete() {
  let arr = [];
  const elements = document.querySelectorAll(".title");

  elements.filter((element) => {
    if (element.classList.contains("done")) {
      return;
    } else {
      arr.push(element);
    }
  });

  //todoContainer.classList.replace("todo-con", "show");
      //element.style.display = "flex";
      //itemsLeftt.style.display = "none";
      //pComplete.style.display = "none";

      //todoContainer.classList.replace("show", "todo-con");
      //itemsLeftt.style.display = "none";
      //pComplete.textContent = "You have not completed any todo";

  console.log(arr);
  completedBtn.textContent = `Completed - ${arr.length} items `;
}

function actives() {}*/
/*function checkComplete() {
  todoContainer.classList.remove("show");
  pComplete.classList.add("see");
  itemsLeftt.classList.add("hide");
  const elements = document.querySelectorAll(".todos");
  //console.log(elements.length);
  elements.forEach((element) => {
    if (element.classList.contains("donee")) {
      element.classList.add("donee");
      todoContainer.classList.add("show");
      pComplete.classList.remove("see");
      itemsLeftt.style.display = "none";
      //console.log(see);

      if (elements.length === 0) {
        todoContainer.classList.remove("show");
        pComplete.classList.add("see");
        itemsLeftt.style.display = "none";
      }
    } else {
      element.style.display = "none";
      itemsLeftt.classList.remove("hide");
      itemsLeftt.style.display = "none";
    }
  });
}

function all() {
  todoContainer.classList.add("show");
  pComplete.classList.remove("see");
  itemsLeftt.classList.remove("hide");
  const elements = document.querySelectorAll(".todos");
  elements.forEach((element) => {
    todoContainer.classList.add("show");
    //itemsLeftt.style.display = "flex";
    //pComplete.textContent = "";
    element.style.display = "flex";
    itemsLeftt.style.display = "grid";
  });
}

function activeTodos() {
  todoContainer.classList.add("show");
  const elements = document.querySelectorAll(".todos");
  elements.forEach((element) => {
    if (element.classList.contains("donee")) {
      element.style.display = "none";
      if (elements.length === 0) {
        todoContainer.classList.remove("show");
        pActive.classList.add("see");
        itemsLeftt.style.display = "none";
      }
    } else {
      element.style.display = "flex";
      itemsLeftt.style.display = "none";
    }
  });

  todoContainer.classList.remove("show");
}*/

function allTodos(e) {
  e.preventDefault();
  const todos = todoItems.childNodes;
  itemsLeftt.classList.remove("hide");
  pActive.classList.remove("see");
  pComplete.classList.remove("see");
  //console.log(todos);
  todos.forEach((todo) => {
    todoContainer.classList.add("show");
    todo.style.display = "flex";
  });
}

function checkComplete(e) {
  e.preventDefault();
  const todos = todoItems.childNodes;
  itemsLeftt.classList.add("hide");
  pActive.classList.remove("see");
  todos.forEach((todo) => {
    pActive.classList.remove("see");
    //const le = todo.classList.contains("donee").length;
    //console.log(le);
    const le = document.querySelectorAll(".donee");
    //console.log(le.length);
    if (le.length === 0) {
      todoContainer.classList.remove("show");
      pComplete.classList.add("see");
    } else {
      todoContainer.classList.add("show");
    }

    if (todo.classList.contains("donee")) {
      todo.style.display = "flex";
    } else {
      todo.style.display = "none";
    }

    //if (todo.classList.contains("donee").length === 0) {
    // todoContainer.classList.remove("show");
    //}
  });
}

function activeTodos(e) {
  e.preventDefault();
  const todos = todoItems.childNodes;
  itemsLeftt.classList.add("hide");
  pComplete.classList.remove("see");

  todos.forEach((todo) => {
    //todoContainer.classList.add("show");
    /*const le = document.querySelectorAll(".donee");
    console.log(le.length);
    if (le.length !== 0) {
      todoContainer.classList.remove("show");
      pActive.classList.add("see");
    } else {
      todoContainer.classList.add("show");
    }*/
    //console.log(le);
    /*const le = document.querySelectorAll(".todos");
    console.log(le.length);
    if (le.length === 0) {
      todoContainer.classList.remove("show");
      pActive.classList.add("see");
    } else {
      todoContainer.classList.add("show");
    }*/
    const le = document.querySelectorAll(".todos");
    //const he = todo.querySelectorAll(".todos.donee");
    const se = document.querySelectorAll(".donee");
    console.log(se.length, le.length);
    if (se.length === le.length) {
      todoContainer.classList.remove("show");
      pActive.classList.add("see");
    } else if (se.length !== 0) {
      todoContainer.classList.add("show");
      pActive.classList.remove("see");
    } else if (se.length === 0) {
      todoContainer.classList.add("show");
      pActive.classList.remove("see");
    } else {
      todoContainer.classList.remove("show");
      pActive.classList.remove("see");
    }
    /*if (
      le.length === 0 &&
      se.length === 0 &&
      todo.classList.contains("todos donee")
    ) {
      todoContainer.classList.remove("show");
      pActive.classList.add("see");
    } else {
      todoContainer.classList.add("show");
      pActive.classList.remove("see");
    }*/

    if (!todo.classList.contains("donee")) {
      todo.style.display = "flex";
    } else {
      todo.style.display = "none";
    }
  });
}
