$('[data-copy-to]').each(function()
{
  var target = $( this ).data( 'copy-to');
  var html = this.innerHTML;
  var lines = html.split('\n');
  var minPadding = Number.MAX_VALUE;

  for (var i = lines.length - 1; i >= 0; i--) {
    if ( $.trim( lines[ i ] ).length === 0 ) {
      lines.splice( i, 1 );
    }
  }

  for (var i = 0; i < lines.length; i++) {
    var line = lines[ i ];
    var padding = 0;
    while (padding < line.length && line[ padding ] <= ' ') {
      padding++;
    }
    minPadding = Math.min( minPadding, padding );
  }

  if (minPadding !== Number.MAX_VALUE) {
    for (var i = 0; i < lines.length; i++) {
      lines[ i ] = lines[ i ].substring( minPadding );
    }
  }

  $(function() {
    $( target ).text( lines.join('\n') );    
  });

});