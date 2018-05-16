

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
    function sendEmailVerification() {
      // [START sendemailverification]
      firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        tellAppInventor('Email Verification Sent!');
        // [END_EXCLUDE]
      });
      // [END sendemailverification]
    }
	
function nextPage3(){
	var page = document.getElementById('nxtA').value;
	window.location ="index.html"
}



firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
	window.location = "pAdmin.html"

  //  document.getElementById("user_div").style.display = "block";
   // document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){

      var email_id = user.email;
	 
    }

  } else {
    // No user is signed in.
	
    //document.getElementById("user_div").style.display = "none";
   document.getElementById("login_div").style.display = "block";

  }
});

function login(){
  
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;


  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}





  function signOutBtn(){   
    firebase.auth().signOut().then(function() {
      window.location = "index.html"
      // Sign-out successful.
      console.log('Signed Out');
    }).catch(function(error) {
      // An error happened.
      console.error('Sign Out Error', error);
      alert(error.message);
    });

  }



