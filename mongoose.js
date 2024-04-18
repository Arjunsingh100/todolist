const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://singharjun05718:Acer%408585@cluster0.qk8lnkq.mongodb.net/bCrypt?retryWrites=true&w=majority&appName=Cluster0');
console.log("successfully connected with database")

const userSchema = new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    actions:[
        {
            type:String,
        }
    ]
});

const userModel = mongoose.model('users', userSchema);

module.exports=userModel;