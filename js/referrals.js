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


	$(document).ready(function(){
		$.when(Referral.findAll(), Referral.findAll()).then(function(referralResponse){
			var referrals = referralResponse[0];
			
			new Referrals('#referrals', {
				referrals: referrals
			});
		});
	});
})()