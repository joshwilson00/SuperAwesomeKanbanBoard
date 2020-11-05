const express = require('express')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
var http = require('http').createServer(app);
const io = require('socket.io')(http);

const { Project, Task, User, sequelize } = require('./models/models.js')

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})



app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


io.on('connection', (socket)=>{
    console.log('Client connected!');
})


//get all projects {id, name}, render home view
app.get('/', async (req, res) => {
    const projects = await Project.findAll({ logging: false })
    res.render('home', {projects: JSON.stringify(projects)});
})

//get full project with nested tasks, sort tasks by task.status, return project, sorted tasks and users, render projects view
app.get('/project/:id', async (req, res) => {
    const project = await Project.findByPk(req.params.id,{ 
        include: [{all : true, nested: true}], 
        logging: false 
    })
    
    const users = await User.findAll({ logging: false })
    const tasks = await Task.findAll({ where : {ProjectId : req.params.id }});
    res.render('project', {tasks: JSON.stringify(tasks), users: JSON.stringify(users), project: JSON.stringify(project)});
})



//get user from taskid, return user
app.get('/task/:taskid/user', async (req, res) => {
    const task = await Task.findByPk(req.params.taskid)
    const user = await User.findByPk(task.UserId)
    return user
})





//create user, redirect back
app.post('/user/create', async (req, res) => {
    await User.create(req.body)
    res.redirect('back')
})

// find from id and update user, redirect back
app.post('/user/:userid/update', async (req, res) => {
    const user = await User.findByPk(req.params.userid,{ logging: false })
    await user.update(req.body)
    res.redirect('back')
})

// find from id and destroy user, currently unused
app.post('/user/:userid/destroy', async (req, res) => {
    const user = await User.findByPk(req.params.userid)
    await user.destroy()
})



//create project, redirect back
app.post('/project/create', async (req, res) => {
    await Project.create(req.body);
    await sendProjects();
    res.redirect('back');
})

//find from id and update project, redirect back
app.post('/project/:projectid/update', async (req, res) => {
    const project = await Project.findByPk(req.params.projectid,{ logging: false });
    await project.update(req.body);
    await sendProjects();
    res.redirect('back');
})

//find from id and destroy project, redirect to home
app.get('/project/:projectid/destroy', async (req, res) => {
    const project = await Project.findByPk(req.params.projectid);
    await project.destroy();
    await sendProjects();
    res.redirect('/');
})





//create task, find project from id and assign, redirect back
app.post('/task/project/:projectid/create', async (req, res) => {
    const task = await Task.create(req.body)
    const project = await Project.findByPk(req.params.projectid,{ logging: false })
    await project.addTask(task)
    await sendTasks(req.params.projectid);
    res.redirect('back')
})

// find from id and update task, redirect back
app.post('/task/:taskid/update', async (req, res) => {
    const task = await Task.findByPk(req.params.taskid,{ logging: false })
    await task.update(req.body);
    await sendTasks(task.ProjectId);
    res.redirect('back');
})

//find from id and destroy task, redirect back
app.get('/task/:taskid/destroy', async (req, res) => {
    const task = await Task.findByPk(req.params.taskid)
    await task.destroy()
    await sendTasks(task.ProjectId);
    res.redirect('back')
})

//assign userid from body to task from id, redirect back
app.post('/task/:taskid/assign', async (req, res) => {
    const task = await Task.findByPk(req.params.taskid,{ logging: false })
    await task.update({UserId: req.body.UserId});
    await sendTasks(task.ProjectId);
    res.redirect('back')
})

app.get('/users', async (req, res)=>{
    const users = await User.findAll();
    res.render('users', {users: JSON.stringify(users)});
})
app.get('/users/:id/delete', async (req, res)=>{
    const user = await User.findOne({where: {id: req.params.id}});
    await user.destroy();
    await sendUsers();
    res.send();
})
app.post('/users/:id/update', async (req, res)=>{
    const user = await User.findOne({where: {id: req.params.id}});
    await user.update(req.body);
    await sendUsers();
    res.redirect('back');
})

app.get('/users/:id', async (req, res)=>{
    const user = await User.findOne({where: {id: req.params.id}});
    const tasks = await Task.findAll({where: {UserId: user.id}});
    const projects = await Project.findAll();
    console.log(user);
    res.render('userProfile', {user: JSON.stringify(user), tasks: JSON.stringify(tasks), projects: JSON.stringify(projects)});
})

const sendUsers = async () =>{
    const users = await User.findAll({ logging: false })
    io.emit('userChange', users);
}
const sendTasks = async (id) =>{
    const tasks = await Task.findAll({ where : {ProjectId : id }});
    io.emit('taskChange', tasks);
}
const sendProjects = async()=>{
    const projects = await Project.findAll();
    io.emit('projectChange', projects);
}
http.listen(process.env.PORT, async () => {
    await sequelize.sync();
    console.log('Listening on', process.env.PORT);
})