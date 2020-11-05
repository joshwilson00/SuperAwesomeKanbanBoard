const view = state => `
<div class='profileContainer'>
    <div class='profileHeader'>
        <button class='button profileButton' type="button" onclick="javascript:history.back()">Back</button>
        <img src="${state.user.avatar}" />
        <h2>${state.user.name}</h2>
    </div>
    <div class='userTimes'>
        <small>User created: ${new Date(state.user.createdAt)}</small>
        <br/>
        <small>User last updated: ${new Date(state.user.updatedAt)}</small>
    </div>
    <div class="profileContent">
        <h4>Current working on</h4>
        ${state.tasks.map(task=>{
            return `
            <hr />
            <a href="/project/${task.ProjectId}">
                <h4>${showProject(task.ProjectId)}</h4>
                Task: ${task.description}
            </a>
            `
        }).join("")}
    </div
</div>
`
const showProject = (projectID) =>{
    const project = state.projects.find(project => project.id === Number(projectID));
    return`${project.name}`
}

const update = {

}

app.start('profile', state, view, update);