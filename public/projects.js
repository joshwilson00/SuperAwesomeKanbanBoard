const view = (state) => `
<div class="desktopView">
  <a href="/">Back to projects</a>
  <h1>${state.project.name}</h1>
  <form class="taskForm"action="/task/project/${state.project.id}/create" method="POST">
    <input type="text" id="description" name="description" placeholder="Task Description" required> <br>
    <input type="submit" value="Add Task">
  </form>
  <div id="todo" class="toDoTasks" ondragover="event.preventDefault();" ondrop="app.run('onDrop', event)">
    <h3>To-Do</h3>
    ${state.tasks
      .filter((task) => task.status === 0)
      .map(viewTaskDesktop)
      .join("")
    }
  </div>
  <div id="doing" class="doingTasks" ondragover="event.preventDefault();" ondrop="app.run('onDrop', event)">
    <h3>Doing</h3>
    ${state.tasks
      .filter((task) => task.status === 1)
      .map(viewTaskDesktop)
      .join("")
    }
  </div>
  <div id="done" class="doneTasks" ondragover="event.preventDefault();" ondrop="app.run('onDrop', event)">
    <h3>Done</h3>
    ${state.tasks
      .filter((task) => task.status === 2)
      .map(viewTaskDesktop)
      .join("")
    }
  </div>
</div>
`

const viewTaskDesktop = (task) => {
  return `
    <div id=${task.id} class="task" draggable=true ondragstart="app.run('onDragStart', event)">
        <select name="${task.id}" onchange="app.run('assignUser', event)">
          <option ${!task.UserId ? 'selected': ''}>Please select a user</option>
        ${state.users.map(user=>{
          return `
          <option value="${user.id}" ${task.UserId==user.id ? 'selected': ''}>${user.name}</option>
          `
        })}
        </select>        
        <a href="/task/${task.id}/update" method="POST">&#128394</a>
        <a href="/task/${task.id}/destroy" method="POST">&#10060</a>
        <p>${task.description}</p>
        ${showAvatar(task.UserId)}
    </div>
`
}
const showAvatar = userId => {
  if (userId){
    const user = state.users.find(user => user.id === Number(userId));
    return `
      <div id='userIMG'>
        <img src="${user.avatar}" />
      </div>
    `  
  }
  return ``
}

const update = {
  onDragStart: (state, event) => {
    event.dataTransfer.setData("text", event.target.id);
    return state;
  },
  onDrop: async (state, event) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const task = state.tasks.find((task) => task.id == Number(id));
    if (event.target.id == 'todo') {
        task.status = 0;
    } else if (event.target.id == 'doing') {
        task.status = 1;
    } else {
        task.status = 2;
    }
    await fetch(`/task/${id}/update`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ status: task.status }),
    });
    return state;
  },
  assignUser: async (state, event) =>{
    const task = state.tasks.find(task => task.id === Number(event.target.name));
    task.UserId = Number(event.target.value);
    console.log(task);
    await fetch(`/task/${task.id}/assign`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ UserId: task.UserId }),
    });
    return state;
  },
}
app.start("projects", state, view, update);