This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Advanced Activity Tracker

We can keep track of every activity in a most efficient way with easy to use interface.


## Features

### Activity Creation
Creating an activity is very easy,just like sending a simple message, Real time sync between different devices.

### Revisit Activity
You can even revist activity that was in progess in the past by clicking the play icon.It will create a revisit activity in the current time which points to the revisited past activity.

### Completion Status
You can even save,when a particular activity is done by clicking on the tick icon.It is a toggle icon.
It even has the Recursive completion functionality for the nested revisits.

### Dismiss activity
Sometimes you start an activity but it is not done or not happened at all due to some reasons.For Example,some timed events cannot be revisited,it can be dismissed by clicking the cross icon.The best thing is that the activity wont disappear.

### Queue
There is also a queue tab,where you can keep the things/activities that comes to your mind,but you are not doing it at that point in time.Those can be created in queue tab and you can move/add them to the main activity tab whenever you are pursuing them.

### Comment/Note
You can even turn the activity into comment/note instead of a timed activity.

### Dark Mode
Dark mode reduces strain on eyes.

## Functionality/Rules

#### Commented activity cannot have completion status as the main purpose of comment/note is just for reference.
#### Last Nested revisit completion makes all the nested revisits complete,where as vice versa is not possible.
#### Dismissed activity also doesnot have completion status as the main purpose of creating dismissed activity is for unresolved tasks
#### Clicking on revisited Activity brings you to the immediate revisit activity/normal activity on which revisit is created.
#### Revisited Activities start with "Revisit @" and the play icon gets paused when you click on the activity,which indicates the revisiting is happening currently.Click again to get back to the normal mode





