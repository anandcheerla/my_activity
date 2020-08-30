import React from 'react';
import './Instructions.css'

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import SpeakerNotesOffIcon from '@material-ui/icons/SpeakerNotesOff';

 function Instructions(props){


 	return (
 			<div id="instructions">
 				
 				<div>
 					<div className="Instruction-info-1">
	 				<PlayCircleFilledIcon/>
	 				<div>Revisit Activity</div>
	 				</div>
	 				<div>When you want to revisit the activity that was started in the past which was not finished.Clicking this icon makes a revisted activity at the current time.</div>
	 			</div>
	 			<div>
	 				<div className="Instruction-info-1">
	 				<CheckCircleIcon/>
	 				 <div>Activity Done</div>
	 				 </div>
	 				 <div>When the activty that was started in the past has finished.Clicking this icon makes the activity as completed by making it Green. It also recursively makes all the nested revisited activities as complete.</div>
	 			</div>
	 			<div>
	 				<div className="Instruction-info-1">
					<PauseCircleFilledIcon/> 
					<div>Revisiting Activity</div>
					</div>
					<div>It explains that the activity is getting revisited.It appears when ever you click on revisited activty.</div>
				</div>
				<div>
					<div className="Instruction-info-1">
	 				<CancelIcon/> 
	 				<div>Dismiss the activity</div>
	 				</div>
	 				<div>The activity was started in the past but due to some reasons it can't be resolved or revisited at all.You can dismiss those activities.Example some timely events or activities that needs to be done on that particular day/time can't be revisited or resolved!!</div>
	 			</div>
	 			<div>
	 				<div className="Instruction-info-1">
					<DeleteIcon/> 
					<div>Delete the activity</div>
					</div>
					<div>Delete the activity permanently!!!</div>
				</div>
				<div>
					<div className="Instruction-info-1">
					<AddBoxIcon/> 
					<div>Add to Queue or Main</div>
					</div>
					<div>Adding from Queue to main or vice versa</div>
				</div>
				<div>
					<div className="Instruction-info-1">
					<InsertCommentIcon/> 
					<div>Make the activity as comment</div>
					</div>
					<div>It makes the activity as comment/note instead of an activity(that needs to be worked on).Like General things that pops in your head(ex: tony stark is ironman) or any other information that you come across.</div>
				</div>
				<div>
					<div className="Instruction-info-1">
					<SpeakerNotesOffIcon/> 
					<div>Undo the activity as Comment</div>
					</div>
					<div>It undo the comment</div>
				</div>
				<div>
					Note: When you want to go to the activity/time where it is revisiting from.Clicking on the revisited activity that starts with 'Revist@' takes you to the original activity.
				</div>
			</div>
 		);
 }

 export {Instructions}