import React,{useState,useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './App.css';
import Activity from './Activity.js';
import {cloneDbHelper,cloneDbHelper2,updateCollection} from './cloneDbHelper.js';
import ls from 'local-storage';


import db from './firebase.js';


function App() {

  const [activities,setActivities] = useState([]);
  const [loggedIn,setLoggedIn] = useState(false);
  const [darkMode,setDarkMode] = useState(false);
  const [devMode,setDevMode] = useState(true);


  // debugger;

  // updateCollection(db.collection("activityCollection_1"),{cantResolve: false});

  // return (<div>AKC</div>);

  const db_collection = db.collection("activityCollection_1");

  useEffect(()=>{
     // console.log("two");

    db_collection.orderBy('timeStamp','asc').onSnapshot(snapshot=>{
      // debugger;
      setActivities(snapshot.docs.map(doc=>{
        let obj=doc.data();
        obj.id=doc.id;
        return obj;
      }));
    });

    // console.log(activities);

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
      activityDone: false
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


 // console.log("one");

 return (
  <div className="App">
  <div>
  <form noValidate autoComplete="off">
  <div>  
  <TextField id="App-activity-input" label="Enter Activity" variant="filled" />
  <Button type="submit" onClick={activitySubmit} color="primary">
  submit
  </Button>
  </div>
  <div>
  <button id="App-dark-mode-button" onClick={chooseTheme}>Dark mode</button>
  <button id="App-dev-mode-button" onClick={chooseDevMode}>Dev mode</button>

  </div>
  </form>
  </div>

  {
    loggedIn
    &&
    <div className="App-activities-outer-div">
    {
      activities.map(activityObj=>{
        return <div key={activityObj.id} keyprop={activityObj.id} className="App-activities">
        <Activity data={activityObj} dark_mode={darkMode} dev_mode={devMode}/>
        </div>
      })

    }
    </div>
  }


  </div>
  );
}

export default App;
