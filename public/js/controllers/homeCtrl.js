angular.module("ard").controller("homeCtrl", function($scope, ardService) {

  // Detect IE
var browserIE = false;
if(whichBrs() == 'Internet Explorer') browserIE = true;

// Detect Mobile
var browserMobile = false;
if($('body').hasClass('layout-mobile')) browserMobile = true;

// Elements
var $wrapper = $('#wrapper'),
	$header = $('#header'),
	$section = $('#section'),
	$footer = $('#footer'),
	$valign = $('.valign'),
	$fullHeight = $('.full-height'),
	$imgFit = $('.img-fit'),
	$toLoad = $('.to-load'),
	$parallax = $('.parallax'),
	$parallaxColumns = $('.parallax-columns');

var animRunning = false,
	currentScroll = -1,
	language = $('body').attr('data-language'),
	animations = [],
	animationsRows = [],
	scrollTimeout;

$('html,body').scrollTop(0);
$(window).load(function(){
	/* ////////////////////////////////////////
	//
	// General
	//
	/////////////////////////////////////// */

	// Links
	$('a').on('click', function(){
		var object = $(this);

		if(!object.hasClass('btn-anchor') && object.attr('target')!= '_blank' && object.attr('href') != '' && object.attr('href').indexOf('mailto') == -1){
			// If Hashtag
			if(object.attr('href').indexOf('#') > -1){
				var url_parts = object.attr('href').split('#');
				if(window.location.href.indexOf(url_parts[0]) == -1){
					var pageLoc = object.attr('href');
					$('#loading-mask').fadeIn(750, function(){
						window.location.href = pageLoc;
					});

					return false;
				}
			}
			// If No Hashtag
			else {
				var pageLoc = object.attr('href');
				$('#loading-mask').fadeIn(750, function(){
					window.location.href = pageLoc;
				});

				return false;
			}
		}
	});

	// Anchor Buttons
	$('.btn-anchor').on('click', function(){
		if(!animRunning && !$(this).hasClass('active')){
			var $object = $(this);

			var anchor = $object.attr('data-anchor');
			var $target = $('#'+anchor);
			var scroll = Math.abs(currentScroll - $target.offset().top);
			var scrollVal = $target.offset().top;

			var scrollTime = scroll * 0.5;
			if(scrollTime < 1250) scrollTime = 1250;

			$('html,body').animate({scrollTop: scrollVal}, scrollTime, 'easeInOutQuad');
		}

		return false;
	});

	// Header - Open/Close
	$('.btn-toggle-menu', $header).on('click', function(){
		// Open
		if(!$(this).hasClass('opened')){
			$(this).addClass('opened');
			$('.bottom',$header).addClass('opened');
			$('.menu > .bottom', $header).height($('.menu > .bottom > div').outerHeight());
		}
		// Close
		else {
			$(this).removeClass('opened');
			$('.bottom',$header).removeClass('opened');
			$('.menu > .bottom', $header).height(0);
		}

		return false;
	});

	$header.on('mouseleave', function(){
		$('.btn-toggle-menu', this).removeClass('opened');
		$('.bottom',$header).removeClass('opened');
		$('.menu > .bottom', this).height(0);
	});

	// Header - Slider
	var InfiniteSliderFade = new InfiniteSlider($('#slider-container-fade'),1000,3000,'fade','easeInOutQuad',false,false);

	// Animations
	$('.animation').each(function(){
		var id = $(this).attr('id');
		var nb = parseFloat($(this).data('nb-frames')) - 1;
		var width = $(this).width();
		var height = $(this).height();
		var fps = $(this).data('fps');

		// If Animation one row
		if(!$(this).hasClass('rows')){
			var animInfos = [id, new PNGPreloader($(this),nb,width,fps,false)];
			animations.push(animInfos);
		}
		// If Animation on more than one row - Size issue
		else {
			var animInfos = [id, new PNGPreloaderRows($(this),nb,width,height,26,fps,false)];
			animationsRows.push(animInfos);
		}
	});

	/* ////////////////////////////////////////
	//
	// Home
	//
	/////////////////////////////////////// */

	// Auto Scroll
	setTimeout(function(){
		if(currentScroll < 10) $('.btn-scroll-down').trigger('click');
	}, 4000);

	// Block 2 - Slider
	$('#slider-container-slide').each(function(){
		var InfiniteSliderBlock2 = new InfiniteSlider($('#slider-container-slide'),750,3000,'slide','easeInOutQuad',false,false);

		// Change Background Slider Too
		$('#slider-container-slide .slider-arrows .previous a').on('click', function(){
			$('#slider-container-fade .slider-arrows .previous a').trigger('click');
		});
		$('#slider-container-slide .slider-arrows .next a').on('click', function(){
			$('#slider-container-fade .slider-arrows .next a').trigger('click');
		});
	});

	// Block 3 - Slider
	$('#slider-container-slide-v').each(function(){
		var InfiniteSliderBlock3 = new InfiniteSlider($('#slider-container-slide-v'),750,3000,'slidev','easeOutQuad',false,false);
	});

	/* ////////////////////////////////////////
	//
	// Services - Single
	//
	/////////////////////////////////////// */

	// Init Animations
	$('#services_single .animation, #emergency .animation').each(function(){
		var thisIndex = $(this).index();
		setTimeout(function(){
			animationsRows[thisIndex][1].start(119);

			setInterval(function(){
				animationsRows[thisIndex][1].start(119);
			}, 6000);
		}, (thisIndex * 3750) + 750);
	});

	// Init Video
	$('#services_single .block-video .video-container .overlay').on('click', function(){
		var vidData = $(this).parent().attr('data-video-src').split('|');
		var vidType = vidData[0];
		var vidID = vidData[1];

		$(this).siblings('.video-player').css('opacity','1');

		switch(vidType){
			case 'youtube':
				var innerHtml = '<iframe width="560" height="315" src="//www.youtube.com/embed/'+vidID+'?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>';
			break;

			case 'vimeo':
				var innerHtml = '<iframe src="//player.vimeo.com/video/'+vidID+'?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1&amp;color=ffffff" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
			break;

			case 'vzaar':
				if(language == 'fr') var innerHtml = insertClip(vidID, rootFr, "1060", "597");
				else var innerHtml = insertClip(vidID, rootEn, "1060", "597");
			break;
		}

		$(this).siblings('.video-player').css('z-index','15').html(innerHtml);

		return false;
	});

	/* ////////////////////////////////////////
	//
	// Contact
	//
	/////////////////////////////////////// */

	// Init Map
	// $('#contact #map').each(function(){
	// 	var latitude = parseFloat($(this).attr('data-latitude'));
	// 	var longitude = parseFloat($(this).attr('data-longitude'));
	// 	var mapID = $(this).attr('id');
	//
	// 	initializeMap(latitude, longitude, mapID);
	// });

	/* ////////////////////////////////////////
	//
	// Init
	//
	/////////////////////////////////////// */

	positionContent();
	$('#loading-mask').fadeOut(950);
	setTimeout(function(){
		$('#homepage').each(function(){
			var nbFrames = parseFloat($('#homepage #quote .animation').attr('data-nb-frames')) - 1;
			animations[0][1].start(nbFrames);
		});

		$('#contact').each(function(){
			$('#contact #block2 > div .entrance').addClass('loaded');
		});
	}, 250);

	// Anchors
	if(window.location.hash != ''){
		var anchor = window.location.hash.replace('#','');
		var $target = $('[data-anchor="'+anchor+'"]');
		var scroll = Math.abs(currentScroll - $target.offset().top);
		var scrollVal = $target.offset().top;

		$('html,body').scrollTop(scrollVal);
	}
});

/* ////////////////////////////////////////////////////////////////////////////
//
// Window Functions
//
/////////////////////////////////////////////////////////////////////////// */

$(window).resize(function(){
	positionContent();
});

$(window).scroll(function(){
	scrollContent();
});

/* ////////////////////////////////////////////////////////////////////////////
//
// Vzaar
//
/////////////////////////////////////////////////////////////////////////// */

var rootFr="rootFr";
var rootEn="rootEn";
var rootRu="rootRu";

function insertClip(clp, rt, w_, h_){swfObject='<iframe frameborder="0" marginheight="0" marginwidth="0" src="https://www.infosignmedia.com/solo/validator.php?clp='+clp+'&root='+rt+'&autoplay=true&brandlink=servdentist.com&brandtxt=ServDentist.com&abr=full"  type="text/php" scrolling="no" width="'+w_+'" height="'+h_+'"></iframe>';return swfObject;}
function insertClipVzaar(clp, rt, w_, h_, ap, txt, lk, abr){ if(txt=="s"){txt=lk="ServDentist.com"};if(abr!="short"){abr="full";};swfObject='<iframe frameborder="0" marginheight="0" marginwidth="0" src="https://www.infosignmedia.com/solo/validator.php?clp='+clp+'&root='+rt+'&autoplay='+ap+'&brandlink='+lk+'&brandtxt='+txt+'&abr='+abr+'"  type="text/php" scrolling="no" width="'+w_+'" height="'+h_+'"></iframe>';return swfObject;}

/* ////////////////////////////////////////////////////////////////////////////
//
// Google Maps
//
/////////////////////////////////////////////////////////////////////////// */

function initializeMap(latitude, longitude, mapID) {
    var g = new google.maps.LatLng(latitude, longitude);
    var b = {
        zoom: 15,
        center: g,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
	    navigationControl: false,
	    mapTypeControl: false,
	    scaleControl: false,
        styles: [
		  {
		    "stylers": [
		      { "gamma": 2.42 },
		      { "saturation": -58 },
		      { "hue": "#007fff" },
		      { "lightness": -5 }
		    ]
		  },{
		    "featureType": "road.highway",
		    "stylers": [
		      { "saturation": -62 },
		      { "lightness": -2 }
		    ]
		  },{
		    "featureType": "poi",
		    "stylers": [
		      { "visibility": "simplified" }
		    ]
		  },{
		    "featureType": "water",
		    "stylers": [
		      { "visibility": "on" },
		      { "saturation": -67 },
		      { "lightness": -2 }
		    ]
		  }
		]
    };
    var d = new google.maps.Map(document.getElementById(mapID), b);
    var image = new google.maps.MarkerImage('images/layout/contact_pin.png',
        // This marker is 20 pixels wide by 32 pixels tall.
        new google.maps.Size(63, 63),
        // The origin for this image is 0,0.
        new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at 0,32.
        new google.maps.Point(31, 31));

	var marker = new google.maps.Marker({
	  position: new google.maps.LatLng(latitude,longitude),
	  map: d,
	  icon: image
	});

	google.maps.event.addDomListener(window, 'resize', function() {
	  var position = new google.maps.LatLng(latitude,longitude);
	  d.setCenter(position);
	});
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Position Content
//
/////////////////////////////////////////////////////////////////////////// */

function positionContent(){
	// Home - Quote
	$('#quote').each(function(){
		$('.bg', this)
			.width($wrapper.width())
			.css('margin-left', - ($wrapper.width() / 2 - $section.width() / 2));
	});

	// Clinic - CTAs
	$('#clinic #block4 > div > div > ul').each(function(){
		var maxHeight = 0;

		$('li', this).each(function(){
			if($('p', this).outerHeight() > maxHeight) maxHeight = $('p', this).outerHeight();
		});

		$('li .text', this).height(maxHeight);
	});

	// Full Height
	$fullHeight.height($(window).height());

	// Centered Vertically
	$valign.each(function(){
		$(this).css('padding-top', ($(this).parent().height()/2 - $(this).height()/2));
	});

	// Fit Images
	$imgFit.each(function(){
		var bg_main = $(this);
		var wrapper = $(this).parent();
		var wrapperWidth = wrapper.width();
		var wrapperHeight = wrapper.height();

		var bgMainSizes = $(this).attr('data-size').split('|');
		var bgMainRatio = bgMainSizes[0]/bgMainSizes[1];
		var wrapperRatio = wrapperWidth/wrapperHeight;

		if(bgMainRatio > wrapperRatio){
			bg_main
				.height(wrapperHeight)
				.width(wrapperHeight * bgMainRatio)
				.css('left',(wrapperWidth/2 - (wrapperHeight * bgMainRatio)/2));
				//.css('top','0');
		} else {
			bg_main
				.width(wrapperWidth)
				.height(wrapperWidth / bgMainRatio)
				.css('left','0');
				//.css('top',(wrapperHeight/2 - (wrapperWidth / bgMainRatio)/2));
		}
	});

	scrollContent();
}

function scrollContent(){
	var totalScroll = $(document).height() - $(window).height();

	if(browserMobile){
		newScroll = $(window).scrollTop();
	} else {
		if(whichBrs() == 'Safari' || whichBrs() == 'Chrome'){
			newScroll = $('body').scrollTop();
		} else {
			newScroll = $('html,body').scrollTop();
		}
	}

	// Homepage - Quote
	$('#quote').each(function(){
		var tempScroll = $(this).height() - newScroll;
		if(tempScroll < 0) tempScroll = 0;
		var tempOpacity = 1 - (newScroll / ($(window).height() / 2));

		$header.css('top', tempScroll);
		$('#slider-bg').css('top', tempScroll);
		$('#icons-bottom').css('bottom', - tempScroll);
		$('#quote h2, #quote .animation, #quote .btn-anchor').css('opacity',tempOpacity);
	});

	// Loading
	$toLoad.each(function(){
		var object = $(this);

		if(newScroll + $(window).height() * 0.85 > $(this).offset().top && !object.hasClass('loaded')){
			// If Regular Content
			if(!object.hasClass('animation')){
				object.removeClass('no-anim');
				object.addClass('loaded');
			}
			// If Animation
			else {
				object.addClass('loaded');
				// If Single Row
				if(!object.hasClass('rows')){
					for(var i = 0; i < animations.length; i ++){
						if(animations[i][0] == object.attr('id')){
							if(object.hasClass('loop')) animations[i][1].start();
							else {
								if(object.parents('#clinic').length == 1){
									var delay = $('#'+animations[i][0]).parent().index() * 250;
									var anim = animations[i][1];
									setTimeout(function(){
										anim.start(parseFloat(object.data('nb-frames')) - 1);
									}, delay);
								} else {
									animations[i][1].start(parseFloat(object.data('nb-frames')) - 1);
								}
							}
						}
					}
				}
				// If Multiple Rows
				else {
					for(var i = 0; i < animationsRows.length; i ++){
						if(animationsRows[i][0] == object.attr('id')){
							if(object.hasClass('loop')) animationsRows[i][1].start();
							else {
								if(object.parents('#clinic').length == 1){
									var delay = $('#'+animationsRows[i][0]).parent().index() * 250;
									var anim = animationsRows[i][1];
									setTimeout(function(){
										anim.start(parseFloat(object.data('nb-frames')) - 1);
									}, delay);
								} else {
									animationsRows[i][1].start(parseFloat(object.data('nb-frames')) - 1);
								}
							}
						}
					}
				}
			}
		} else if(newScroll + $(window).height() <= $(this).offset().top && object.hasClass('loaded')) {
			if(!object.hasClass('animation')){
				object.addClass('no-anim');
				object.removeClass('loaded');
			}
			// If Animation
			else {
				object.removeClass('loaded');
				// If Single Row
				if(!object.hasClass('rows')){
					for(var i = 0; i < animations.length; i ++){
						if(animations[i][0] == object.attr('id')) animations[i][1].reset();
					}
				}
				// If Multiple Rows
				else {
					for(var i = 0; i < animationsRows.length; i ++){
						if(animationsRows[i][0] == object.attr('id')) animationsRows[i][1].reset();
					}
				}
			}
		}
	});

	// Columns - Parallax
	$parallaxColumns.each(function(){
		var fakeScroll = newScroll - $(this).offset().top;
		if(fakeScroll < 0) fakeScroll = 0;

		var totalHeight = $(this).height();
		var scrollDiff = totalHeight - $(window).height();
		var fixedColumn = $('> .fixed', this);
		var fixedColumnHeight = fixedColumn.height();
		var fixedColumnDiff = fixedColumnHeight - $(window).height();
		var scrollRatio = fixedColumnDiff / scrollDiff;
		var maxPos = scrollDiff - fixedColumnDiff;

		// If Fixed Column shorter then window
		if(fixedColumnDiff < 0){
			var newPos = fakeScroll;
			if(newPos > maxPos) newPos = maxPos;
		}
		// If Fixed Column bigger then window
		else {
			var newPos = fakeScroll - (scrollRatio * fakeScroll);
			if(newPos > maxPos) newPos = maxPos;
		}

		fixedColumn.css('top', newPos);
	});

	// Team - Parallax Mr McInnes
	$('#team #block2').each(function(){
		var tempScroll = newScroll * 0.5;

		// Block Bottom
		if(tempScroll + $(this).height() + 100 < newScroll + $(window).height()) tempScroll = (newScroll + $(window).height()) - ($(this).height() + 100);
		// Scroll Bottom
		if(tempScroll + $(this).height() + 100 > $('#team').height()) tempScroll = tempScroll - ((newScroll + $(window).height()) - ($('#team').height()));

		$(this).css('top', tempScroll);
	});

	// Contact Map - Parallax
	$('#map, #services_single #block1 > .bg, #emergency #block1 > .bg, #quote .bg img').each(function(){
		var tempScroll = - newScroll * 0.75;

		$(this).css({'top': - tempScroll});
	});

	// Homepage - Block 3 Autoscroll
	if($('#homepage #block3').length == 1){
		clearTimeout(scrollTimeout);
		if(!animRunning){
			scrollTimeout= setTimeout(function(){
				scrollPosition();
			}, 550);
		}
	}

	currentScroll = newScroll;
}

function scrollPosition(){
	animRunning = true;
	var $target = $('#homepage #block3');

	if(currentScroll < $target.offset().top + 450 && currentScroll > $target.offset().top - 250){
		$('html,body').animate({scrollTop: $target.offset().top + 1}, 750, 'easeInOutQuad', function(){
			animRunning = false;
		});
	} else {
		animRunning = false;
		return false;
	}
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Get Browser
//
/////////////////////////////////////////////////////////////////////////// */

function whichBrs() {
	var agt=navigator.userAgent.toLowerCase();
	if (agt.indexOf("opera") != -1) return 'Opera';
	if (agt.indexOf("staroffice") != -1) return 'Star Office';
	if (agt.indexOf("webtv") != -1) return 'WebTV';
	if (agt.indexOf("beonex") != -1) return 'Beonex';
	if (agt.indexOf("chimera") != -1) return 'Chimera';
	if (agt.indexOf("netpositive") != -1) return 'NetPositive';
	if (agt.indexOf("phoenix") != -1) return 'Phoenix';
	if (agt.indexOf("firefox") != -1) return 'Firefox';
	if (agt.indexOf("chrome") != -1) return 'Chrome';
	if (agt.indexOf("safari") != -1) return 'Safari';
	if (agt.indexOf("skipstone") != -1) return 'SkipStone';
	if (agt.indexOf("msie") != -1) return 'Internet Explorer';
	if (agt.indexOf("netscape") != -1) return 'Netscape';
	if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
	if (agt.indexOf('\/') != -1) {
		if (agt.substr(0,agt.indexOf('\/')) != 'mozilla') {
			return navigator.userAgent.substr(0,agt.indexOf('\/'));
		} else return 'Netscape';
	} else if (agt.indexOf(' ') != -1)
		return navigator.userAgent.substr(0,agt.indexOf(' '));
	else return navigator.userAgent;
}

//InfiniteSlider

/* ////////////////////////////////////////////////////////////////////////////
//
// Infinite Slider
// V 1.0
// Alexandra Nantel
// Last Update 01/11/2012 10:22
//
/////////////////////////////////////////////////////////////////////////// */

function InfiniteSlider(wrapper,speed,duration,mode,easing,hover,animation){
	var _infiniteSlider = this;

	// If true : running
	this.animated = false;
	// Autorotation
	this.hover = hover;
	this.autorotation = animation;
	this.running = true;
	this.t;
	// Setting the container and controller
	this.wrapper = $(wrapper);
	this.container = $('.slider',this.wrapper);
	this.arrows = $('.slider-arrows',this.wrapper);
	this.count = $('.count .numbers',this.arrows);
	this.controls = $('.slider-controls',this.wrapper);
	this.infos = $('.slider-infos',this.wrapper);
	this.speed = speed;
	this.duration = duration;
	this.mode = mode; // slide - slidev - fade - demask
	this.easing = easing;
	this.width = this.container.width();
	this.height = this.container.height();
	// Setting index : slide ordered index || indexSlide : slide real index
	this.index = 0;
	this.indexSlide = 0;
	// Number of elements
	this.length = $('li', this.container).length - 1;

	/* Initialize
	//////////////////////////////////////////////////////////////////////// */

	// Identify each slide and control with initial order
	$('> ul > li', this.container).each(function(){
		$(this).attr('data-slide',$(this).index() + 1);

		if($(this).index() == 0){
			$(this).addClass('active');
			$(_infiniteSlider.controls).append('<li class="active" data-slide="'+($(this).index() + 1)+'"><a href="">Slide '+($(this).index() + 1)+'</a></li>');
		} else {
			$(this).addClass('inactive');
			$(_infiniteSlider.controls).append('<li class="inactive" data-slide="'+($(this).index() + 1)+'"><a href="">Slide '+($(this).index() + 1)+'</a></li>');
		}
	});

	$('li', this.controls).each(function(){
		$(this).attr('data-slide',$(this).index() + 1);

		if($(this).index() == 0) $(this).addClass('active');
		else $(this).addClass('inactive');
	});

	// Fill Count values
	if(this.index < 10) $(this.count).html('0'+(this.index + 1)+' / '+(this.length + 1));
	else $(this.count).html((this.index + 1)+' / '+(this.length + 1));

	// Fill First Infos
	if($('> ul > li:eq(0)', this.container).attr('data-infos') != '') $(this.infos).html($('> ul > li:eq(0)', this.container).attr('data-infos'));

	// Disable if just one slide
	if(this.length == 0){
		$(this.controls).hide();
		this.autorotation = false;
	}

	// Initiate Positioning
	this.reset(_infiniteSlider);

	// Bind
	if(this.hover){
		$(this.wrapper).mouseenter(function(){
			_infiniteSlider.stop(_infiniteSlider);
		});
		$(this.wrapper).mouseleave(function(){
			_infiniteSlider.start(_infiniteSlider);
		});
	}

	$('li a',this.controls).click(function(){
		_infiniteSlider.controlsClick($(this),_infiniteSlider);

		return false;
	});

	$('li a',this.arrows).click(function(){
		_infiniteSlider.arrowsClick($(this),_infiniteSlider);

		return false;
	});

	$(window).resize(function(){
		_infiniteSlider.reset(_infiniteSlider);
	});

	// Start Autorotation
	if(this.running) this.autoRotation(_infiniteSlider);

	if(_infiniteSlider.mode == 'slidev') _infiniteSlider.container.height($('> ul > li',_infiniteSlider.container).eq(0).height());
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Autorotation
//
/////////////////////////////////////////////////////////////////////////// */

InfiniteSlider.prototype.autoRotation = function(_infiniteSlider){
	clearTimeout(_infiniteSlider.t);

	if($('li', _infiniteSlider.controls).length > 1 && _infiniteSlider.autorotation){
		if(_infiniteSlider.running){
			_infiniteSlider.t = setTimeout(function(){
				_infiniteSlider.changeSlide(_infiniteSlider.indexSlide,_infiniteSlider.indexSlide + 1,_infiniteSlider)
			},_infiniteSlider.duration);
		}
	}
}

/* ////////////////////////////////////////////////////////////////////////////
//
// External Functions
//
/////////////////////////////////////////////////////////////////////////// */

InfiniteSlider.prototype.start = function(_infiniteSlider){
	_infiniteSlider.running = true;
	_infiniteSlider.autoRotation(_infiniteSlider);

	return false;
}

InfiniteSlider.prototype.stop = function(_infiniteSlider){
	clearTimeout(_infiniteSlider.t);
	_infiniteSlider.running = false;

	return false;
}

InfiniteSlider.prototype.arrowsClick = function(object,_infiniteSlider){
	if(!_infiniteSlider.animated){
		_infiniteSlider.autorotation = false;
		// Stop timer
		clearTimeout(_infiniteSlider.t);

		if($(object).parent().hasClass('next')) var clicked = _infiniteSlider.indexSlide + 1;
		else var clicked = _infiniteSlider.indexSlide - 1;

		_infiniteSlider.changeSlide(_infiniteSlider.indexSlide,clicked,_infiniteSlider);
	}

	return false;
}

InfiniteSlider.prototype.controlsClick = function(object,_infiniteSlider){
	if(!_infiniteSlider.animated && $(object).parent().hasClass('active') == false){
		_infiniteSlider.autorotation = false;
		// Stop timer
		clearTimeout(_infiniteSlider.t);

		var clicked = $(object).parent().index();

		$('> ul > li',_infiniteSlider.container).each(function(){
			if($(this).attr('data-slide') == clicked + 1){
				_infiniteSlider.changeSlide(_infiniteSlider.indexSlide,$(this).index(),_infiniteSlider);
			}
		});
	}

	return false;
}

InfiniteSlider.prototype.reset = function(_infiniteSlider){
	if(!_infiniteSlider.animated){
		_infiniteSlider.stop(_infiniteSlider);
		_infiniteSlider.width = _infiniteSlider.container.width();
		_infiniteSlider.height = _infiniteSlider.container.height();

		$(_infiniteSlider.infos).css('top', ($(_infiniteSlider.container).height()/2 - $(_infiniteSlider.infos).height()/2)+'px');
		if(_infiniteSlider.mode == 'slidev') _infiniteSlider.container.height($('> ul > li',_infiniteSlider.container).eq(_infiniteSlider.indexSlide).height());

		_infiniteSlider.start(_infiniteSlider);
	}
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Change slide
//
/////////////////////////////////////////////////////////////////////////// */

InfiniteSlider.prototype.changeSlide = function(current,clicked,_infiniteSlider){
	_infiniteSlider.animated = true;
	var direction = 'next';
	if(clicked < current) direction = 'previous';

	// Check limits
	if(clicked > _infiniteSlider.length){
		clicked = 0;
	} else if(clicked < 0){
		clicked = _infiniteSlider.length;
	}

	// Redefine active slide
	$('> ul > li',_infiniteSlider.container).removeClass('active').addClass('inactive');
	$('> ul > li',_infiniteSlider.container).eq(clicked).removeClass('inactive').addClass('active');

	if(_infiniteSlider.mode == 'slidev') _infiniteSlider.container.height($('> ul > li',_infiniteSlider.container).eq(clicked).height());

	_infiniteSlider.index = parseInt($('> ul > li.active',_infiniteSlider.container).attr('data-slide')) - 1;
	_infiniteSlider.indexSlide = $('> ul > li.active',_infiniteSlider.container).index();

	// Redefine active control
	$('li',_infiniteSlider.controls).removeClass('active');
	$('li',_infiniteSlider.controls).eq(_infiniteSlider.index).addClass('active');

	// Change Count
	if(_infiniteSlider.index < 9) $(_infiniteSlider.count).html('0'+(_infiniteSlider.index + 1)+' / '+(_infiniteSlider.length + 1));
	else $(_infiniteSlider.count).html((_infiniteSlider.index + 1)+' / '+(_infiniteSlider.length + 1));

	// Animate Infos
	if(_infiniteSlider.wrapper.attr('id') == 'slider-container-slide' && $('#slider-container-slide .animation').length > 0) animationsRows[clicked][1].reset();
	$(_infiniteSlider.infos).fadeOut(_infiniteSlider.speed/2, function(){
		$('> li',_infiniteSlider.infos).hide();
		$('> li',_infiniteSlider.infos).eq(clicked).show();
		$(this).show().css('opacity','0');
		_infiniteSlider.reset(_infiniteSlider);
		$(this).animate({opacity: 1}, _infiniteSlider.speed/2, function(){
			if(_infiniteSlider.wrapper.attr('id') == 'slider-container-slide' && $('#slider-container-slide .animation').length > 0) animationsRows[clicked][1].start(parseInt($('#'+animationsRows[clicked][0]).attr('data-nb-frames')) - 1);
		});
	});

	// Animate Slides
	if(_infiniteSlider.mode == 'slide'){
		// Place new slide AFTER
		if(direction == 'next'){
			$('> ul > li',_infiniteSlider.container).eq(clicked)
				.css('left', _infiniteSlider.width+'px')
				.show();

			// Animate slides
			$('> ul > li',_infiniteSlider.container).animate({left: '-='+_infiniteSlider.width}, {'duration': _infiniteSlider.speed, easing: _infiniteSlider.easing, 'complete': function(){
				_infiniteSlider.animated = false;
				$('> ul > li.inactive',_infiniteSlider.container).hide();
				if(_infiniteSlider.running) _infiniteSlider.autoRotation(_infiniteSlider);
			}});
		}
		// Place new slide BEFORE
		else {
			$('> ul > li',_infiniteSlider.container).eq(clicked)
				.css('left', -_infiniteSlider.width+'px')
				.show();

			// Animate slides
			$('> ul > li',_infiniteSlider.container).animate({left: '+='+_infiniteSlider.width}, {'duration': _infiniteSlider.speed, easing: _infiniteSlider.easing, 'complete': function(){
				_infiniteSlider.animated = false;
				$('> ul > li.inactive',_infiniteSlider.container).hide();
				if(_infiniteSlider.running) _infiniteSlider.autoRotation(_infiniteSlider);
			}});
		}
	}	else if(_infiniteSlider.mode == 'slidev'){
		// Place new slide AFTER
		if(direction == 'next'){
			$('> ul > li',_infiniteSlider.container).eq(clicked)
				.css('top', '150%');

			// Animate slides
			$('> ul > li',_infiniteSlider.container).eq(current).animate({top: '-150%'}, {'duration': _infiniteSlider.speed, easing: _infiniteSlider.easing, 'complete': function(){
				_infiniteSlider.animated = false;
				if(_infiniteSlider.running) _infiniteSlider.autoRotation(_infiniteSlider);
			}});
			$('> ul > li',_infiniteSlider.container).eq(clicked).animate({top: 0}, {'duration': _infiniteSlider.speed, easing: _infiniteSlider.easing});
		}
		// Place new slide BEFORE
		else {
			$('> ul > li',_infiniteSlider.container).eq(clicked)
				.css('top', '-150%');

			// Animate slides
			$('> ul > li',_infiniteSlider.container).eq(current).animate({top: '150%'}, {'duration': _infiniteSlider.speed, easing: _infiniteSlider.easing, 'complete': function(){
				_infiniteSlider.animated = false;
				if(_infiniteSlider.running) _infiniteSlider.autoRotation(_infiniteSlider);
			}});
			$('> ul > li',_infiniteSlider.container).eq(clicked).animate({top: 0}, {'duration': _infiniteSlider.speed, easing: _infiniteSlider.easing});
		}
	} else if(_infiniteSlider.mode == 'fade'){
		// Animate Slides
		$('> ul > li.active',_infiniteSlider.container).fadeIn(_infiniteSlider.speed, function(){
			$('> ul > li',_infiniteSlider.container).eq(current).hide();
			_infiniteSlider.animated = false;
			if(_infiniteSlider.running) _infiniteSlider.autoRotation(_infiniteSlider);
		});
	} else if(_infiniteSlider.mode == 'demask'){
		$('> ul > li.active',_infiniteSlider.container).animate({width: _infiniteSlider.width}, _infiniteSlider.speed, _infiniteSlider.easing, function(){
			$('> ul > li.inactive',_infiniteSlider.container).width(0);
			_infiniteSlider.animated = false;
			if(_infiniteSlider.running) _infiniteSlider.autoRotation(_infiniteSlider);
		});
	} else if(_infiniteSlider.mode == 'columns'){
		$('> ul > li',_infiniteSlider.container).eq(clicked).css('left', '0');
		$('> ul > li',_infiniteSlider.container).eq(current).find('.columns > li > div').animate({width: 0}, _infiniteSlider.speed, _infiniteSlider.easing, function(){
			$('> ul > li',_infiniteSlider.container).eq(current).css('left', '100%');
			$('> ul > li',_infiniteSlider.container).eq(current).find('.columns > li > div').width('100%');
			_infiniteSlider.animated = false;
			if(_infiniteSlider.running) _infiniteSlider.autoRotation(_infiniteSlider);
		});
	}
}

//PNGPreloader



function PNGPreloader(element,frames,width,speed,positioning){
	var _pngPreloader = this;

	// Params
	this.animated = false;
	this.element = element;
	this.frames = frames;
	this.currentFrame = 0;
	this.width = width;
	this.speed = speed;
	this.interval;
	this.delay = (this.frames * this.speed) /2;
	this.positioning = positioning;

	// Bind
	$(window).resize(function(){
		_pngPreloader.positionContent(_pngPreloader);
	});
}

/* ////////////////////////////////////////////////////////////////////////////
//
// External Functions
//
/////////////////////////////////////////////////////////////////////////// */

PNGPreloader.prototype.start = function(goalFrame){
	var _pngPreloader = this;

	if(!_pngPreloader.animated){
		_pngPreloader.animated = true;
		_pngPreloader.interval = setInterval(function(){
			_pngPreloader.animate(goalFrame,_pngPreloader);
		} ,_pngPreloader.speed);
	}
}

PNGPreloader.prototype.pause = function(){
	var _pngPreloader = this;

	_pngPreloader.animated = false;
	clearInterval(_pngPreloader.interval);
}

PNGPreloader.prototype.reset = function(){
	var _pngPreloader = this;

	_pngPreloader.animated = false;
	clearInterval(_pngPreloader.interval);
	_pngPreloader.currentFrame = 0;
	$(_pngPreloader.element).css('background-position', '0 0');
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Animate Images
//
/////////////////////////////////////////////////////////////////////////// */

PNGPreloader.prototype.animate = function(goalFrame,_pngPreloader){
	if (typeof goalFrame !== "undefined") {
	    if(_pngPreloader.currentFrame == goalFrame) _pngPreloader.pause();
	}

	$(_pngPreloader.element).css('background-position', (- _pngPreloader.currentFrame * _pngPreloader.width)+'px 0');

	_pngPreloader.currentFrame ++;
	if(_pngPreloader.currentFrame > _pngPreloader.frames) _pngPreloader.currentFrame = 0;
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Position Content
//
/////////////////////////////////////////////////////////////////////////// */

PNGPreloader.prototype.positionContent = function(_pngPreloader){
	if(_pngPreloader.positioning){
		$(_pngPreloader.element)
			.css('left',($(_pngPreloader.element).parent().width()/2 - $(_pngPreloader.element).width()/2)+'px')
			.css('top',($(_pngPreloader.element).parent().height()/2 - $(_pngPreloader.element).height()/2)+'px');
	}
}

//PNGPreloaderRows


function PNGPreloaderRows(element,frames,width,height,row,speed,positioning){
	var _pngPreloader = this;

	// Params
	this.animated = false;
	this.element = element;
	this.frames = frames;
	this.currentFrame = 0;
	this.width = width;
	this.height = height;
	this.row = row;
	this.speed = speed;
	this.interval;
	this.delay = (this.frames * this.speed) /2;
	this.positioning = positioning;

	// Bind
	$(window).resize(function(){
		_pngPreloader.positionContent(_pngPreloader);
	});
}

/* ////////////////////////////////////////////////////////////////////////////
//
// External Functions
//
/////////////////////////////////////////////////////////////////////////// */

PNGPreloaderRows.prototype.start = function(goalFrame){
	var _pngPreloader = this;

	if(!_pngPreloader.animated){
		_pngPreloader.animated = true;
		_pngPreloader.interval = setInterval(function(){
			_pngPreloader.animate(goalFrame,_pngPreloader);
		} ,_pngPreloader.speed);
	}
}

PNGPreloaderRows.prototype.pause = function(){
	var _pngPreloader = this;

	_pngPreloader.animated = false;
	clearInterval(_pngPreloader.interval);
}

PNGPreloaderRows.prototype.reset = function(){
	var _pngPreloader = this;

	_pngPreloader.animated = false;
	clearInterval(_pngPreloader.interval);
	_pngPreloader.currentFrame = 0;
	$(_pngPreloader.element).css('background-position', '0 0');
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Animate Images
//
/////////////////////////////////////////////////////////////////////////// */

PNGPreloaderRows.prototype.animate = function(goalFrame,_pngPreloader){
	if (typeof goalFrame !== "undefined") {
	    if(_pngPreloader.currentFrame == goalFrame) _pngPreloader.pause();
	}

	var indexX = (_pngPreloader.currentFrame % _pngPreloader.row) * _pngPreloader.width;
	var indexY = (Math.floor(_pngPreloader.currentFrame / _pngPreloader.row)) * _pngPreloader.height;

	$(_pngPreloader.element).css('background-position', (-indexX)+'px '+(-indexY)+'px');

	_pngPreloader.currentFrame ++;
	if(_pngPreloader.currentFrame > _pngPreloader.frames) _pngPreloader.currentFrame = 0;
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Position Content
//
/////////////////////////////////////////////////////////////////////////// */

PNGPreloaderRows.prototype.positionContent = function(_pngPreloader){
	if(_pngPreloader.positioning){
		$(_pngPreloader.element)
			.css('left',($(window).width()/2 - $(_pngPreloader.element).width()/2)+'px')
			.css('top',($(window).height()/2 - $(_pngPreloader.element).height()/2)+'px');
	}
}



});
