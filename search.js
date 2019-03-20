$( document ).ready(function() {

  var custid = jQuery("#eds-autocorrect-searchbox").data("c").trim();
  var autocompleteToken = "";

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
