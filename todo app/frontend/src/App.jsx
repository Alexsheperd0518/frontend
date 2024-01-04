import './App.css';
import { useState, useEffect} from 'react';

function App() {
  const [showinput,setshowInput] = useState(false); 
  const [storeinput,setStoreInput] = useState("");
  const [storetask,setStoreTask] = useState([]);
  const [fetchtask,setFetchTask] = useState([]);
  const [detectcheckbox,setDetectCheckBox] = useState({});
  

  // on click the input display function
  const handleInputValue = (e) => {
    setStoreInput(e.target.value);
  }

  // Save API
  const savetask = async (task) =>{
    try {
      const data = await fetch("http://127.0.0.1:3001/savedata", {
      method:"POST",
      headers: {
        'Content-Type': 'application/json',
      }
      ,body : JSON.stringify({
        title:task
      }),
    });
    if (!data.ok){
      throw new Error('Network isuue');
    }
    const result = await data.json();
    fetchTask();
    console.log(result);
    } catch (error) {
      console.error('Error', error);
    }
    
  }

  // add a task function
  const handleClick = () => {
    if (storeinput !== ""){

      savetask(storeinput);
      
     const newTask = [...storetask,storeinput];
     setStoreTask(newTask);
     
    }
    setStoreInput("");
    setshowInput(!showinput);

  }

  //  edit the line function
  const handleToggleEdit = (id) => {
    setStoreTask((prev) => prev.map((item,i) => (i === id ? {...item,editMode: !item.editMode} : item))
    );
  };

  // save the line function
  const handleSave = (id) => {
    setStoreTask((prev) => prev.map((item,i) => (i === id ? {...item,text:item.editText, editMode:false} : item))
    );
  };

  // READ Api
  const fetchTask = async () => {
    const data = await fetch("http://127.0.0.1:3001/gettasks");
    const response = await data.json();
    setFetchTask(response.get_all_records);
  }

const deleteTask = async (id) => {
  try {
    const response = await fetch(`http://127.0.0.1:3001/deltetask/${id}`,{
      method : 'DELETE',
      headers : {
        'Content-Type':  'application/json',
      },
    });
    if (!response.ok){
      throw new Error("Network issue")
;    }

const data = await response.json();
fetchTask();
console.log(data);
  }
  catch(error){
    console.error('Error',error);
  }
};

const  handleCheckboxChange = (taskid) => {
  setDetectCheckBox({...detectcheckbox,[taskid]: !detectcheckbox[taskid],});
}

const handleDeleteRecord = (id) => {
  deleteTask(id);

  
}
  // rendering and updating the page 
  useEffect(() => {
    fetchTask();
  },[]);

 const handleInputChange = (id,value) => {
  setStoreTask((prev) => prev.map((item,i) => (i === id ? {...item, editText: value} : item))
  );
 };
  return (
  <>
    {/* main body */}
    <div className="App">
      <div className='w3-panel middle-adjust w3-light-grey w3-card-4 w3-round-large'>
          {/* top part */}
          <div className='right-content w3-text-white w3-round-large w3-mobile'>
            <h1 style={{fontSize:"55px"}} className="w3-center"><b>My Task</b></h1>
            <p className='w3-xxlarge' style={{marginTop:"-12px"}}>{new Date().toDateString()}</p>
          </div>

          {/* bottom part */}
          <div className="w3-container w3-mobile" style={{marginTop:"-50px"}}>
            <h2>My ToDo List</h2>
            <p>
              You can add multiple task in the list:
            </p>

            <ul className="w3-ul w3-card-4 w3-round-large w3-mobile">
              {
                fetchtask.map((data,index) => (
                <li className="w3-bar" key={data._id}>
                  <div className="w3-bar-item"style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    {
                      data.editMode ?
                      <>
                      <input className="w3-check" type="checkbox" 
                      
                      checked={detectcheckbox[data._id] || false}
                      onChange={() => handleCheckboxChange(data._id)}
                      />

                      <input type="text" value={data.editText} className='w3-margin-left w3-input'
                      style={{margin:"8px",border:"2px solid black"}} onChange={(e) => handleInputChange(index,e.target.value)}/>

                      <button onClick={() => handleSave(index,data.text)}className='w3-button w3-round-large w3-right w3-green w3-xlarge'>Save</button>
                      
                      <button onClick={() => handleSave(index,data.text)}className='w3-button w3-round-large w3-right w3-green w3-xlarge'>Save</button>
                      </>
                      :
                      (
                        <>
                        <div>
                          <input class="w3-check" type="checkbox"
                     checked={detectcheckbox[data._id] || false}
                      onChange={() => handleCheckboxChange(data._id)}
                          
                          />
                          <span className="w3-margin-left w3-xlarge" style={{textDecoration: detectcheckbox[data._id] ? 'line-through' : 'none'}}>{data.title}</span>
                        </div>
            
            {
                detectcheckbox[data._id] ? 
                  <button onClick={()=>handleDeleteRecord(data._id)} className='w3-button w3-round-large w3-amber w3-xlarge' style={{marginRight:"0px"}}
                
                  >
                  Delete
                  </button>
                  :
                  <button onClick={() => handleToggleEdit(index)} className='w3-button w3-round-large w3-blue w3-xlarge' style={{marginRight:"0px"}}>
                  {data.editMode ? 'Save': 'Edit'}
                  </button>
                
            }
                       
                        </>
                      )
                    }
                  </div>
                </li>
                ))
              }
            </ul>
          </div>

          <div className="w3-container w3-margin" style={{display:"flex" ,gap:"20px"}}>
            {/* add a task button */}
            <button type='button' className="w3-button w3-xlarge w3-blue w3-padding w3-round-large" onClick={handleClick}>
              &#43; Add a Task
            </button>

            <div style={{width:"70%"}}>
              {/*conditinal rendering code */}
              {showinput && <input type="text" className='w3-round-large' style={{padding:"15px",border:"2px solid black",width:"100%"}} placeholder="Enter your task"  onChange={handleInputValue}/>
              }
            </div> 
          </div>
          </div>
        </div>
  </>
  );
}

export default App;
