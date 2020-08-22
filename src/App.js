import React,{useState,useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
      activityDone:{activityDoneStatus:false,timeStamp:new Date()}
    });
    // setActivities([...activities,text.value]);
    text.value='';

  }




  const chooseTheme = (e)=>{
    e.preventDefault();

    if(e.target.innerHTML==="Dark mode"){
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
     e.target.innerHTML="Dark mode";
   }

 }

 const chooseDevMode=(e)=>{
    e.preventDefault();


    if(devMode)
       setDevMode(false)
    else
       setDevMode(true) 


 }

 const chooseQueueMode=(e)=>{

    e.preventDefault();


    if(queueMode)
       setQueueMode(false)
    else
       setQueueMode(true) 

 }

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
  <Button type="submit" onClick={(e)=>{queueMode?queueActivitySubmitHandler(e):activitySubmit(e)}} color="primary">
  submit
  </Button>
  </div>
  <div>
  <button id="App-dark-mode-button" onClick={chooseTheme}>Dark mode</button>
  <button id="App-dev-mode-button" onClick={chooseDevMode}>Dev mode</button>
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
