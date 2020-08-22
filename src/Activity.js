import React,{useState,useEffect} from 'react';
import './App.css';
import './Activity.css';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import DirectionsIcon from '@material-ui/icons/Directions';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import SpeakerNotesOffIcon from '@material-ui/icons/SpeakerNotesOff';   //using this as an uncomment
import Tooltip from '@material-ui/core/Tooltip'; 

import firebase from 'firebase/app';
import 'firebase/firestore';

import {db,fireBaseApp} from './firebase.js';



function Activity(props) {
  // debugger;

  const [activityClicked,setActivtyClicked] = useState(false);
  const [revisitedActivity,setRevisitedActivity] = useState({});
  const [revisitedActivityClicked,setRevisitedActivityClicked] = useState(false);
  const [showActivityInfo,setShowActivityInfo] = useState(false);

  const db_collection = db.collection("activityCollection_1");
  const db_queue_collection = db.collection("activityQueueCollection_1");


  // useEffect(()=>{
  //   // a.update({activityDone:{activityDoneStatus:false,timeStamp:new Date()}});
  //   // let a=db.collection("activityCollection_1").doc(props.data.id);
  //   console.log(props.data.id);
  // },[]);

  const calculateDurationCurTimeAndCreatedTime = (time_lv)=>{ 

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

  const calculateDurationCreatedTimeAndDoneTime = (startTime,endTime)=>{

    let diff=endTime.toDate()-startTime.toDate();;
    let minutes=diff/(1000*60);


    let duration;
    let hours=Math.floor(minutes/60);
    let days=Math.floor(minutes/(60*24));
    minutes=Math.ceil(minutes%60);

    duration=(days!=0 ? (days+(days>1?" days":" day")+" "):"")+(hours!=0 ? (hours+(hours>1?" hours":" hour")+" "):"")+minutes+(minutes>1?" min":" min");
    return duration;
      
  }



  var i=0;
  const recursiveRevisitedActivitiesCompletion=(node)=>{

    if(node){
        // console.log("coming");
        // debugger;
         
         node.get().then(doc=>{
            // debugger;
            if(!doc.data().activityDone.activityDoneStatus)
            {  
              // debugger;
              node.update({activityDone:{activityDoneStatus:true,timeStamp:new Date()}});
              // console.log(i++);
              // console.log(doc.data().revisitedActivity);
              recursiveRevisitedActivitiesCompletion(doc.data().revisitedActivity)
            }
        });
    }

    return;

  }

  const activityCompletionHandler=()=>{

       if(props.data.activityDone.activityDoneStatus)
        db_collection.doc(props.data.id).update({activityDone:{activityDoneStatus:false,timeStamp:new Date()}});
       else
        db_collection.doc(props.data.id).update({activityDone:{activityDoneStatus:true,timeStamp:new Date()}});

      if(props.data.revisitedActivity && !props.data.activityDone.activityDoneStatus){
        recursiveRevisitedActivitiesCompletion(props.data.revisitedActivity);
      }

  }


  const activityRevisitHandler=()=>{

    let revisited_activity = db_collection.doc(props.data.id)
    // debugger;
    db_collection.add({activityName: props.data.activityName ,timeStamp: new Date(), activityDone:{activityDoneStatus:false,timeStamp:new Date()},isComment:props.data.isComment || false,revisitedActivity: revisited_activity});


    let activities = document.getElementsByClassName("App-activities");
    if(activities.length>0){
      activities[activities.length-1].scrollIntoView({behavior: "smooth",block: "center"});      
    }

  }

  const revisitTransitionHandler=(e)=>{
    

    if(props.data.revisitedActivity){
      props.data.revisitedActivity.get().then((doc)=>{
        
        // debugger;
        let activities = [...document.getElementsByClassName("App-activities")];

        activities.forEach((ele)=>{
           if(ele.getAttribute("keyprop") === doc.id)
           {
            // debugger;
            if(ele.style.marginLeft && ele.style.marginLeft==="30px"){
              setRevisitedActivityClicked(false);
              ele.style.marginLeft = "0px";
            }
            else{
              setRevisitedActivityClicked(true);
              ele.scrollIntoView({behavior: "smooth",block: "center"});
              ele.style.marginLeft = "30px";
             

            }

           }
        });


      });
    }


  }

  const addToQueueHandler = ()=>{

      db_queue_collection.add(props.data);

      db_collection.doc(props.data.id).delete();

  }

  //some activities cant be resolved or revisited....like dated activities(in some cases)
  //say activity is supposed to happen today at 3pm, it never happened, you cannot revisit it and cannot complete it then you can use
  //this dismiss activity option,it is still present in the db, the reason being this is introduced, just making that complete
  //doesnot provide any semantic meaning 
  const dismissActivityHandler=()=>{
    let dismissing_doc = db_collection.doc(props.data.id);
    if(props.data.cantResolve)
      dismissing_doc.update({cantResolve: false});
    else
      dismissing_doc.update({cantResolve: true});


  }

  const ToggleCommentHandler=()=>{
    let commenting_doc = db_collection.doc(props.data.id);
    if(props.data.isComment)
      commenting_doc.update({isComment: false});
    else
      commenting_doc.update({isComment: true});

  }

  const deleteActivityHandler = ()=>{

    if(window.confirm("Are you sure?"))
      db_collection.doc(props.data.id).delete();
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
    activityStyle.opacity = "0.6";
  }


  
  // return (
  //   <div>
  //         {props.data.activityName}
  //         <Tooltip title="Delete">
  //             <DeleteIcon className="ui-icons" style={props.dark_mode ? {color: "white"} : {color:"black"}} onClick={deleteActivityHandler}/>
  //           </Tooltip>
  //     </div>
  //   );

  return (
      <div onMouseEnter={()=>setShowActivityInfo(true)} onMouseLeave={()=>setShowActivityInfo(false)} className="Activity-activity">
          <div id="Activity-direction-icon">

          </div>
          <div onClick={(e)=>{revisitTransitionHandler(e)}} style={activityStyle} className="Activity-activity-data">
             <div id="Activity-activity-name">
              {props.data.revisitedActivity ? "Revist @ "+props.data.activityName : props.data.activityName}
             </div>
             <div id="App-activity-time-info">
               <div id="App-activity-creation-time-plus-comment">
                  <div>
                    { calculateDurationCurTimeAndCreatedTime(props.data.timeStamp)}
                  </div>
                  <div>
                    {
                    props.data.isComment
                    &&
                    <InsertCommentIcon style={props.dark_mode ? {color: "white"} : {color:"black"}}/>
                    }
                  </div>
               </div>
               {
                (!props.data.isComment 
                && 
                props.data.activityDone.activityDoneStatus)
                &&
               <div id="App-activity-duration-time">
                  took { calculateDurationCreatedTimeAndDoneTime(props.data.timeStamp,props.data.activityDone.timeStamp)} to finish
               </div>   
               }       
             </div>   

         </div>
         {
          showActivityInfo
          &&
         <div id="Activity-activity-features">
            {
             !props.data.isComment
             &&
            <div>
              <Tooltip title="Done">
                <CheckCircleIcon className="ui-icons" onClick={activityCompletionHandler} style={(props.data.activityDone.activityDoneStatus) ? { color: "green" } : (props.dark_mode ? {color: "white"} : {color:"black"})}/>
              </Tooltip>
            </div>
            }
            <div>
              {
                revisitedActivityClicked
                ?
                <Tooltip title="Revisiting">
                  <PauseCircleFilledIcon className="ui-icons" style={props.dark_mode ? {color: "white"} : {color:"black"}}/>
                </Tooltip>
                :
                <Tooltip title="Revisit">
                  <PlayCircleFilledIcon className="ui-icons" style={props.dark_mode ? {color: "white"} : {color:"black"}} onClick={activityRevisitHandler}/>
                </Tooltip>
              }
            </div>
         </div>
         }
         {
          showActivityInfo
          &&
         <div>
            <Tooltip title="Dismiss">
            <CancelIcon className="ui-icons" style={props.dark_mode ? {color: "white"} : {color:"black"}} onClick={dismissActivityHandler}/>
            </Tooltip>
         </div>
         }

          {
          showActivityInfo
          &&
         <div>
            {
            props.data.isComment
            ?
            <Tooltip title="Uncomment">
              <SpeakerNotesOffIcon className="ui-icons" style={props.dark_mode ? {color: "white"} : {color:"black"}} onClick={ToggleCommentHandler}/>
            </Tooltip>
            :
            <Tooltip title="Comment">
              <InsertCommentIcon className="ui-icons" style={props.dark_mode ? {color: "white"} : {color:"black"}} onClick={ToggleCommentHandler}/>
            </Tooltip>
            }
         </div>
         }

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
            <Tooltip title="Add to Queue">
              <AddBoxIcon className="ui-icons" style={props.dark_mode ? {color: "white"} : {color:"black"}} onClick={addToQueueHandler}/>
            </Tooltip>
         </div>

         }

      </div>

  );
  
}

export default Activity;
