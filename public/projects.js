const view = (state) => `
    <div class="phoneView">
        <a href="/">Back to projects</a>
        <h1>${state.project.name}</h1>
        <form class="taskForm"action="/task/project/${state.project.id}/create" method="POST">
            <input type="text" id="description" name="description" placeholder="Task Description" required> <br>
            <input type="submit" value="Add Task">
        </form>

        <select name="tasks" id="tasks">
            <option value="to-do">To-Do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
        </select>

        <div id="0" class="toDoTasks" ondragover="event.preventDefault();" ondrop='app.run('onDrop', event) '>
            <h3>To-Do</h3>
            ${state.todo.map(task => {return `
                <div id=${task.id} class="task" ondragstart='app.run('onDragStart', event)' draggable=true>
                    <a href="/task/${task.id}/update" method="POST">&#128394</a>
                    <a href="/task/${task.id}/destroy" method="POST">&#10060</a>
                    <p>${task.description}</p>
                </div>
            `
            }).join("")} 
        </div>
        <div id="1" class="doingTasks" ondragover="event.preventDefault();" ondrop='onDrop(event)'>
            <h3>Doing</h3>
            ${state.doing.map(task=>{return `
                <div id=${task.id} class="task" ondragstart='app.run('onDragStart', event)' draggable=true>
                    <a href="/task/${task.id}/update" method="POST">&#128394</a>
                    <a href="/task/${task.id}/destroy" method="POST">&#10060</a>
                    <p>${task.description}</p>
                </div>
            `
            })}
        </div>
    </div>
    `;
const update = {
  onDragStart: (state, event) => {
    event.dataTransfer.setData("text", event.target.id);
    return state;
  },
  onDrop: (state, event) => {
    event.preventDefault();
    const id = event.target.id;
    console.log(id);
    return state;
  },
};

app.start('projects', state, view, update);