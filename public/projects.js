const view = (state) => `
        <div id="0" class="toDoTasks" ondragover="event.preventDefault();" ondrop='app.run('onDrop', event) '>
            <h3>To-Do</h3>
                ${state.todo.map(task=>{`
                    <div id=${task.id} class="task" ondragstart='app.run('onDragStart', event)' draggable=true>

                        <a href="/task/${task.id}/update" method="POST">&#128394</a>
                        <a href="/task/${task.id}/destroy" method="POST">&#10060</a>
                        <p>${task.description}</p>
                    </div>        
                `
                })}
        </div>
        <div id="1" class="doingTasks" ondragover="event.preventDefault();" ondrop='onDrop(event)'>
            <h3>Doing</h3>
            ${state.doing.map(task=>{`
                <div id=${task.id} class="task" ondragstart='app.run('onDragStart', event)' draggable=true>
                    <select name="assignedUser" id="user">
                        ${state.users.map(user=>{`
                            <option value="${user.id}">${user.name}</option>
                            `
                        })}

                    </select>
                    <a href="/task/${task.id}/update" method="POST">&#128394</a>
                    <a href="/task/${task.id}/destroy" method="POST">&#10060</a>
                    <p>${task.description}</p>
                </div>
            `
            })}

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