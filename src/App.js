import React,{useState,useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import './App.css';
import Activity from './Activity.js';
import QueueActivity from './QueueActivity.js';
import {cloneDbHelper,cloneDbHelper2,updateCollection} from './cloneDbHelper.js';
import ls from 'local-storage';


import {db} from './firebase.js';


function App() {

  const [activities,setActivities] = useState([]);
  const [loggedIn,setLoggedIn] = useState(false);
  const [darkMode,setDarkMode] = useState(false);
  const [devMode,setDevMode] = useState(false);
  const [queueMode,setQueueMode] = useState(false);
  const [queueActivities,setQueueActivities] = useState([]);
  const [commentCheckBoxChecked, setCommentCheckBoxChecked] = React.useState(true);


  const db_collection = db.collection("activityCollection_1");

  const db_queue_collection = db.collection("activityQueueCollection_1");

  useEffect(()=>{

    db_collection.orderBy('timeStamp','asc').onSnapshot(snapshot=>{
      setActivities(snapshot.docs.map(doc=>{
        // debugger;
        let obj=doc.data();
        obj.id=doc.id;
        return obj;
      }));
    });


    db_queue_collection.orderBy('timeStamp','asc').onSnapshot(snapshot=>{
      setQueueActivities(snapshot.docs.map(doc=>{
        let obj=doc.data();
        obj.id=doc.id;
        return obj;
      }));
    });



  },[]);

  const activitySubmit = (event)=>{
    event.preventDefault();
    let text = document.getElementById("App-activity-input");
    if(!loggedIn)
    {
      if(text.value==="i am akc")
        setLoggedIn(true);

      text.value='';
      return;
    }


    db_collection.add({
      activityName: text.value,
      timeStamp: new Date(),
      activityDone:{activityDoneStatus:false,timeStamp:new Date()},
      isComment: commentCheckBoxChecked
    });
    // setActivities([...activities,text.value]);
    text.value='';

  }




  const chooseTheme = (e)=>{
    e.preventDefault();

    if(e.target.innerHTML==="Dark Mode"){
      document.getElementsByTagName("body")[0].style.background = "#212121";
      document.getElementById("App-activity-input").style.background = "grey";
      document.getElementById("App-activity-input").style.borderRadius = "5px";
      setDarkMode(true);
      e.target.innerHTML="Disable";
    }
    else{
     document.getElementsByTagName("body")[0].style.background = "none";
     document.getElementById("App-activity-input").style.background = "none";
     document.getElementById("App-activity-input").style.borderRadius = "none";
     setDarkMode(false);
     e.target.innerHTML="Dark Mode";
   }

 }

 const chooseDevMode=(e)=>{
    e.preventDefault();

    if(devMode){
       
       setDevMode(false);
       e.target.innerText = "Dev Mode"
     }
    else{
       setDevMode(true);
       e.target.innerText = "Normal Mode"

     }


 }

 const chooseQueueMode=(e)=>{

    e.preventDefault();


    if(queueMode){
       setQueueMode(false);
       e.target.innerText = "Queue";
     }
    else{ 
      setQueueMode(true);
      e.target.innerText = "Main";
    }

 }

  const commentCheckBoxHandler = (event) => {
    setCommentCheckBoxChecked(!commentCheckBoxChecked);
  };


 const queueActivitySubmitHandler=(e)=>{
  e.preventDefault();

    let text = document.getElementById("App-activity-input");
    if(!loggedIn)
    {
      if(text.value==="i am akc")
        setLoggedIn(true);

      text.value='';
      return;
    }

    db_queue_collection.add({
      activityName: text.value,
      timeStamp: new Date(),
      activityDone:{activityDoneStatus:false,timeStamp:new Date()}

    });
   
    text.value='';


 }


 // console.log("one");

 return (
  <div className="App">
  <div>
  <form noValidate autoComplete="off">
  <div>  
  <TextField id="App-activity-input" label="Enter Activity" variant="filled" />
  {
  !commentCheckBoxChecked
  ?
  <ChatBubbleOutlineIcon style={darkMode ? {color: "white"} : {color:"black"}} onClick={commentCheckBoxHandler}/>
  :
  <ChatBubbleIcon style={darkMode ? {color: "white"} : {color:"black"}} onClick={commentCheckBoxHandler}/>
  }
  <Button type="submit" onClick={(e)=>{queueMode?queueActivitySubmitHandler(e):activitySubmit(e)}} color="primary">



  submit
  </Button>
  </div>
  <div>
  <button id="App-dark-mode-button" onClick={chooseTheme}>Dark Mode</button>
  <button id="App-dev-mode-button" onClick={chooseDevMode}>Dev Mode</button>
  <button id="App-queue-button" onClick={chooseQueueMode}>Queue</button>


  </div>
  </form>
  </div>

  {
    loggedIn
    &&
    <div className="App-activities-outer-div">
    {

      !queueMode
      ?
      activities.map(activityObj=>{
        return <div key={activityObj.id} keyprop={activityObj.id} className="App-activities">
        <Activity data={activityObj} dark_mode={darkMode} dev_mode={devMode}/>
        </div>
      })
      :
      queueActivities.map(activityObj=>{
        return <div key={activityObj.id} keyprop={activityObj.id} className="App-activities">
        <QueueActivity data={activityObj} dark_mode={darkMode} dev_mode={devMode}/>
        </div>
      })

    }
    </div>
  }


  </div>
  );
}

export default App;
