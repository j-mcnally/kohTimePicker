(function( $ ){

  var methods = {
  	 pad : function(n, len) {
		   
		    s = n.toString();
		    if (s.length < len) {
		        s = ('0' + s).slice(-len);
		    }
		
		    return s;
		   
	},
	trimNumber: function (s) {
		  while (s.substr(0,1) == '0' && s.length>1) { s = s.substr(1,9999); }
		  return s;
		},


	showme: function(elm) {
		jQuery("#" + elm + "_tp_container").show();
		jQuery("#" + elm + "_addtime").hide();
		$('#' + elm + '_hourpicker').trigger("change");
    },
    hideme: function(elm) {
    	jQuery("#" + elm + "_tp_container").hide();
		jQuery("." + elm + '_orig').val('');
		jQuery("#" + elm + "_addtime").show();
		jQuery('#' + elm + '_hourpicker').val('');
		jQuery('#' + elm + '_minutepicker').val('');
		jQuery('#' + elm + '_meridianpicker').val('');
   	},
  	
  	
     init : function( options ) {
	   var defaults = {
	   	optional: false
	   };
	   
	  
	   options = $.merge(options, defaults);
	  
       return this.each(function(){
						

     			var $this = $(this);
				
				var safe_name = $this.attr("name").replace(/\[/g, '_').replace(/\]/g, '_');
				
				$this.addClass(safe_name + "_orig")
				
			    $this.hide();
			    hourPicker = '<select id="' + safe_name + '_hourpicker" style="width: 58px;">';
			    for (var i = 1; i <= 12; i++) {
			    	hourPicker += '<option value="' + methods.pad(i,2) + '">' + methods.pad(i,2) + '</option>';
			    }
			    hourPicker += '</select>';
			    minutePicker = '<select id="' + safe_name + '_minutepicker" style="width: 58px;">';
			    for (var i = 0; i < 60; i++) {
			    	minutePicker += '<option value="' + methods.pad(i,2) + '">' + methods.pad(i,2) + '</option>';
			    }
			    minutePicker += '</select>';
			    
			    meridianPicker = '<select id="' + safe_name + '_meridianpicker" style="width: 58px;">';
			   	meridianPicker += '<option value="AM">AM</option>';
			   	meridianPicker += '<option value="PM">PM</option>';
			    meridianPicker += '</select>';
			    
			    var hide = "";
			    
			    if (options.optional) {
			    	hide = "<a href='#' id='" + safe_name + "_removetime' class='hide-icon'> X </a>";

			    }
			    
			    $this.after("<span id='" + safe_name + "_tp_container'>" + hourPicker + ':' + minutePicker + ' ' + meridianPicker + " " + hide + "</span>");
			    
			    
			    if (options.optional) {
			    	var addLink = jQuery("<a href='#' id='" + safe_name + "_addtime'>Add a time</a>");
				    $this.before(addLink)
				    
			    	jQuery("#" + safe_name + "_removetime").bind("click", function(e) {
			    		e.preventDefault();
			    		methods.hideme(safe_name);
			    	});
			    	jQuery("#" + safe_name + "_addtime").bind("click", function(e) {
			    		e.preventDefault();
			    		methods.showme(safe_name);
			    	});
			    	
			    	
			    }
			    
			    if (methods.getTime($this) != false) {
					var time = methods.getTime($this);
					$('#' + safe_name + '_hourpicker').val(time.hours);
					$('#' + safe_name + '_minutepicker').val(time.minutes);
					$('#' + safe_name + '_meridianpicker').val(time.meridian);
				}
			    
			    $('#' + safe_name + '_hourpicker').bind("change", function() {
			    	methods.parseTime($('#' + safe_name + '_hourpicker'), $('#' + safe_name + '_minutepicker'), $('#' + safe_name + '_meridianpicker'), $this);
			    });
			    $('#' + safe_name + '_minutepicker').bind("change", function() {
			    	methods.parseTime($('#' + safe_name + '_hourpicker'), $('#' + safe_name + '_minutepicker'), $('#' + safe_name + '_meridianpicker'), $this);
			    });
			    $('#' + safe_name + '_meridianpicker').bind("change", function() {
			    	methods.parseTime($('#' + safe_name + '_hourpicker'), $('#' + safe_name + '_minutepicker'), $('#' + safe_name + '_meridianpicker'), $this);
				});
				
				
				
				if (options.optional) {
					//if time empty hide it
					if (methods.getTime($this) == false) {
						
						methods.hideme(safe_name);
					}
					//if not show it
					else {
						methods.showme(safe_name);
					}
				}
				else {
					//trigger time change
					methods.showme(safe_name);
					
				}
				
			}); 

     },
     
     
     destroy : function( ) {

       return this.each(function(){
         $(window).unbind('.tooltip');
       })

     },
      parseTime : function(h,m,mer,o) {
			    	var mul = (mer.val() == 'PM') ? 12 : 0;
			    	
			    	if (mer.val() == 'AM' && h.val() == '12') {
			    		h = '00';
			    	}
			    	else {
			    		h = methods.trimNumber(h.val());
			    		h = parseInt(h) + mul;
			    	}
			    	
			    	o.val(methods.pad(h, 2) + ':' + m.val() + ':00');
			    },
	  getTime: function(o) {
			    	value = o.val();
			    	if (value.length > 0) {
			    		parts = value.split(":");
			    		hours = parts[0];
			    		
			    		minutes = parts[1]
			    		meridian = 'AM';
			    		hours = methods.trimNumber(hours);
			    		
			    		hours = parseInt(hours);
			    		if (hours > 12) {
			    			hours = hours - 12;
			    			meridian = 'PM';
			    		}
			    		
			    		if (hours == 0) {
			    			hours = 12;
			    			meridian = 'AM';	
			    		}
			    		return {hours: methods.pad(hours,2), minutes: minutes, meridian: meridian}
			    	}
			    	else {
			    		return false;
			    	}
			    }
  };

  $.fn.kohTimePicker = function( method ) {
    
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      
    	
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.kohTimePicker' );
    }    
  
  };

})( jQuery );