import React,{useState,useEffect} from 'react';
import './App.css';
import './Activity.css';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';



import db from './firebase.js';



function Activity(props) {
  // debugger;

  const [activityClicked,setActivtyClicked] = useState(false);

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

  const activityCompletionHandler=()=>{

       if(props.data.activityDone)
        db.collection("activityCollectionTest").doc(props.data.id).update({activityDone:false});
       else
        db.collection("activityCollectionTest").doc(props.data.id).update({activityDone:true});

  }

  
  let activity_style_dark_mode={
    "background":"#0F171E",
    "color": "white"
  };

  let activity_style_normal_mode={
    "background":"#F1F1F1",
    "color": "black"
  };

  // let black

  return (
      <div className="Activity-activity">

          <div style={ props.dark_mode ? activity_style_dark_mode : activity_style_normal_mode} className="Activity-activity-data">
             <div>
              {props.data.activityName}
             </div>
             <div id="App-activity-duration">
                { calculateDuration(props.data.timeStamp) }
             </div>
         </div>
         <div>
            <CheckCircleIcon onClick={activityCompletionHandler} style={props.data.activityDone ? { color: "green" } : (props.dark_mode ? {color: "white"} : {color:"black"})}/>
         </div>

      </div>

  );
  
}

export default Activity;
