(function(){
	var REFERRALS = [
		{
			id: 1,
			name: 'Wolverines',
			clicks: 0
		},
		{
			id: 2,
			name: 'Spartans',
			clicks: 0
		},
		{
			id: 3,
			name: 'Lakers',
			clicks: 0
		}
	];

	Referral = can.Model({
		findAll: 'GET /referrals',
		create  : "POST /referrals",
		update  : "PUT /referrals/{id}",
		destroy : "DELETE /referrals/{id}"
	},{});

	can.fixture('GET /referrals', function(){
		return [REFERRALS];
	});

	// create
	var id= 4;
	can.fixture("POST /referrals", function(){
		// just need to send back a new id
		return {id: (id++)}
	});

	// update
	can.fixture("PUT /referrals/{id}", function(){
		// just send back success
		return {};
	});

	// destroy
	can.fixture("DELETE /referrals/{id}", function(){
		// just send back success
		return {};
	});

	//can.fixture.on = false;

	Referrals = can.Control({
		init: function(){
			this.element.html(can.view('views/referralsList.ejs', {
				referrals: this.options.referrals
			}));
		},

	    '.referral input focusout': function(el, ev) {  
	      this.updateReferral(el);  
	      el.hide().siblings('a').show();
	      el.siblings('a.add').hide();
	    },  
	    
	    '.referral input keyup': function(el, ev) {  
	      if(ev.keyCode == 13) { 
	        el.blur();
	      }  
	    },  

	    updateReferral: function(el){  
	      var referral = el.closest('.referral').data('referral');
	      var clickCount = parseInt(el.closest('.referral').find('.click-count').text());
	      referral.attr(el.attr('name'), el.val()).save();
	      referral.attr('clicks', clickCount).save();
	    },

        '.remove click': function(el, ev){  
	      el.closest('.referral').data('referral').destroy();  
	    },

        '.edit click': function(el, ev){  
	      el.closest('.referral').find('.span3').children('a').hide();
	      el.closest('.referral').find('.span3').children('input').show().trigger('focus');
	      el.closest('.referral').find('.span3').children('a.add').show();
	    }, 

        '{Referral} created' : function(list, ev, referral){  
	      this.options.referrals.push(referral);  
	    },

	    '.referral-link click': function(el, ev) {
	    	var clicks = parseInt(el.closest('.referral').find('.click-count').text()) + 1;
	    	el.closest('.referral').find('.click-count').text(clicks);
	    	this.updateReferralClickCount(el, clicks);
	    },  

	    updateReferralClickCount: function(el){ 
	      var referral = el.closest('.referral').data('referral'); 
	      var clickCount = parseInt(el.closest('.referral').find('.click-count').text());
	      referral.attr('clicks', clickCount).save();
	    }
	});

    Create = can.Control({  
      init: function(){   
        this.referral = new Referral(); 
        this.element.html(can.view('views/referralCreate.ejs', {  
          referral: this.referral, 
        })); 
      },

      '.referral input keyup': function(el, ev) {  
        if(ev.keyCode == 13){  
          this.createReferral(el);  
        }  
      },  

      '.save click' : function(el){  
        this.createReferral(el)  
      },   

      createReferral: function() {  
        this.referral = new Referral(); 
        var form = this.element.find('form');   
          values = can.deparam(form.serialize()); 
          $(values).attr('clicks', '0');
      
        if(values.name !== "") {  
          this.referral.attr(values).save();
          $('#create input').val("Add a link");
        }  
      }  
    });  


	$(document).ready(function(){
		$.when(Referral.findAll(), Referral.findAll()).then(function(referralResponse){
			var referrals = referralResponse[0];

			new Create('#create', {}); 
			new Referrals('#referrals', {
				referrals: referrals
			});
		});
	});
})()