import React,{useState} from 'react';
import './App.css';
import './Activity.css';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Tooltip from '@material-ui/core/Tooltip'; 


import {db} from './firebase.js';


function QueueActivity(props) {

  const [activityClicked,setActivtyClicked] = useState(false);
  const [revisitedActivity,setRevisitedActivity] = useState({});
  const [revisitedActivityClicked,setRevisitedActivityClicked] = useState(false);
  const [showActivityInfo,setShowActivityInfo] = useState(false);

  const db_mainActivity_collection = db.collection("mainActivity");

  const db_queueActivity_collection = db.collection("queueActivity");

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


  const deleteActivityHandler = ()=>{

    if(window.confirm("Are you sure?"))
      db_queueActivity_collection.doc(props.data.id).delete();
  }

  const addActivityToMainActivitiesHandler = ()=>{

    db_mainActivity_collection.add({
      activityName: props.data.activityName,
      timeStamp: new Date(),
      activityDone: props.data.activityDone || false,
      isComment: props.data.isComment || false,
      username: props.user_prop.username
    });
    db_queueActivity_collection.doc(props.data.id).delete();

  }


  
  let activity_style_dark_mode={
    "background":"#0F171E",
    "color": "white"
  };

  let activity_style_normal_mode={
    "background":"#F1F1F1",
    "color": "black"
  };


  let activityStyle = {
    
  }

  if(props.dark_mode){
    activityStyle.background = "#0F171E";
    activityStyle.color = "white";
  }
  else{
    activityStyle.background = "#F1F1F1";
    activityStyle.color = "black";
  }

  if(props.data.cantResolve){
    activityStyle.opacity = "0.4";
  }


  
  return (
      <div onMouseEnter={()=>setShowActivityInfo(true)} onMouseLeave={()=>setShowActivityInfo(false)} className="Activity-activity">

          <div style={activityStyle} className="Activity-activity-data">
             <div id="Activity-activity-name">
              {props.data.activityName}
             </div>
             <div id="App-activity-creation-time">
                { calculateDuration(props.data.timeStamp) }
             </div>
         </div>
          
         {
          
          (
          showActivityInfo
          &&
          props.dev_mode
          )
          &&
         <div>
            <Tooltip title="Delete">
              <DeleteIcon className="ui-icons" style={props.dark_mode ? {color: "white"} : {color:"black"}} onClick={deleteActivityHandler}/>
            </Tooltip>
         </div>

         }

          {
          showActivityInfo
          &&
         <div>
            <Tooltip title="Add to Main">
              <AddCircleOutlineIcon className="ui-icons" style={props.dark_mode ? {color: "white"} : {color:"black"}} onClick={addActivityToMainActivitiesHandler}/>
            </Tooltip>
         </div>

         }



      </div>

  );
  
}

export default QueueActivity;
