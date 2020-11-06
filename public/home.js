const view = state =>`
    <title>Home Page</title>
    <div class="topBar">
        <h2>Super Awesome Kanban Board</h2>
    </div>
    <div class="userFormBar">
        <button onclick="window.location.href='/users'" class="manageUsers button">Users</button>
        <form class="userForm"action="/user/create" method="POST">
            <input type="text" id="name" name="name" placeholder="Name" required> <br>
            <input type="url" id="avatar" name="avatar" placeholder="Avatar Url" required> <br>
            <input class="button" type="submit" value="Add User">
        </form>
    </div>
    <section class="gallery">
        ${state.projects.map(project=>{
            return `
            <a href="./project/${project.id}">
            <div class="galleryItem" style="background-image: url(${project.image});">
                <h3>${project.name}</h3>
            </div>

            </a>
            `
        }).join("")}
        <div class="galleryProject">
            <div class="addProject">
                <h3>Add a project:</h3>
                <form class="addProject" action="/project/create" method="POST">
                    <input type="text" id="name" name="name" placeholder="Project Name" required> <br>
                    <input type="url" id="image" name="image" placeholder="Image Url" required> <br>
                    <input class="button" type="submit" value="Add Project">
                </form>
            </div>
        </div>
    </section>
`


const update = {
    updateProjects: (state, projects)=>{
        state.projects = projects;
        return state;
    }
}

app.start("desktopView", state, view, update);