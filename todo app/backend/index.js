import { connectDB } from './database/database.js'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
import { Task } from './models/todoapp.js';
import { MongoClient } from 'mongodb';
const port = 3001

connectDB();
app.use(express.json());
app.use(bodyParser.json());


// CREATE DATA
app.post('/savedata', async (req,res) => {
  const data = req.body;
  console.log(req.body);
  try {
    const savedata = new Task({
      title:data.title,
    });
    await savedata.save();
    res.status(201).json({message: "Data saved",savedata})
  } catch (error) {
    console.error("Error saving data:",error);
  }
})

// READ DATA
app.get('/gettasks', async (req,res) => {
  try {
    const get_all_records = await Task.find();
    res.status(200).json({message: "Successfully fetch all tasks",get_all_records});
  } catch (error) {
     console.error("Error saving data:",error);
    
  }
});

//UPDATE DATA

app.put("/updatetask", async (req,res) => {
  const {newtask} = req.body;
  if (newtask !== "" || newtask !== undefined){
    await Task.findByIdAndUpdate(req.user_.id,{
      $set :{
        title : newtask,
      },
    });
    res.send({message:"Your new task update successfully"});

  }
  else{
    res.send({message:"Something went wrong"});
  }
})


// DELETE DATA 
app.delete("/deltetask/:id", async (req,res) => {
  const taskid = req.params.id;
  try{
    const deletetask = await Task.findByIdAndDelete(taskid);

    if (!deletetask) {
      return res.status(404).json({message: 'Reconrd not found'});
    }
    res.json({message: 'Record deleted successfully'});
  }
  catch(error){
    console.error('Error',error);
    res.status(500).json({message: 'Internal server error'});
  }
});

app.get('/', (req, res) => {
  
  res.send('MongoDB is now connected')
})



app.listen(port, () => {
 
  console.log(`Express app listening on port ${port}`)
})