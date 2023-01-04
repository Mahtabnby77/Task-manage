const newTaskInput = document.querySelector('#newTaskInput');
const addBtn = document.querySelector('#addBtn');
const taskList = document.querySelector('#tasksList');
const searchInput = document.querySelector('#searchInput');
const deleteAll = document.querySelector('#deleteAll');

showAllTasks();

addBtn.addEventListener('click', checkNewTaskInput);
searchInput.addEventListener('keyup', searchTask);
deleteAll.addEventListener('click', deleteAllTasks);

function deleteAllTasks() {
    const answer = confirm("آیا از پاک کردن آن مطمئنید؟");
    if (answer) {
        localStorage.removeItem('mahtabTasks');
        showAllTasks();
    }
}

function checkNewTaskInput() {
    if (newTaskInput.value == "") {
        alert('ابتدا متن مورد نظر را تایپ کنید! ');
        newTaskInput.focus();
    } else {
        addNewTask(newTaskInput.value);
    }
}

function addNewTask(inputValue) {
    let tasks = checkStorage();
    let tempObj = {
        task: inputValue,
        create_at: Date.now(),
        status: 0
    }

    tasks.push(tempObj);
    saveTasksInStorage(tasks);

    newTaskInput.value = "";
    newTaskInput.focus();
}

function checkStorage() {
    const oldTasks = localStorage.getItem('mahtabTasks');
    if (!oldTasks) {
        const newArray = [];
        return newArray;
    } else {
        const currentArray = JSON.parse(oldTasks);
        return currentArray;
    }
}

function saveTasksInStorage(tasks) {
    localStorage.setItem("mahtabTasks", JSON.stringify(tasks));
    showAllTasks();
}

function showAllTasks() {
    let tasks = checkStorage();

    let str = "";
    tasks.map(item => {
        let date = new Date(item.create_at);

        let taskDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        let status = "";
        let color = "bg-danger";
        let checkBox = ``;
        if (item.status == 0) {
            status = `ToDo`;
            checkBox = `<div>
                            <input type="checkbox" class="form-check-input" title=${item.create_at}>
                        </div>`;

        } else {
            status = `Done`;
            color = `bg-success`;
        }


        str += `<div class="card col-lg-5 col-sm-12 my-2">
                    <div class="card-body">
                        <h5 class="card-title text-center">
                            <p>${item.task}</p>
                        </h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Created at: ${taskDate}</li>
                        <li class="list-group-item"><a href="#" title=${item.create_at}> حذف </a></li>
                        <li class="list-group-item d-flex justify-content-between ${color}">
                            <div>Status: <span>${status}</span></div>
                            ${checkBox}
                        </li>
                    </ul>
                </div>`;
    })

    taskList.innerHTML = str;

    const checkBoxes = document.querySelectorAll('#tasksList input[type="checkbox"]');
    const deleteSingleTask = document.querySelectorAll('#tasksList a');

    checkBoxes.forEach(item => {
        item.addEventListener('click', convertTaskToDone);
    })

    deleteSingleTask.forEach(item => {
        item.addEventListener('click', removeTask);
    })
}

function removeTask(e) {
    e.preventDefault();
    const key = this.title;

    let tasks = checkStorage();

    const index = tasks.findIndex(item => item.create_at == key);

    tasks.splice(index, 1)

    saveTasksInStorage(tasks);
}

function convertTaskToDone() {
    const key = this.title;

    let tasks = checkStorage();

    tasks.map(item => {
        if (item.create_at == key) {
            item.status = 1;
        }
    })

    saveTasksInStorage(tasks);
}

function searchTask() {
    const word = searchInput.value;
    const cards = document.querySelectorAll('.card p');

    // let str = "ss";

    // str.includes("s")
    cards.forEach(item => {
        if (item.innerText.includes(word)) {
            item.parentElement.parentElement.parentElement.style.display = "block"
        } else {
            item.parentElement.parentElement.parentElement.style.display = "none"
        }
    })

}