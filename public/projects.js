const view = (state) => `
<title>${state.project.name}</title>
<div class="desktopView">
  <div class="nav">
    <a href="/">Back to projects</a>
    <form class="taskForm" action="/task/project/${state.project.id}/create" method="POST">
      <input type="text" id="description" name="description" placeholder="Task Description" required> <br>
      <input class="button" type="submit" value="Add Task">
    </form>
  </div>
  <h1>${state.project.name}</h1>
  <div class="allTasks">
    <div id="todo" class="tasks toDoTasks" ondragover="event.preventDefault();" ondrop="app.run('onDrop', event)">
      <h3>To-Do</h3>
      ${state.tasks
        .filter((task) => task.status === 0)
        .map(viewTaskDesktop)
        .join("")
      }
    </div>
    <div id="doing" class="tasks doingTasks" ondragover="event.preventDefault();" ondrop="app.run('onDrop', event)">
      <h3>Doing</h3>
      ${state.tasks
        .filter((task) => task.status === 1)
        .map(viewTaskDesktop)
        .join("")
      }
    </div>
    <div id="done" class="tasks doneTasks" ondragover="event.preventDefault();" ondrop="app.run('onDrop', event)">
      <h3>Done</h3>
      ${state.tasks
        .filter((task) => task.status === 2)
        .map(viewTaskDesktop)
        .join("")
      }
    </div>
  </div>
  <div class="container">
      <div class="fa fa-trash w3-jumbo delete" ondragover="event.preventDefault();" ondrop="app.run('deleteTask', event)"></div>
      <button class="removeProject" onclick="app.run('deleteProject', event)">Delete Project</button>
  </div>
</div>
`

const viewTaskDesktop = (task) => {
  return `
    <div id=${task.id} class="task" draggable=true ondragstart="app.run('onDragStart', event)">
      <div class="taskEdit">
        <select class="button" name="${task.id}" onchange="app.run('assignUser', event)">
          <option ${!task.UserId ? 'selected': ''}>Assign User</option>
        ${state.users.map(user=>{
          return `
          <option value="${user.id}" ${task.UserId==user.id ? 'selected': ''}>${user.name}</option>
          `
        })}
        </select> 
        <a href="/task/${task.id}/destroy" method="POST">&#10060</a>
      </div> 
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
        <a href="/users/${user.id}">
        <img src="${user.avatar}" />
        </a>
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
    } else if (event.target.id == 'done') {
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
  deleteTask: async (state, event) =>{
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const index = state.tasks.findIndex((task) => task.id == Number(id));
    state.tasks.splice(index, 1);
    await fetch(`/task/${id}/destroy`);
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
  deleteProject: async(state)=>{
    if (window.confirm(`Are you sure you want to delete the ${state.project.name} board?`)) {
      await fetch(`/project/${state.project.id}/destroy`);
      window.location.href= `/`;
      return state
    }
  },
  updateTasks: (state, tasks)=>{
    state.tasks = tasks;
    return state;
  } 
}
app.start("projects", state, view, update);
