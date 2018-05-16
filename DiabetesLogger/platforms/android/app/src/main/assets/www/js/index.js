firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.

    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
  
/**
     * Sends an email verification to the user.
     */
    function sendEmailVerification() { //firebase function to send verification email to user
      // [START sendemailverification]
      firebase.auth().currentUser.sendEmailVerification().then(function() { // this will send it to only current user who is singed in 
        // Email Verification sent!
        // [START_EXCLUDE]
        tellAppInventor('Email Verification Sent!'); // if all is good it will send the message 
        // [END_EXCLUDE]
      });
      // [END sendemailverification]
    }
    function sendPasswordReset() { // function for resetting password this is implemented as on-click button. 
      var email = document.getElementById('email_field').value; // this is getting value from the element from the email input box
      // [START sendpasswordemail]
      firebase.auth().sendPasswordResetEmail(email).then(function() { // this will trigger the firebase reset password function using the new object
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        window.alert('Password Reset Email Sent!'); // this will send the alert on the screen 
        // [END_EXCLUDE]
      }).catch(function(error) { // using this function will catch the error 
        // Handle Errors here.
        var errorCode = error.code; // setting the variable to new object 
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') { // by using the if statement it identify if the email was correct or not and is it authorised in database system  
          tellAppInventor(errorMessage); // if is wrong send error message 
        } else if (errorCode == 'auth/user-not-found') { // else show message of no user found 
          tellAppInventor(errorMessage);
        }
        console.log(error); // this will also log in to the console screen
        // [END_EXCLUDE]
      });
      // [END sendpasswordemail];
    }

function nextPage(){
	var page = document.getElementById('nxtP').value; // button function for going next page or located page. 
	window.location ="index2.html"
}
function nextPage2(){
	var page = document.getElementById('nxtA').value;
	window.location ="index3.html"
}

firebase.auth().onAuthStateChanged(function(user) { // this function will direct the user if they successfully login to the system. 
  if (user) { 
    // User is signed in.
	window.location = "main.html" // this will where it will be directed, if user login successfully 

  //  document.getElementById("user_div").style.display = "block";
   // document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser; // creating new object for user

    if(user != null){ // by using this it says if the user logged in show email

      var email_id = user.email; // showing email in the html page 
    }

  } else { 
    // if No user is signed in.
	
    //document.getElementById("user_div").style.display = "none";
   document.getElementById("login_div").style.display = "block"; // direct them to login box container

  }
});

function login(){ // login fuction using firebase 

  var userEmail = document.getElementById("email_field").value; // getting element value from email input box
  var userPass = document.getElementById("password_field").value; // getting element value from password input box

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) { // sign in  to the firebase by getting the new object if the user has account 
    // Handle Errors here.
    var errorCode = error.code; // this is storing new object
    var errorMessage = error.message; 
	  
    window.alert("Error : " + errorMessage); // if the use is not authorised or user that is not register to this applications database then it will show the errors 

    // ...
  });

}

  function signOutBtn(){ // sign out function licked to onlick button 
      
    firebase.auth().signOut().then(function() { // if user sign out, then sign out from firebase database 
      window.location = "index.html" // direct the user back to main login screen if user logged out. 
      // Sign-out successful.
      console.log('Signed Out'); // show message in console 
    }).catch(function(error) { // catch error
      // An error happened.
      console.error('Sign Out Error', error); // if the sign out button now worked this will show errors. 
      alert(error.message);
    });

  }



