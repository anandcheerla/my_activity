import React,{useState,useRef} from 'react';
import './Login.css';
import googleICon from './Google_logo.png';
// import {Home} from './Home.js';
import {Instructions} from './Instructions.js';
import {Logo} from './Logo.js';

import {auth,provider} from './firebase.js';

function Login(props){

	const [instructionClicked,setInstructionsClicked] = useState(false);

	// const insButton = useRef();

	// debugger;
	const signIn=()=>{
		auth.signInWithPopup(provider).then(res=>{
			props.storeUser(res.user);		//storeUser is a function in App.js
		});
	}

	const instructionsButtonHandler=()=>{
		if(!instructionClicked)
			document.getElementById("Login-app-instructions-heading").innerText="Hide";
		else
			document.getElementById("Login-app-instructions-heading").innerText="Instructions";
		setInstructionsClicked(!instructionClicked);
		// console.log(insButton.value);

		
	}

	

	return (
		<div className="Login">
			<div>
				<Logo/>
			</div>
			<div onClick={signIn} className="Login-signin">
				<div><img src={googleICon} width="50px" height="40px"/></div>
				<div>continue with Google</div>
			</div>
			
			<div id="Login-app-instructions-heading" onClick={instructionsButtonHandler}>Instructions</div>
			{
			instructionClicked &&
			<Instructions/>
			}
			<div id="App-akc-footer">
		       -- AKC --
		    </div>
		</div>
		);

}


export {Login}