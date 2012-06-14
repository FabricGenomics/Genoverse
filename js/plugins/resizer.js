// Default css
// Reason it's here is so that developer only has to include this js file for entire plugin functionality
// Any additional custom css will overwrite it
document.styleSheets[0].insertRule('body.dragging *                                     { cursor: n-resize!important; }', 0);
document.styleSheets[0].insertRule('.canvas_container .resizer                          { position: absolute; bottom: 0; opacity: 0.8; background-color: #F0F0F0; height: 5px; cursor: n-resize; z-index: 2; }', 0);
document.styleSheets[0].insertRule('.canvas_container .resizer.shadow                   { box-shadow: 0 -3px 5px 0 #000000; margin-left: -5px; padding-right: 10px; }', 0);
document.styleSheets[0].insertRule('.canvas_container .resizer .handle                  { background-color: white; border: 1px solid #5A5A5A; border-width: 1px 0; height: 1px; margin: 1px 48%; width: 4%; }', 0);
document.styleSheets[0].insertRule('.canvas_container .resizer.shadow .handle           { position: relative; left: 5px }', 0);
document.styleSheets[0].insertRule('.canvas_container .resizer:hover, .canvas_container \
                                    .resizer.ui-draggable-dragging                      { box-shadow: 0 -5px 7px -3px #000000 inset!important; }', 0);

CBrowse.Track.on('afterInit', function () {
  if (!this.resizable) {
    return;
  }

  var track = this;
  
  this.resizer = (this.resizer || $('<div class="resizer"><div class="handle"></div></div>').appendTo(this.container).draggable({ 
    axis   : 'y',
    start  : function () { $('body').addClass('dragging'); },
    stop   : function (e, ui) {
      $('body').removeClass('dragging');
      track.resize(track.height + ui.position.top - ui.originalPosition.top, true);
      $(this).css({ top: 'auto' }); // returns the resizer to the bottom of the container - needed when the track is resized to 0
    }
  }).on('click', function () {
    if (track.fullVisibleHeight) {
      track.resize(track.fullVisibleHeight, true);
    }
  })).css({ width: this.width, left: -this.cBrowse.left }).show();
  
  if (this.height - this.spacing === this.featureHeight) {
    this.resize(this.height + this.resizer.height());
    this.initialHeight = this.height;
  }
});

CBrowse.Track.on('afterToggleExpander', function () {
  if (this.resizer) {
    this.resizer.css('left', -this.cBrowse.left);
    
    if (this.expander) {
      this.resizer[this.expander.filter(':visible').hide().length ? 'addClass' : 'removeClass']('shadow');
    }
  }
});

CBrowse.on('afterMove afterZoomIn afterZoomOut', function () {
  $('.resizer', this.wrapper).css('left', -this.left);
});