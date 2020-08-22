import {db} from './firebase.js';
import ls from 'local-storage';

function sleep(ms) {
	// console.log("akc");
  return new Promise(resolve => setTimeout(resolve, ms));


}


function cloneDbHelper(fromClone,toClone){
	fromClone.get().then(snapshot=>{
      let data = [...snapshot.docs];

      let temp_map = new Map();

      let final_clone=[];
      data.forEach((doc)=>{
      	temp_map.set(doc.data().activityName,doc.data());
      });


	for(let value of temp_map.values()){
		final_clone.push(value);
	}


	ls.set("clone2",final_clone);


      // console.log(final_clone.length);

      

    });

}



// async function cloneDbHelper2(array_data,toClone){

// 	let arr = await Promise.all(array_data.map(async doc=>{
//         let obj=doc;
//         let a={activityName: obj.activityName,timeStamp:obj.timeStamp}
//         if(obj.activityDone)
//         	a.activityDone = obj.activityDone;
//         else
//         	a.activityDone = false
//         if(obj.revisitedActivity)
//         	a.revisitedActivity = obj.revisitedActivity;

//         // console.log(a);
//         var temp_v = await sleep(1000);
//         // console.log("---------------------------------------");
//         return a;
//         // toClone.add(a);

//       }));


// 	console.log(arr);

// }

async function cloneDbHelper2(array_data,toClone){

	let l=array_data.length;
	let k=0;
	for(let i=0;i<l;i++){
        let obj=array_data[i];
        // debugger;
        let ts = new Date(obj.timeStamp.seconds*1000);
        let a={activityName: obj.activityName,timeStamp:ts}
        if(obj.activityDone)
        	a.activityDone = obj.activityDone;
        else
        	a.activityDone = false
        if(obj.revisitedActivity)
        	a.revisitedActivity = obj.revisitedActivity;

       
        await sleep(1000);
         console.log(k++);
        
        toClone.add(a);

      }

	// console.log(arr);

}


function updateCollection(toCollection,obj){
	// db_collection.doc(props.data.id)
	// toCollection.update(obj);
}

function getCollectionCount(col){

	col.get().then(snapshot=>{
		 let data = [...snapshot.docs];
		 console.log(data.length);
	});
}

export {cloneDbHelper,cloneDbHelper2,updateCollection};