
const view = state =>`
<div class="nav">
    <a href="/">Back to projects</a>
</div>
<div class=tableContainer>
    <table>
        <tr>
            <th>User</th>
            <th>Edit</th>
            <th>Delete</th>
        </tr>
        ${state.users.map(user=>{
            return `
                <tr>
                    <td>${user.name}</td>
                    <td><button class="button" onclick="document.getElementById('${user.id}').style.display='block'">Edit</button></td>
                    <td><button class="button" name=${user.id} onclick="app.run('deleteUser', event)">Delete User</button></td>
                </tr>
            `
        })}
    </table>
    <div id='modals'>
    ${state.users.map(user=>{
        return `
        <div id="${user.id}" class="w3-modal">
            <div class="w3-modal-content">
                <header class="w3-container"> 
                    <span onclick="document.getElementById('${user.id}').style.display='none'" 
                    class="w3-button w3-display-topright">&times;</span>
                    <h2>Editing User: ${user.name}</h2>
                </header>
                <div class="w3-container">
                    <form action="/users/${user.id}/update" method="POST">
                        <label for='name'>Name</label>
                        <input name='name' value="${user.name}"></input>
                        <label for='avatar'>Avatar URL</label>
                        <input name='avatar' value="${user.avatar}"></input>
                        <button type='submit' class='button'>Save</button>
                    </form>
                </div>
            </div>
        </div>
        </div>
        `
    })}
</div>
`
const update = {
    deleteUser: async (state, event)=>{
        const index = state.users.findIndex(user=> user.id === Number(event.target.name));
        const user = state.users.find(user=>user.id === Number(event.target.name));
        if (window.confirm(`Are you sure you want to delete the user account for: ${user.name}`)) {
            state.users.splice(index, 1);
            await fetch(`/users/${event.target.name}/delete`);
            return state
        }
    },
    updateUsers: (state, users) =>{
        state.users = users;
        return state;
    }
}

app.start("users", state, view, update);