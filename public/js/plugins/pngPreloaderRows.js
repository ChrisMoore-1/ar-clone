
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
