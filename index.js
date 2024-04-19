const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');
// const url = require('url')


const userModel = require('./mongoose');
const { title } = require('process');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static(__dirname + '/public'));

app.get('/register', (req, res) => {
    res.render('register.ejs');
})
app.get('/', (req, res) => {
    res.render('login.ejs');
})

app.get('/todo', (req, res) => {
    res.send('you have successfully login to todo list');
})

app.post('/register', async (req, res) => {
    try {
        const getDuplicate = await userModel.find({username: req.body.username});
            if(getDuplicate.length === 0){
                bcrypt.hash(req.body.password, 10, async (err, hash) => {

                    const data = new userModel({ username: req.body.username, password: hash });
                    const result = await data.save();
                    res.redirect('/register');
                })
            }
            else{
                res.send('<h1>This user already exists, so please try with another username</h1>')
            }
    }
    catch (error) {
        res.status(500).json({ msg: error });
    }

})

app.post('/login', async (req, res, next) => {
    try {

        const data = await userModel.find();
        const result1 = data.filter((ele) => {
            if (req.body.username === ele.username) {
                return ele;
            }
        })
        const passwordCompare = await bcrypt.compare(req.body.password, result1[0].password);
        // console.log(passwordCompare)
        if (passwordCompare) {
            res.render('todo', { result1: result1, title: 'Todolist' });
        }
        else{
            res.send('<h2>You have entered wrong credentials, please enter valid username and password<h2>')
        }
         
    }
    catch (error) {
        res.send('you have enterd wrong credentials');
    }
})

app.post('/addtask', async (req, res) => {
    // console.log(req.body)
    const data = await userModel.find({ username: req.body.key });
    data[0].actions.push(req.body.content);
    const insertData = new userModel(data[0]);
    const result = await insertData.save();
    const result1 = await userModel.find({ username: req.body.key });
    res.render('todo', { result1: result1, title: 'Todolist' });
    // console.log(data);
    // console.log(req.body);

})

app.post('/remove', async (req, res) => {

    const data = await userModel.find({ username: req.body.user });
    data[0].actions.splice(req.body.id, 1);
    const updateData = new userModel(data[0]);
    await updateData.save();
    const result1 = await userModel.find({ username: req.body.user });
    res.render('todo', { result1: result1, title: 'Todolist' });

})


app.put('/editTask', async (req, res) => {
    try {
        // console.log(req.query)
        // console.log(req.body)
        const task = req.body.taskName;
        const startIndex = Number(req.query.index);
        let taskList = await userModel.findOne({ _id: req.query.id });
        let undatedTaskList = taskList.actions.splice(startIndex, 1, task);
        await userModel.findOneAndUpdate({ _id: req.query.id }, { $set: { username: taskList.username, password: taskList.password, actions: taskList.actions } })
        let tasks = await userModel.findOne({ _id: req.query.id });
        res.status(200).json({ item: taskList.actions, undatedTaskList: undatedTaskList, result: tasks });
    }
    catch (error) {
        res.status(500).json({ error: error })
    }
})

app.get('/getSingleTask', async (req, res) => {
    try {
        const singleData = await userModel.findOne({ _id: req.query.id });
        res.status(200).json({ singleData: singleData });
    }
    catch (error) {
        res.status(500).json({ error: error })
    }
})

app.listen(3000, () => {
    console.log('server has started on port no 3000');
})
