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
		var newMedName = $('#MedName').val().trim();
		var newMedIn = $('#MedIn').val().trim();
		var newMedGlu = $('#MedGlu').val().trim();
		var newMedTime = $('#MedTime').val().trim();
		var newMedDate = $('#MedDate').val().trim();
		var newMedMeal = $('#MedMeal').val().trim();
		var newFirstLoggedTime = $('#FirstLoggedTime').val().trim();
		var newFreq = $('#Freq').val().trim();

		// if any input in form is blank, alert and stop code:
		if (newMedName === ''||newMedIn === ''||newMedGlu === '' ||newMedTime === '' ||newMedDate === ''||newMedMeal === ''||newFirstLoggedTime === ''||newFreq === ''){
			$('.addFormAlert').css('display','initial')
			return;
		}
		else {
			$('.addFormAlert').css('display','none')
		};

		// store new Logged values to friebase:

		database.ref().push({

			Medication: newMedName,
			Insulin: newMedIn,
			Glucose: newMedGlu,
			Time: newMedTime,
			Date: newMedDate,
			Meal: newMedMeal,
			Freq: newFreq,
			firstArrival: newFirstLoggedTime,
			dateAdded: firebase.database.ServerValue.TIMESTAMP,
		});

		//clear form after submission:
		for (var i = 0; i < $('form').length; i++) {
			$('form')[i].reset();
		};

		emptyTableBody();//empty table
		database.ref().orderByChild("dateAdded").on("child_added", function(snapshot){

			var FBnewMedName = snapshot.val().Medication;//capture Med name from firebase
			var FBnewMedIn = snapshot.val().Insulin;//capture insulin dosage from firebase
			var FBnewMedGlu = snapshot.val().Glucose;//capture glucose reading from firebase
			var FBnewMedTime = snapshot.val().Time;//capture logged time from firebase
			var FBnewMedDate = snapshot.val().Date;//capture logged Date from firebase
			var FBnewMedMeal = snapshot.val().Meal;//capture logged Meal from firebase
			var FBfreq = snapshot.val().Freq;//capture frequency from firebase
			var FBarrivalTime = snapshot.val().firstArrival;//capture arriving time from firebase
			var FBkeyValue = snapshot.key;//store key name to store in data attr, which is used for deleting

   			var militaryFormat = "HH:mm";//set format for military time display
   			var normalFormat = "hh:mm A";//set format for normal time display
    		var militaryArrivalTime = moment(FBarrivalTime, militaryFormat);//format arrival time from firebase to display as military time
    		var normalArrivalTime = moment(FBarrivalTime, normalFormat);//format arrival time from firebase to display as normal time
    		var nextArrival;
			var minAway;

			function negativeMinAwayFix (){//if minutes away comes out to negative, reset time to original start time
				if (minAway < -1){
					minAway = minAway + 1440;//add total minutes in day (1440) to estimate because this will be a negative number otherwise
				};
			};

			function alertArrivingNow(){//if minutes away is zero, change digits to string alerting of immenent arrival
				if (minAway === 0){
					minAway = '<p class="arrivingAlert">MEAL TIME NOW !!!</p>';
				};
			};

			function publishData(){//post to HTML:
				$('tbody').append('<tr><td class="name" data-key =' + FBkeyValue + '>'
				 + FBnewMedName
				 + '</td><td>' 
				 + FBnewMedIn
				 + '</td><td>' 
				 + FBnewMedGlu
				 + '</td><td>'
				 + FBnewMedTime
				 + '</td><td>'
				 + FBnewMedDate
				 + '</td><td>'
				 + FBnewMedMeal
				 + '</td><td>'
				 + FBfreq
				 + '</td><td>'
				 + nextArrival
				 + '</td><td>'
				 + minAway
				 + '</td><td>'
				 + '<span class="glyphicon glyphicon-remove" aria-hidden="true" data-key =' + FBkeyValue + '></span>'
				 + '</td><td>'
				 + '<button type="submit" class="btn btn-success btn-xs update" data-key =' + FBkeyValue + '>Update'
				 + '</td></tr>')
			};

			function calculateTimes (Frequency, FirstArrivalTime){

				for (var i = 0; i < 1440; i++) {//loop through minutes in day to cover all possibilities
					if (moment().isSameOrBefore(FirstArrivalTime)){//if the current time is less than or equal to the provided 'first arriving time'...
						minAway = moment(FirstArrivalTime).diff(moment(), "minutes",);//calculate difference between now and arriving time in minutes
						nextArrival = moment(FirstArrivalTime, normalFormat).format(normalFormat);//the next arriving time will be the provided 'first arriving time' and will display in normal format
					}

					else {//if the current time is NOT less than or equal to the provided 'first arriving time'...
						FirstArrivalTime = moment(FirstArrivalTime).add(Frequency, 'm');//add the provided frequency to the provided 'first arriving time'
						minAway = moment(FirstArrivalTime).diff(moment(), "minutes",);//calculate difference between now and arrival time in minutes
						nextArrival = moment(normalArrivalTime, normalFormat).format(normalFormat);//the next arrival time will be the original 'first arriving time' in firebase because it is technically the next day
					};
				};

				negativeMinAwayFix();//check for negative minAway
				alertArrivingNow();//alert if Meal is time arriving right now
			};
			
			calculateTimes(FBfreq, militaryArrivalTime);
			publishData();//listen for additions made and publish accordingly, by timestamp://query, capture data, post
    	});
	});

	$('body').on('click', '.update', function(){//initiate update on row
		key = $(this).attr('data-key');//capture key of current FB object

		var currentRow = $(this).closest('tr').children().filter(':first-child');//capture  name by going to first child of current row, which will always be the name
		var captureName = currentRow.html();//get html of name on this row

		$('.updateFormHeading').html('Update Log "' + captureName + '"');//plug in panel heading to include name of information being updated
	});
	
	
	
	

	$('.updateLog').click(function(){
		event.preventDefault();
		var newMedName = $('#updateMedName').val();
		//var newMedIn = $('#updateupdateMedIn').val();
		//var newMedGlu = $('#updateupdateMedGlu').val();
		//var newMedTime = $('#updateMedTime').val();
		//var newMedDate = $('#updateMedDate').val();
	//	var newMedMeal = $('#updateupdateMedMeal');
		var newFirstLoggedTime = $('#updateFirstLoggedTime').val();
		var newFreq = $('#updateFreq').val();

		// if any input in form is blank, alert and stop code:
		if (newMedName === ''||newFirstLoggedTime === ''||newFreq === ''){
			$('.updateFormAlert').css('display','initial')
			return;
		}
		else {
			$('.updateFormAlert').css('display','none')
		};

		$('body').on('click','.updateLog',function(){//animation effect for update  scenario, hide update form and show rest
			$('.updateFormRow').hide(100);
			$('.addFormRow').show(500);
			$('.trTable').show(500);
		});


		// store new Logged values to friebase:

		database.ref(key).update({

			Medication: newMedName,
			//Insulin: newMedIn,
		//	Glucose: newMedGlu,
			//Time: newMedTime,
		//	Date: newMedDate,
		//	Meal: newMedMeal,
			Freq: newFreq,
			firstArrival: newFirstLoggedTime,
			dateAdded: firebase.database.ServerValue.TIMESTAMP,
		});

		//clear form after submission:
		for (var i = 0; i < $('form').length; i++) {
			$('form')[i].reset();
		};

		emptyTableBody();
		database.ref().orderByChild("dateAdded").on("child_added", function(snapshot){

			var FBnewMedName = snapshot.val().Medication;//capture Med name from firebase
			var FBnewMedIn = snapshot.val().Insulin;//capture insulin dosage from firebase
			var FBnewMedGlu = snapshot.val().Glucose;//capture glucose reading from firebase
			var FBnewMedTime = snapshot.val().Time;//capture logged time from firebase
			var FBnewMedDate = snapshot.val().Date;//capture logged Date from firebase
			var FBnewMedMeal = snapshot.val().Meal;//capture logged Meal from firebase
			var FBfreq = snapshot.val().Freq;//capture frequency from firebase
			var FBarrivalTime = snapshot.val().firstArrival;//capture arriving time from firebase
			var FBkeyValue = snapshot.key;//store key name to store in data attr, which is used for deleting

   			 var militaryFormat = "HH:mm";//set format for military time display
   			 var normalFormat = "hh:mm A";//set format for normal time display
    		 var militaryArrivalTime = moment(FBarrivalTime, militaryFormat);//format arrival time from firebase to display as military time
    		 var normalArrivalTime = moment(FBarrivalTime, normalFormat);//format arrival time from firebase to display as normal time
    		 var nextArrival;
			 var minAway;

			 function negativeMinAwayFix (){//if minutes away comes out to negative, reset time to original start time
				 if (minAway < -1){
					 minAway = minAway + 1440;//add total minutes in day (1440) to estimate because this will be a negative number otherwise
				 };
			 };

			 function alertArrivingNow(){//if minutes away is zero, change digits to string alerting of immenent arrival
				 if (minAway === 0){
					 minAway = '<p class="arrivingAlert">MEAL TIME NOW !!!</p>';
				 };
			 };

			function publishData(){//post to HTML:
				$('tbody').append('<tr><td class="name" data-key =' + FBkeyValue + '>'
				+ FBnewMedName
				+ '</td><td>' 
				+ FBnewMedIn
				+ '</td><td>' 
				+ FBnewMedGlu
				+ '</td><td>'
				+ FBnewMedTime
				+ '</td><td>'
				+ FBnewMedDate
				+ '</td><td>'
				+ FBnewMedMeal
				+ '</td><td>'
				+ FBfreq
				+ '</td><td>'
				+ nextArrival
				+ '</td><td>'
				+ minAway
				+ '</td><td>'
				+ '<span class="glyphicon glyphicon-remove" aria-hidden="true" data-key =' + FBkeyValue + '></span>'
				+ '</td><td>'
				+ '<button type="submit" class="btn btn-success btn-xs update" data-key =' + FBkeyValue + '>Update'
				+ '</td></tr>')
			};

			 function calculateTimes (Frequency, FirstArrivalTime){

				 for (var i = 0; i < 1440; i++) {//loop through minutes in day to cover all possibilities
					 if (moment().isSameOrBefore(FirstArrivalTime)){//if the current time is less than or equal to the provided 'first arrival time'...
						 minAway = moment(FirstArrivalTime).diff(moment(), "minutes",);//calculate difference between now and arrival time in minutes
						 nextArrival = moment(FirstArrivalTime, normalFormat).format(normalFormat);//the next arrival time will be the provided 'first arrival time' and will display in normal format
					 }

					 else {//if the current time is NOT less than or equal to the provided 'first arrival time'...
						 FirstArrivalTime = moment().add(Frequency, 'm');//add the provided frequency to the provided 'first arrival time'
						 minAway = moment(FirstArrivalTime).diff(moment(), "minutes",);//calculate difference between now and arrival time in minutes
						 nextArrival = moment(normalArrivalTime, normalFormat).format(normalFormat);//the next arrival time will be the original 'first arrival time' in firebase because it is technically the next day
					 };
				 };

				 negativeMinAwayFix();//check for negative minAway
				 alertArrivingNow();//alert if Meal time is arriving right now
			 };
			
			calculateTimes(FBfreq, militaryArrivalTime);
			publishData();//listen for additions made and publish accordingly, by timestamp:
    	});//execute update, query, capture data, post to html

	});   //update----------------

	$('.cancelUpdate').click(function(){//cancel button on update form
		event.preventDefault();
		//when click the app simply returns the default view
		$('.updateFormRow').hide(100);
		$('.addFormRow').show(500);
		$('.trTable').show(500);

	});

	function emptyTableBody (){
		$('tbody').empty();
	};

		database.ref().orderByChild("dateAdded").on("child_added", function(snapshot){

			var FBnewMedName = snapshot.val().Medication;//capture Med name from firebase
			var FBnewMedIn = snapshot.val().Insulin;//capture insulin dosage from firebase
			var FBnewMedGlu = snapshot.val().Glucose;//capture glucose reading from firebase
			var FBnewMedTime = snapshot.val().Time;//capture logged time from firebase
			var FBnewMedDate = snapshot.val().Date;//capture logged Date from firebase
			var FBnewMedMeal = snapshot.val().Meal;//capture logged Meal from firebase
			var FBfreq = snapshot.val().Freq;//capture frequency from firebase
			var FBarrivalTime = snapshot.val().firstArrival;//capture arriving time from firebase
			var FBkeyValue = snapshot.key;//store key name to store in data attr, which is used for deleting

   			var militaryFormat = "HH:mm";//set format for military time display
   			var normalFormat = "hh:mm A";//set format for normal time display
    		var militaryArrivalTime = moment(FBarrivalTime, militaryFormat);//format arrival time from firebase to display as military time
    		var normalArrivalTime = moment(FBarrivalTime, normalFormat);//format arrival time from firebase to display as normal time
    		var nextArrival;
			var minAway;

			function negativeMinAwayFix (){//if minutes away comes out to negative, reset time to original start time
				if (minAway < -1){
					minAway = minAway + 1440;//add total minutes in day (1440) to estimate because this will be a negative number otherwise
				};
			};

			function alertArrivingNow(){//if minutes away is zero, change digits to string alerting of imminent arrival
				if (minAway === 0){
					minAway = '<p class="arrivingAlert">MEAL TIME NOW !!!</p>';
				};
			};

			function publishData(){//post to HTML:
				$('tbody').append('<tr><td class="name" data-key =' + FBkeyValue + '>'
				+ FBnewMedName
				+ '</td><td>' 
				+ FBnewMedIn
				+ '</td><td>' 
				+ FBnewMedGlu
				+ '</td><td>'
				+ FBnewMedTime
				+ '</td><td>'
				+ FBnewMedDate
				+ '</td><td>'
				+ FBnewMedMeal
				+ '</td><td>'
				+ FBfreq
				+ '</td><td>'
				+ nextArrival
				+ '</td><td>'
				+ minAway
				+ '</td><td>'
				+ '<span class="glyphicon glyphicon-remove" aria-hidden="true" data-key =' + FBkeyValue + '></span>'
				+ '</td><td>'
				+ '<button type="submit" class="btn btn-success btn-xs update" data-key =' + FBkeyValue + '>Update'
				+ '</td></tr>')
			};

			function calculateTimes (Frequency, FirstArrivalTime){

				for (var i = 0; i < 1440; i++) {//loop through minutes in day to cover all possibilities
					if (moment().isSameOrBefore(FirstArrivalTime)){//if the current time is less than or equal to the provided 'first arrival time'...
						minAway = moment(FirstArrivalTime).diff(moment(), "minutes",);//calculate difference between now and arrival time in minutes
						nextArrival = moment(FirstArrivalTime, normalFormat).format(normalFormat);//the next arrival time will be the provided 'first arrival time' and will display in normal format
					}

					else {//if the current time is NOT less than or equal to the provided 'first arrival time'...
						FirstArrivalTime = moment(FirstArrivalTime).add(Frequency, 'm');//add the provided frequency to the provided 'first arrival time'
						minAway = moment(FirstArrivalTime).diff(moment(), "minutes",);//calculate difference between now and arrival time in minutes
						nextArrival = moment(normalArrivalTime, normalFormat).format(normalFormat);//the next arrival time will be the original 'first arrival time' in firebase because it is technically the next day
					};
				};

				negativeMinAwayFix();//check for negative minAway
				alertArrivingNow();//alert if Meal time is arriving right now
			};
			
			calculateTimes(FBfreq, militaryArrivalTime);
			publishData();//listen for additions made and publish accordingly, by timestamp:
    	});

    	database.ref().orderByChild("dateAdded").on("child_changed", function(snapshot){

    		resetKey();

			var FBnewMedName = snapshot.val().Medication;//capture Med name from firebase
			var FBnewMedIn = snapshot.val().Insulin;//capture insulin dosage from firebase
			var FBnewMedGlu = snapshot.val().Glucose;//capture glucose reading from firebase
			var FBnewMedTime = snapshot.val().Time;//capture logged time from firebase
			var FBnewMedDate = snapshot.val().Date;//capture logged Date from firebase
			var FBnewMedMeal = snapshot.val().Meal;//capture logged Meal from firebase
			var FBfreq = snapshot.val().Freq;//capture frequency from firebase
			var FBarrivalTime = snapshot.val().firstArrival;//capture arriving time from firebase
			var FBkeyValue = snapshot.key;//store key name to store in data attr, which is used for deleting


   			var militaryFormat = "HH:mm";//set format for military time display
   			var normalFormat = "hh:mm A";//set format for normal time display
    		var militaryArrivalTime = moment(FBarrivalTime, militaryFormat);//format arrival time from firebase to display as military time
    		var normalArrivalTime = moment(FBarrivalTime, normalFormat);//format arrival time from firebase to display as normal time
    		var nextArrival;
			var minAway;

			function negativeMinAwayFix (){//if minutes away comes out to negative, reset time to original start time
				if (minAway < -1){
					minAway = minAway + 1440;//add total minutes in day (1440) to estimate because this will be a negative number otherwise
				};
			};

			function alertArrivingNow(){//if minutes away is zero, change digits to string alerting of immenent arrival
				if (minAway === 0){
					minAway = '<p class="arrivingAlert">MEAL TIME NOW !!!</p>';
				};
			};

			function calculateTimes (Frequency, FirstArrivalTime){

				for (var i = 0; i < 1440; i++) {//loop through minutes in day to cover all possibilities
					if (moment().isSameOrBefore(FirstArrivalTime)){//if the current time is less than or equal to the provided 'first arrival time'...
						minAway = moment(FirstArrivalTime).diff(moment(), "minutes",);//calculate difference between now and arrival time in minutes
						nextArrival = moment(FirstArrivalTime, normalFormat).format(normalFormat);//the next arrival time will be the provided 'first arrival time' and will display in normal format
					}

					else {//if the current time is NOT less than or equal to the provided 'first arrival time'...
						FirstArrivalTime = moment(FirstArrivalTime).add(Frequency, 'm');//add the provided frequency to the provided 'first arrival time'
						minAway = moment(FirstArrivalTime).diff(moment(), "minutes",);//calculate difference between now and arrival time in minutes
						nextArrival = moment(normalArrivalTime, normalFormat).format(normalFormat);//the next arrival time will be the original 'first arrival time' in firebase because it is technically the next day
					};
				};

				negativeMinAwayFix();//check for negative minAway
				alertArrivingNow();//alert if meal time is arriving right now
			};
			
			calculateTimes(FBfreq, militaryArrivalTime);
    	});

	$('body').on('click','.glyphicon-remove',function(){//delete children from FB when remove symbol is clicked

		var captureRow = $(this).closest('tr');//capture row that is being deleted
		var capturedRowName = $(":first-child", captureRow).html();//capture name in the row that is being deleted
		var keyToDelete = $(this).attr('data-key');//capture key name that needs to deleted

		captureRow.remove();//delete row from html

		database.ref().once("value", function(snapshot){//ref FB database once ...

			database.ref().child(keyToDelete).remove();

			});
		});

	function emptyAndUpdate (){
		emptyTableBody();
		database.ref().orderByChild("dateAdded").on("child_added", function(snapshot){

			var FBnewMedName = snapshot.val().Medication;//capture Med name from firebase
			var FBnewMedIn = snapshot.val().Insulin;//capture insulin dosage from firebase
			var FBnewMedGlu = snapshot.val().Glucose;//capture glucose reading from firebase
			var FBnewMedTime = snapshot.val().Time;//capture logged time from firebase
			var FBnewMedDate = snapshot.val().Date;//capture logged Date from firebase
			var FBnewMedMeal = snapshot.val().Meal;//capture logged Meal from firebase

			var FBfreq = snapshot.val().Freq;//capture frequency from firebase
			var FBarrivalTime = snapshot.val().firstArrival;//capture arriving time from firebase
			var FBkeyValue = snapshot.key;//store key name to store in data attr, which is used for deleting


   			var militaryFormat = "HH:mm";//set format for military time display
   			var normalFormat = "hh:mm A";//set format for normal time display
    		var militaryArrivalTime = moment(FBarrivalTime, militaryFormat);//format arrival time from firebase to display as military time
    		var normalArrivalTime = moment(FBarrivalTime, normalFormat);//format arrival time from firebase to display as normal time
    		var nextArrival;
			var minAway;

			function negativeMinAwayFix (){//if minutes away comes out to negative, reset time to original start time
				if (minAway < -1){
					minAway = minAway + 1440;//add total minutes in day (1440) to estimate because this will be a negative number otherwise
				};
			};

			function alertArrivingNow(){//if minutes away is zero, change digits to string alerting of immenent arrival
				if (minAway === 0){
					minAway = '<p class="arrivingAlert">MEAL TIME NOW !!!</p>';
				};
			};

			function publishData(){//post to HTML:
				$('tbody').append('<tr><td class="name" data-key =' + FBkeyValue + '>'
				+ FBnewMedName
				+ '</td><td>' 
				+ FBnewMedIn
				+ '</td><td>' 
				+ FBnewMedGlu
				+ '</td><td>'
				+ FBnewMedTime
				+ '</td><td>'
				+ FBnewMedDate
				+ '</td><td>'
				+ FBnewMedMeal
				+ '</td><td>'
				+ FBfreq
				+ '</td><td>'
				+ nextArrival
				+ '</td><td>'
				+ minAway
				+ '</td><td>'
				+ '<span class="glyphicon glyphicon-remove" aria-hidden="true" data-key =' + FBkeyValue + '></span>'
				+ '</td><td>'
				+ '<button type="submit" class="btn btn-success btn-xs update" data-key =' + FBkeyValue + '>Update'
				+ '</td></tr>')
			};

			function calculateTimes (Frequency, FirstArrivalTime){

				for (var i = 0; i < 1440; i++) {//loop through minutes in day to cover all possibilities
					if (moment().isSameOrBefore(FirstArrivalTime)){//if the current time is less than or equal to the provided 'first arrival time'...
						minAway = moment(FirstArrivalTime).diff(moment(), "minutes",);//calculate difference between now and arrival time in minutes
						nextArrival = moment(FirstArrivalTime, normalFormat).format(normalFormat);//the next arrival time will be the provided 'first arrival time' and will display in normal format
					}

					else {//if the current time is NOT less than or equal to the provided 'first arrival time'...
						FirstArrivalTime = moment(FirstArrivalTime).add(Frequency, 'm');//add the provided frequency to the provided 'first arrival time'
						minAway = moment(FirstArrivalTime).diff(moment(), "minutes",);//calculate difference between now and arrival time in minutes
						nextArrival = moment(normalArrivalTime, normalFormat).format(normalFormat);//the next arrival time will be the original 'first arrival time' in firebase because it is technically the next day
					};
				};

				negativeMinAwayFix();//check for negative minAway
				alertArrivingNow();//alert if meal time is arriving right now
			};
			
			calculateTimes(FBfreq, militaryArrivalTime);
			publishData();//listen for additions made and publish accordingly, by timestamp:
    	});
	};

	setInterval(emptyAndUpdate, 60000);

//----------------------------------------------------------------END OF SCRIPT	
});