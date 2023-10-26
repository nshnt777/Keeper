import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

async function dbConnect(){
    await mongoose.connect("mongodb://127.0.0.1:27017/KeeperNotes")
    .then((result) => {
        console.log("Connected to Database");
    }).catch((err) => {
        console.log("Error: "+err);
    });  
}
dbConnect();

const noteSchema = new mongoose.Schema({
    content: String,
    key: Number,
    title: String
});
const NoteModel = mongoose.model("note", noteSchema);


app.get('/getNotes', async(req,res)=>{
    try {
        const allNotes = await NoteModel.find({});
        console.log(allNotes);
        res.status(200).send(allNotes);
    } catch (error) {
        console.log(error);
    }
});

app.post('/addNote', async(req,res)=>{
    console.log(req.body);
    const {title, content, key }= req.body;

    const note = new NoteModel({
        key: key,
        title: title,
        content: content
    });

    await note.save()
    .then(async(result) => {
        console.log("Note saved.");
        try {
            const newNote = await NoteModel.find({key: key});
            console.log(newNote);
            res.status(200).send(newNote);
        } catch (error) {
            console.log(error);
        }
    }).catch((err) => {
        console.log(err);
    });


});

app.post('/deleteNote', async(req,res)=>{
    console.log(req.body);
    await NoteModel.deleteOne({key: req.body.id})
    .then((result) => {
        console.log(result);
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
});

app.listen(port, ()=>{
    console.log('Listening at port http://localhost:'+port);
});