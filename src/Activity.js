import React,{useState} from 'react';
import './App.css';
import './Activity.css';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import DirectionsIcon from '@material-ui/icons/Directions';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';



import db from './firebase.js';



function Activity(props) {
  // debugger;

  const [activityClicked,setActivtyClicked] = useState(false);
  const [revisitedActivity,setRevisitedActivity] = useState({});
  const [revisitedActivityClicked,setRevisitedActivityClicked] = useState(false);
  const [showActivityInfo,setShowActivityInfo] = useState(false);

  const db_collection = db.collection("activityCollection_1");
  const db_queue_collection = db.collection("activityQueueCollection_1");



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

  var i=0;
  const recursiveRevisitedActivitiesCompletion=(node)=>{

    if(node){
        // console.log("coming");
        // debugger;
         
         node.get().then(doc=>{
            // debugger;
            if(!doc.data().activityDone)
            {  
              // debugger;
              node.update({activityDone: true});
              // console.log(i++);
              // console.log(doc.data().revisitedActivity);
              recursiveRevisitedActivitiesCompletion(doc.data().revisitedActivity)
            }
        });
    }

    return;

  }

  const activityCompletionHandler=()=>{

       if(props.data.activityDone)
        db_collection.doc(props.data.id).update({activityDone:false});
       else
        db_collection.doc(props.data.id).update({activityDone:true});

      if(props.data.revisitedActivity && !props.data.activityDone){
        recursiveRevisitedActivitiesCompletion(props.data.revisitedActivity);
      }

  }


  const activityRevisitHandler=()=>{

    let revisited_activity = db_collection.doc(props.data.id)
    // debugger;
    db_collection.add({activityName: props.data.activityName ,timeStamp: new Date(),revisitedActivity: revisited_activity});


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
    dismissing_doc.update({cantResolve: true});

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
    activityStyle.opacity = "0.4";
  }


  
  

  return (
      <div onMouseEnter={()=>setShowActivityInfo(true)} onMouseLeave={()=>setShowActivityInfo(false)} className="Activity-activity">
          <div id="Activity-direction-icon">

          </div>
          <div onClick={(e)=>{revisitTransitionHandler(e)}} style={activityStyle} className="Activity-activity-data">
             <div id="Activity-activity-name">
              {props.data.revisitedActivity ? "Revist @ "+props.data.activityName : props.data.activityName}
             </div>
             <div id="App-activity-duration">
                { calculateDuration(props.data.timeStamp) }
             </div>
         </div>
         {
          showActivityInfo
          &&
         <div id="Activity-activity-features">
            <div>
              <CheckCircleIcon onClick={activityCompletionHandler} style={(props.data.activityDone) ? { color: "green" } : (props.dark_mode ? {color: "white"} : {color:"black"})}/>
            </div>
            <div>
              {
                revisitedActivityClicked
                ?
                <PauseCircleFilledIcon style={props.dark_mode ? {color: "white"} : {color:"black"}}/>
                :
                <PlayCircleFilledIcon style={props.dark_mode ? {color: "white"} : {color:"black"}} onClick={activityRevisitHandler}/>
              }
            </div>
         </div>
         }
         {
          showActivityInfo
          &&
         <div>
            <CancelIcon style={props.dark_mode ? {color: "white"} : {color:"black"}} onClick={dismissActivityHandler}/>
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
            <DeleteIcon style={props.dark_mode ? {color: "white"} : {color:"black"}} onClick={deleteActivityHandler}/>
            <AddBoxIcon style={props.dark_mode ? {color: "white"} : {color:"black"}} onClick={addToQueueHandler}/>
         </div>

         }

      </div>

  );
  
}

export default Activity;
