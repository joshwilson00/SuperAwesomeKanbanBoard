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

        <div id="0" class="toDoTasks" ondragover="event.preventDefault();" ondrop="app.run('onDrop', event)">
            <h3>To-Do</h3>
            ${state.todo.map(viewTask).join("")}
        </div>
        <div id="1" class="doingTasks" ondragover="event.preventDefault();" ondrop="app.run('onDrop', event)">
            <h3>Doing</h3>
            ${state.doing.map(viewTask).join("")}
        </div>
        <div id="2" class="doneTasks" ondragover="event.preventDefault();" ondrop="app.run('onDrop', event)">
            <h3>Done</h3>
            ${state.done.map(viewTask).join("")}
        </div>
    </div>
    `
const viewTask = task => {return `
    <div id=${task.id} class="task" draggable=true ondragstart="app.run('onDragStart', event)">
        <a href="/task/${task.id}/update" method="POST">&#128394</a>
        <a href="/task/${task.id}/destroy" method="POST">&#10060</a>
        <p>${task.description}</p>
    </div>
`}

const update = {
    onDragStart: (state, event) =>{
        event.dataTransfer.setData('text', event.target.id);
        console.log('Starting to drag', event.target.id);
        return state;
    },
    onDrop: async (state, event) =>{
        event.preventDefault();
        const id = event.dataTransfer.getData('text');
        const task = state.project.tasks.find(task=> task.id == Number(id));
        task.status = event.target.id;
        console.log('Dropped:', task)
        console.log('Dropped onto:', event.target.id);
        await fetch(`/task/${id}/update`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({status: event.target.id})
        });
        app.run('updateState');
        return state;
    },
    updateState: (state) =>{
        fetch(`/project/${state.project.id}`).then(res => console.log(res.json()));
        return state;
    }

}

app.start('projects', state, view, update);