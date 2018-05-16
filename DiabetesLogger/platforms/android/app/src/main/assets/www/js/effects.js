$(document).ready(function() {

	$('body').on('mouseenter','.glyphicon-remove',function(){//animation effect for remove 'x' button
		$(this).animate({color:'green'},200);
		$(this).closest('tr').animate({backgroundColor:'#eea7a7'},200);
	});

	$('body').on('mouseout','.glyphicon-remove',function(){//animation effect for remove 'x' button
		$(this).animate({color:'black'},200);
		$(this).closest('tr').animate({backgroundColor:'white'},200);
	});

	 $('body').on('click','.update',function(){//animation effect for update diabetes scenario, show update form and hide rest
		 $('.updateFormRow').show(100);
		 $('.logTable').hide(500);
	 });

//----------------------------------------------------------------END OF SCRIPT	
});