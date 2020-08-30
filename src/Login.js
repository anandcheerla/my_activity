import React from 'react';
import './Login.css';
import googleICon from './Google_logo.png';
import {Home} from './Home.js';

import {auth,provider} from './firebase.js';

function Login(props){

	const signIn=()=>{
		auth.signInWithPopup(provider).then(res=>{
			props.storeUser(res.user);		//storeUser is a function in App.js
		});
	}

	return (
		<div className="Login">
			<div>
				<Home/>
			</div>
			<div onClick={signIn} className="Login-signin">
				<div><img src={googleICon} width="50px" height="40px"/></div>
				<div>continue with Google</div>
			</div>
			<div id="App-akc-footer">
		       -- AKC --
		    </div>
		</div>
		);

}


export {Login}