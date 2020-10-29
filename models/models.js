const {Model, DataTypes, Sequelize} = require('sequelize');
const path = require('path');
const sequelize = process.env.NODE_ENV === 'test'
    ? new Sequelize('sqlite::memory:', null, null, {dialect: 'sqlite', logging:false})
    : new Sequelize({dialect: 'sqlite', storage: path.join(__dirname, 'data.db')});

class Project extends Model {};
class Task extends Model {};
class User extends Model {};

Project.init(
    {
        name: DataTypes.STRING,
        image: DataTypes.STRING
    },
    {sequelize}
);
Task.init(
    {
        description: DataTypes.STRING,
        status: DataTypes.INTEGER
    },
    {sequelize}
);
User.init(
    {
        name: DataTypes.STRING,
        avatar: DataTypes.STRING
    },
    {sequelize}
)
Project.hasMany(Task, {as: 'tasks'});
Task.belongsTo(Project);
User.hasMany(Task, {as: 'tasks'});

module.exports = {Project, Task, User, sequelize};