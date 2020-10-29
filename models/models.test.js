const {Project, Task, User, sequelize} = require('./models');

describe('Project', () => {
    beforeAll(async()=>{
        await sequelize.sync();
    });
    test('should be able to create a new Project', async () => {
        await Project.create({
            name: 'Test Project'
        });
        await Project.create({
            name: 'Week1'
        });
        const projects = await Project.findAll();
        expect(projects.length).toBe(2);
        expect(projects[0].name).toBe('Test Project');
        expect(projects[0] instanceof Project).toBeTruthy();
        expect(projects[1].name).toBe('Week1');
        expect(projects[1] instanceof Project).toBeTruthy();
    });
    test('should be able to create users.', async () => {
        await User.create({
            name: 'Jim',
        });
        await User.create({name: 'Bob'});
        const users = await User.findAll();
        expect(users[0].name).toBe('Jim');
        expect(users[0] instanceof User).toBeTruthy();
        expect(users[1].name).toBe('Bob');
        expect(users[1] instanceof User).toBeTruthy();
        expect(users.length).toBe(2);
    })
    
    test('should be able to create a new Task.', async () => {
        await Task.create({
            description: "Go shopping",
            status: 0,
            ProjectId: 1,
            UserId: 1
        });
        await Task.create({
            description: "Go test",
            ProjectId: 2,
            UserId: 1
        });
        await Task.create({
            description: "test1234",
            ProjectId: 2,
            UserId: 2
        });
        const tasks = await Task.findAll();
        expect(tasks[0] instanceof Task).toBeTruthy();
        expect(tasks[0].description).toBe('Go shopping');
        //Task should be assigned to a Project
        expect(tasks[0].ProjectId).toBe(1);
    });
    test('Project should contain all the tasks.', async () => {
        const projects = await Project.findAll({include: [{all: true, nested: true}]});
        expect(projects[0].tasks[0].description).toBe('Go shopping');
        expect(projects[0].tasks[0].status).toBe(0);
    });
    test('User should know all the tests its assigned to.', async () => {
        const users = await User.findAll({include: [{all: true, nested: true}]});
        console.log(users);
        expect(users[0].tasks[0].description).toBe('Go shopping');
    })
    
})
