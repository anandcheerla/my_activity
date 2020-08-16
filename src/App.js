import React,{useState,useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './App.css';

import db from './firebase.js';


function App() {

  const [activities,setActivities] = useState([]);
  const [loggedIn,setLoggedIn] = useState(false);
  const [darkMode,setDarkMode] = useState(false);

  useEffect(()=>{
    db.collection("activityCollection").orderBy('timeStamp','asc').onSnapshot(snapshot=>{
      setActivities(snapshot.docs.map(doc=>{return doc.data()}));
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

    db.collection("activityCollection").add({
      activityName: text.value,
      timeStamp: new Date()
    });
    // setActivities([...activities,text.value]);
    text.value='';

  }

  const calculateDuration = (time_lv)=>{ 

    let currentTs = new Date();
    let activityTs = time_lv.toDate();
    let diff=currentTs-activityTs;
    let minutes=diff/(1000*60);   //1000 is for milli seconds and 60 for seconds

    let uploadedTime;
    if(Math.floor(minutes/60)>0){
      if(Math.floor(minutes/(60*24))>0){
        uploadedTime=Math.floor(minutes/(60*24));
        if(uploadedTime===1)
          uploadedTime+=" day ago";
        else
          uploadedTime+=" days ago";
      }
      else{
        uploadedTime=Math.floor(minutes/60);
        if(uploadedTime===1)
          uploadedTime+=" hour ago";
        else
          uploadedTime+=" hours ago";
      }
    }
    else{
        uploadedTime=Math.floor(minutes); 
        if(uploadedTime<2)
          uploadedTime="Just now";
        else
          uploadedTime+=" min ago";    
    }


    return uploadedTime;



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

  let activity_style_dark_mode={
    "background":"#0F171E",
    "color": "white"
  };

  let activity_style_normal_mode={
    "background":"#F1F1F1",
    "color": "black"
  };


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
              </div>
            </form>
          </div>

          {
          loggedIn
          &&
          <div className="App-activities-outer-div">
            {
              activities.map(activityObj=>{
                return <div style={ darkMode ? activity_style_dark_mode : activity_style_normal_mode} className="App-activities">
                         <div>
                          {activityObj.activityName}
                         </div>
                         <div id="App-activity-duration">
                            { calculateDuration(activityObj.timeStamp) }
                         </div>
                        
                       </div>
              })

            }
          </div>
          }
         

    </div>
  );
}

export default App;
