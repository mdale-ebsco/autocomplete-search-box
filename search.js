$( document ).ready(function() {

  var autocompleteToken = "";
  var custid = "";

  var cache = {};
  $(".eds-autocomplete").autocomplete({
       minLength: 3,
       source: function(req, resp) {
         var term = req.term;
         if ( term in cache ) {
           resp( cache[ term ] );
           return;
         }
         $.getJSON("https://f9q8ycr499.execute-api.us-east-1.amazonaws.com/dev/auto/"+ req.term, function(json) {
           var result = json;
           cache[ term ] = json;
           if(json.length == 0){
             result = [
              {
              label: 'No matches found',
              value: 0
              }
            ];
            cache[term] = result;
           }
           resp(result);
         });
       },
       select: function(event, ui){
         $(".eds-autocomplete").val(ui.item.value);
         $("#EDS-search-form").submit();
       }
  }).autocomplete( "instance" )._renderItem = function( ul, item ) {
    return $( "<li>" )
      .append( "<div>" + item.label + "</div>" )
      .appendTo( ul );
  };

});
