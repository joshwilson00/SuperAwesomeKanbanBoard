const {Project, Task, User, sequelize} = require('./models');

describe('Project', () => {
    beforeAll(async()=>{
        await sequelize.sync();
    });
    test('should be able to create a new Project', async () => {
        await Project.create({
            name: 'Test Project'
        });
        const projects = await Project.findAll();
        expect(projects.length).toBe(1);
        expect(projects[0].name).toBe('Test Project');
        expect(projects[0] instanceof Project).toBeTruthy();
    })
    test('should be able to create a new Task.', async () => {
        const user = await User.create({
            name: 'Jim',
        });
        const task = await Task.create({
            name: "Go shopping",
            ProjectId: 1,
            UserId: 1
        });
        expect(task instanceof Task).toBeTruthy();
        expect(task.name).toBe('Go shopping');
        //Task should be assigned to a Project
        expect(task.ProjectId).toBe(1);

        const projects = await Project.findOne({where: {id: 1}, include: [{all: true, nested: true}]});
        const users = await User.findOne({where: {id: 1}, include: [{all: true, nested: true}]});
        console.log(users);
        console.log(projects.tasks)
    })
    test('should be able to create a user.', async () => {
        const user = await User.create({
            name: "Josh",
        });
        expect(user instanceof User).toBeTruthy();
        expect(user.name).toBe('Josh');
        await Task.create({
            name: "Test Task",
            ProjectId: 1,
            UserId: 1
        });
    })
    
})
