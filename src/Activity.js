import React,{useState,useEffect} from 'react';
import './App.css';
import './Activity.css';


// import db from './firebase.js';



function Activity(props) {

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

  

  window.onclick = function(event) {
    let modal = document.getElementById("myModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  const modalOpen = ()=>{

    // debugger;
    let modal=document.getElementById("myModal");
    modal.style.display = "block";
  }

  const rememberMe = ()=>{
    let duration = document.getElementById("remember-me-time").value;
    if(duration === "")
      duration=5;
    else
      duration=Number(duration);

    setTimeout(function(){
      alert("hey");
    },duration*1000*60);

     let modal = document.getElementById("myModal");
     modal.style.display = "none";

  }

  return (
      <div className="Activity-activity">

          <div onClick={modalOpen} className="Activity-activity-data">
             <div>
              {props.activityName}
             </div>
             <div id="App-activity-duration">
                { calculateDuration(props.activtyTimestamp) }
             </div>
         </div>

         {

          <div id="myModal" className="modal">
              <div id="modal-content-id" className="modal-content">
                <p>Remember me in <input id="remember-me-time" placeholder="5" type="text"/>minutes</p><button onClick={rememberMe}>Go</button>
              </div>
          </div>
         }

      </div>



  );
  
}

export default Activity;
