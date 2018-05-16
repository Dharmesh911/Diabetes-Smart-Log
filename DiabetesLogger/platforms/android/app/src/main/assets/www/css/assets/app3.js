// Initialize Firebase
	var config = {
    apiKey: "AIzaSyBHP48kjdW-YzKCdZA_-TcVnni-NlCZZ8Q",
    authDomain: "diabetesapp-ee8fa.firebaseapp.com",
    databaseURL: "https://diabetesapp-ee8fa.firebaseio.com",
    projectId: "diabetesapp-ee8fa",
    storageBucket: "diabetesapp-ee8fa.appspot.com",
    messagingSenderId: "769133104242"
		  };
		  firebase.initializeApp(config);

		  var database = firebase.database();

	//FIREBASE END ----------------------

		//	DISPLAY CURRENT TIME --------------------
	

	function publishTime (){
		var currentTimeFormat = "hh:mm:ss A";
		var currentTime = moment(moment(), currentTimeFormat);
		var currentTimeFormatted = currentTime.format(currentTimeFormat);
		$('#theTime').html('Current Time: ' + currentTimeFormatted)
		};

	setInterval(publishTime, 1000);

	//	DISPLAY CURRENT TIME END --------------------

$(document).ready(function() {

	var key;//empty key variable for storing key in focues when updating

	function resetKey(){//reseting key variable after update is done
		key = '';
	};

	$('.submit').click(function(){
		event.preventDefault();
		var email = document.getElementById("email").value;
		var pass = document.getElementById("password").value;
		firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
		console.log(error.message);
  });
		var newFullName = $('#FullName').val().trim();
		var newAddress = $('#Address').val().trim();
		var newEmail = $('#email').val().trim();
		var newPassword = $('#password').val().trim();
		var newPcode = $('#Pcode').val().trim();
		var newDate = $('#Date').val().trim();

		var newTime = $('#time').val().trim();
		var newTelephone = $('#Telephone').val().trim();

		// if any input in form is blank, alert and stop code:
		if (newFullName === ''|| newAddress === ''||newEmail === ''||newPassword === ''||newPcode === ''||newDate === ''||newTime === ''||newTelephone === ''){
			$('.addFormAlert').css('display','initial')
			return;
		}
		else {
			$('.addFormAlert').css('display','none')
		};

		// store new log values to firebase:

		database.ref("User").push({

			FullName: newFullName,
			Address: newAddress,
			PostCode: newPcode,
			Email: newEmail,
			Password: newPassword,
			Date: newDate,
			Time: newTime,
			Telephone: newTelephone,
			dateAdded: firebase.database.ServerValue.TIMESTAMP,
		});

		//clear form after submission:
		for (var i = 0; i < $('form').length; i++) {
			$('form')[i].reset();
		};

		emptyTableBody();//empty table
		database.ref("User").orderByChild("dateAdded").on("child_added", function(snapshot){

			var FBname = snapshot.val().FullName;//capture medication name from firebase
			var FBadd = snapshot.val().Address;
			var FBpost = snapshot.val().PostCode;
			var FBemail = snapshot.val().Email;
			var FBpass = snapshot.val().Password;
			var FBdate = snapshot.val().Date;
			var FBtime = snapshot.val().Time;//capture time from firebase
			var FBtel = snapshot.val().Telephone;//capture frequency from firebase
			
			
			var FBkeyValue = snapshot.key;//store key name to store in data attr, which is used for deleting
			
	
			function publishData(){//post to HTML:
				$('tbody').append('<tr><td class="name" data-key =' + FBkeyValue + '>'
				 + FBname
				 + '</td><td>'
				 + FBadd
				 + '</td><td>'
				 + FBpost
				 + '</td><td>'				 
				 + FBemail
				 + '</td><td>'
				 + FBdate
				 + '</td><td>'				 
				 + FBtime
				 + '</td><td>'
				 + FBtel
				 + '</td><td>'
				 + '<span class="glyphicon glyphicon-remove" aria-hidden="true" data-key =' + FBkeyValue + '></span>'
				 + '</td><td>'
				 + '<button type="submit" class="btn btn-success btn-xs update" data-key =' + FBkeyValue + '>Update'
				 + '</td></tr>')
				};

			
			
			
		
			publishData();//listen for additions made and publish accordingly, by timestamp://query, capture data, post
			});
		});

	$('body').on('click', '.updateLog', function(){//initiate update on row
		key = $(this).attr('data-key');//capture key of current FB object

		var currentRow = $(this).closest('tr').children().filter(':first-child');//capture log name by going to first child of current row, which will always be the name
		var captureName = currentRow.html();//get html of name on this row

		$('.updateFormHeading').html('Update Log "' + captureName + '"');//plug in panel heading to include name of diabetes log being updated
	});

	$('.updateLog').click(function(){
		event.preventDefault();
		var newFullName = $('#updateFullName').val().trim();
		var newAddress = $('#updateAddress').val().trim();
		//var newEmail = $('#updateemail').val().trim();
		//var newPassword = $('#password').val().trim();
		//var newPcode = $('#updatePcode').val().trim();
		//var newDate = $('#updateDate').val().trim();
		//var newTime = $('#updatetime').val().trim();
		var newTelephone = $('#updateTelephone').val().trim();

		// if any input in form is blank, alert and stop code:
		if (newFullName === ''|| newAddress === ''||newPcode === ''||newTelephone === ''){
			$('.updateFormAlert').css('display','initial')
			return;
		}
		else {
			$('.updateFormAlert').css('display','none')
		};

		$('body').on('click','.update',function(){//animation effect for update diabetes log scenario, hide update form and show rest
			$('.updateFormRow').hide(100);
			$('.addFormRow').show(500);
			$('.logTable').show(500);
		});


		// store new diabetes log values to firebase:

		database.ref(key).update({

			FullName: newFullName,
			Address: newAddress,
			PostCode: newPcode,
			//Email: newEmail,
			//Password: newPassword,
			//Date: newDate,
			//Time: newTime,
			Telephone: newTelephone,
			dateAdded: firebase.database.ServerValue.TIMESTAMP,
		});

		//clear form after submission:
		for (var i = 0; i < $('form').length; i++) {
			$('form')[i].reset();
		};

		emptyTableBody();
		database.ref("User").orderByChild("dateAdded").on("child_added", function(snapshot){

			var FBname = snapshot.val().FullName;//capture medication name from firebase
			var FBadd = snapshot.val().Address;
			var FBpost = snapshot.val().PostCode;
			var FBemail = snapshot.val().Email;
			var FBpass = snapshot.val().Password;
			var FBdate = snapshot.val().Date;
			var FBtime = snapshot.val().Time;//capture time from firebase
			var FBtel = snapshot.val().Telephone;//capture frequency from firebase
			
			
			var FBkeyValue = snapshot.key;//store key name to store in data attr, which is used for deleting


			function publishData(){//post to HTML:
				$('tbody').append('<tr><td class="name" data-key =' + FBkeyValue + '>'
				 + FBname
				 + '</td><td>'
				 + FBadd
				 + '</td><td>'
				 + FBpost
				 + '</td><td>'				 
				 + FBemail
				 + '</td><td>'
				 + FBdate
				 + '</td><td>'				 
				 + FBtime
				 + '</td><td>'
				 + FBtel
				 + '</td><td>'
				 + '<span class="glyphicon glyphicon-remove" aria-hidden="true" data-key =' + FBkeyValue + '></span>'
				 + '</td><td>'
				 + '<button type="submit" class="btn btn-success btn-xs update" data-key =' + FBkeyValue + '>Update'
				 + '</td></tr>')
				};

		
			
			
			
			publishData();//listen for additions made and publish accordingly, by timestamp:
    	});//execute update, query, capture data, post to html

	});

	$('.cancelUpdate').click(function(){//cancel button on update  form
		event.preventDefault();
		//when click the app simply returns the default view
		$('.updateFormRow').hide(100);
		$('.addFormRow').show(500);
		$('.logTable').show(500);

	});

	function emptyTableBody (){
		$('tbody').empty();
	};

		database.ref("User").orderByChild("dateAdded").on("child_added", function(snapshot){

			var FBname = snapshot.val().FullName;//capture medication name from firebase
			var FBadd = snapshot.val().Address;
			var FBpost = snapshot.val().PostCode;
			var FBemail = snapshot.val().Email;
			var FBpass = snapshot.val().Password;
			var FBdate = snapshot.val().Date;
			var FBtime = snapshot.val().Time;//capture time from firebase
			var FBtel = snapshot.val().Telephone;//capture frequency from firebase
			
			var FBkeyValue = snapshot.key;//store key name to store in data attr, which is used for deleting


			function publishData(){//post to HTML:
				$('tbody').append('<tr><td class="name" data-key =' + FBkeyValue + '>'
				 + FBname
				 + '</td><td>'
				 + FBadd
				 + '</td><td>'
				 + FBpost
				 + '</td><td>'				 
				 + FBemail
				 + '</td><td>'
				 + FBdate
				 + '</td><td>'				 
				 + FBtime
				 + '</td><td>'
				 + FBtel
				 + '</td><td>'
				 + '<span class="glyphicon glyphicon-remove" aria-hidden="true" data-key =' + FBkeyValue + '></span>'
				 + '</td><td>'
				 + '<button type="submit" class="btn btn-success btn-xs update" data-key =' + FBkeyValue + '>Update'
				 + '</td></tr>')
			};

		
			
					publishData();//listen for additions made and publish accordingly, by timestamp:
    	});

    	database.ref("User").orderByChild("dateAdded").on("child_changed", function(snapshot){

    		resetKey();

			var FBname = snapshot.val().FullName;//capture medication name from firebase
			var FBadd = snapshot.val().Address;
			var FBpost = snapshot.val().PostCode;
			var FBemail = snapshot.val().Email;
			var FBpass = snapshot.val().Password;
			var FBdate = snapshot.val().Date;
			var FBtime = snapshot.val().Time;//capture time from firebase
			var FBtel = snapshot.val().Telephone;//capture frequency from firebase
			
			var FBkeyValue = snapshot.key;//store key name to store in data attr, which is used for deleting

   			
			
			
		
    	});

	$('body').on('click','.glyphicon-remove',function(){//delete children from FB when remove symbol is clicked

		var captureRow = $(this).closest('tr');//capture row that is being deleted
		var capturedRowName = $(":first-child", captureRow).html();//capture name in the row that is being deleted
		var keyToDelete = $(this).attr('data-key');//capture key name that needs to deleted

		captureRow.remove();//delete row from html

		database.ref("User").once("value", function(snapshot){//ref FB database once ...

			database.ref("User").child(keyToDelete).remove();

			});
		});

	function emptyAndUpdate (){
		emptyTableBody();
		database.ref("User").orderByChild("dateAdded").on("child_added", function(snapshot){
			
			var FBname = snapshot.val().FullName;//capture medication name from firebase
			var FBadd = snapshot.val().Address;
			var FBpost = snapshot.val().PostCode;
			var FBemail = snapshot.val().Email;
			var FBpass = snapshot.val().Password;
			var FBdate = snapshot.val().Date;
			var FBtime = snapshot.val().Time;//capture time from firebase
			var FBtel = snapshot.val().Telephone;//capture frequency from firebase
			
			
			var FBkeyValue = snapshot.key;//store key name to store in data attr, which is used for deleting


			function publishData(){//post to HTML:
				$('tbody').append('<tr><td class="name" data-key =' + FBkeyValue + '>'
				 + FBname
				 + '</td><td>'
				 + FBadd
				 + '</td><td>'
				 + FBpost
				 + '</td><td>'				 
				 + FBemail
				 + '</td><td>'
				 + FBdate
				 + '</td><td>'				 
				 + FBtime
				 + '</td><td>'
				 + FBtel
				 + '</td><td>'
				 + '<span class="glyphicon glyphicon-remove" aria-hidden="true" data-key =' + FBkeyValue + '></span>'
				 + '</td><td>'
				 + '<button type="submit" class="btn btn-success btn-xs update" data-key =' + FBkeyValue + '>Update'
				 + '</td></tr>')
			};

		
			publishData();//listen for additions made and publish accordingly, by timestamp:
    	});
	};

	setInterval(emptyAndUpdate, 60000);

//----------------------------------------------------------------END OF SCRIPT	


});