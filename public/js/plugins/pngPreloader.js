

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
