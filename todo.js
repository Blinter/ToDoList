document.addEventListener("DOMContentLoaded", function () {
    //Delete inital entries since we are using local storage (Keep previous entries in original HTML for template)
    for (item of document.querySelectorAll("td"))
        if (item.getAttribute("data-action"))
            item.remove();

    //Initial load does not require duplicate checks, as checks are done in the beginning from first task add.
    for (item of JSON.parse(localStorage.getItem("todos")) || [])
        document.querySelector("table.tasklist > tbody").append(!item.c ? getIncompleteTaskObject(item.t) : getCompletedTaskObject(item.t));

    const taskListTable = document.querySelector("body > table.tasklist");
    taskListTable.addEventListener("click", function (event) {
        if (event.target.tagName != "INPUT")
            return;
        const selectedTodo = event.target.getAttribute("data-action");
        switch (event.target.getAttribute("value")) {
            case "DONE":
                taskListTable.querySelector("td[data-action$='" + selectedTodo + "'").querySelector("p").className = "completed";
                taskListTable.querySelector("td[data-action$='" + selectedTodo + "'").querySelector("input").remove();
                break;
            case "REMOVE":
                taskListTable.querySelector("td[data-action$='" + selectedTodo + "'").remove();
                break;
            //Other Tasks
            default:
                break;
        }
        //Save on any modification
        saveAllTasks();
    })

    //Quick find for add new action
    const actionAddTaskButton = document.getElementsByName("actionaddnew")[0];
    actionAddTaskButton.addEventListener("click", function (event) {
        if (event.target.tagName != "INPUT")
            return;
        const newActionName = document.querySelector("input[type=text]").value;
        if (!newActionName || !checkforExisting(newActionName))
            return;
        document.querySelector("table.tasklist > tbody").append(getIncompleteTaskObject(newActionName));
        //LOCAL STORAGE
        saveAllTasks();
    })
});


//Saving: Any modification to list will change local storage.
//Through my HTML design I simply used unique <td>'s with data-action name for each task.
//by searching the child, the <p> class will provide the status of completion of each task.
function saveAllTasks() {
    const taskList = document.querySelectorAll("td");
    const saved = [];
    for(item of taskList)
        if(item.getAttribute("data-action"))
            saved.push({t: item.getAttribute("data-action"), c: item.querySelector("p").className==="notcompleted"?0:1});
    localStorage.setItem("todos", JSON.stringify(saved));
}

function getIncompleteTaskObject(actionName) {
    const templateToAdd1 = document.createElement("tr");
    const templateToAdd2 = document.createElement("td");
    templateToAdd2.setAttribute("data-action", actionName);
    templateToAdd2.appendChild(document.createElement("hr"));
    templateToAdd1.appendChild(templateToAdd2);
    const templateToAdd3 = document.createElement("p");
    templateToAdd3.className = "notcompleted";
    templateToAdd3.innerText = actionName;
    templateToAdd2.appendChild(templateToAdd3);
    const templateToAdd4 = document.createElement("input");
    templateToAdd4.type = "button";
    templateToAdd4.name = "actioncomplete";
    templateToAdd4.value = "DONE";
    templateToAdd4.setAttribute("data-action", actionName);
    templateToAdd2.appendChild(templateToAdd4);
    const templateToAdd5 = document.createElement("input");
    templateToAdd5.type = "button";
    templateToAdd5.name = "actionremove";
    templateToAdd5.value = "REMOVE";
    templateToAdd5.setAttribute("data-action", actionName);
    templateToAdd2.appendChild(templateToAdd5);
    const templateToAdd = document.createDocumentFragment();
    templateToAdd.appendChild(templateToAdd1);
    return templateToAdd;
}
function getCompletedTaskObject(actionName) {
    const templateToAdd1 = document.createElement("tr");
    const templateToAdd2 = document.createElement("td");
    templateToAdd2.setAttribute("data-action", actionName);
    templateToAdd2.appendChild(document.createElement("hr"));
    templateToAdd1.appendChild(templateToAdd2);
    const templateToAdd3 = document.createElement("p");
    templateToAdd3.className = "completed";
    templateToAdd3.innerText = actionName;
    templateToAdd2.appendChild(templateToAdd3);
    const templateToAdd4 = document.createElement("input");
    templateToAdd4.type = "button";
    templateToAdd4.name = "actionremove";
    templateToAdd4.value = "REMOVE";
    templateToAdd4.setAttribute("data-action", actionName);
    templateToAdd2.appendChild(templateToAdd4);
    const templateToAdd = document.createDocumentFragment();
    templateToAdd.appendChild(templateToAdd1);
    return templateToAdd;
}

function checkforExisting(actionName) {
    return !document.querySelector("td[data-action$='" + actionName + "'");
}
