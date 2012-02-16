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



  	
  	
     init : function( options ) {

       return this.each(function(){
        

     			var $this = $(this);

			    $this.hide();
			    hourPicker = '<select id="' + $this.attr("name") + '_hourpicker" style="width: 58px;">';
			    for (var i = 1; i <= 12; i++) {
			    	hourPicker += '<option value="' + methods.pad(i,2) + '">' + methods.pad(i,2) + '</option>';
			    }
			    hourPicker += '</select>';
			    minutePicker = '<select id="' + $this.attr("name") + '_minutepicker" style="width: 58px;">';
			    for (var i = 0; i < 60; i++) {
			    	minutePicker += '<option value="' + methods.pad(i,2) + '">' + methods.pad(i,2) + '</option>';
			    }
			    minutePicker += '</select>';
			    
			    meridianPicker = '<select id="' + $this.attr("name") + '_meridianpicker" style="width: 58px;">';
			   	meridianPicker += '<option value="AM">AM</option>';
			   	meridianPicker += '<option value="PM">PM</option>';
			    meridianPicker += '</select>';
			    $this.after(hourPicker + ':' + minutePicker + ' ' + meridianPicker);
			    
			    if (methods.getTime($this) != false) {
					var time = methods.getTime($this);
					$('#' + $this.attr("name") + '_hourpicker').val(time.hours);
					$('#' + $this.attr("name") + '_minutepicker').val(time.minutes);
					$('#' + $this.attr("name") + '_meridianpicker').val(time.meridian);
				}
			    
			    $('#' + $this.attr("name") + '_hourpicker').bind("change", function() {
			    	methods.parseTime($('#' + $this.attr("name") + '_hourpicker'), $('#' + $this.attr("name") + '_minutepicker'), $('#' + $this.attr("name") + '_meridianpicker'), $this);
			    }).trigger("change");
			    $('#' + $this.attr("name") + '_minutepicker').bind("change", function() {
			    	methods.parseTime($('#' + $this.attr("name") + '_hourpicker'), $('#' + $this.attr("name") + '_minutepicker'), $('#' + $this.attr("name") + '_meridianpicker'), $this);
			    });
			    $('#' + $this.attr("name") + '_meridianpicker').bind("change", function() {
			    	methods.parseTime($('#' + $this.attr("name") + '_hourpicker'), $('#' + $this.attr("name") + '_minutepicker'), $('#' + $this.attr("name") + '_meridianpicker'), $this);
				});
				
				
				
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
