$( document ).ready(function() {

  var Facets = {
          RV: "Peer Reviewed Articles",
          FC: "The Library Catalog",
          FT: "Full Text Available"
  };

  var custid = jQuery("#eds-autocorrect-searchbox").data("c").trim();
  var filters = jQuery("#eds-autocorrect-searchbox").data("f");
  var selectedFilters = filters.split(',').map(function(item){
    return item.trim();
  });
  console.log(selectedFilters);

  var autocompleteToken = "";

  var cache = {};
  var result;
  $(".eds-autocomplete").autocomplete({
       minLength: 3,
       source: function(req, resp) {
         var term = req.term;
         if ( term in cache ) {
           resp( cache[ term ] );
           return;
         }
         $.getJSON("https://f9q8ycr499.execute-api.us-east-1.amazonaws.com/dev/auto/"+ req.term, function(json) {
           result = json;
           for(var i = 0; i < selectedFilters.length; i++){
             result.push({
               label: Facets[selectedFilters[i]],
               value: selectedFilters[i]
             });
           }
           cache[ term ] = json;
           console.log(result);
           resp(result);
         });
       },
       select: function(event, ui){
         var value = ui.item.value;

         if(selectedFilters.includes(value)){
             ui.item.value = result[0].value;
             $("#fname").val(value);
             $("#fvalue").val("Y");
         }

        $(".eds-autocomplete").val(ui.item.value);
        $("#EDS-search-form").submit();

        //reset html inputs
        $("#fname").val("");
        $("#fvalue").val("N");
       },
       open: function(event, ui){
         var filterfirst = jQuery(".ui-menu li:first-child" );
         var filtersecondtolast = jQuery(".ui-menu li:nth-last-child(2)" );
         var filterlast = jQuery(".ui-menu li:nth-last-child(1)" );

         filterfirst.after(filtersecondtolast);
         filterfirst.after(filterlast);

       },
       focus: function(event, ui){
         if(selectedFilters.includes(ui.item.value)){
           event.preventDefault();
           $(".eds-autocomplete").val(result[0].value);
         }
       }
  });

  $(".eds-autocomplete").autocomplete( "instance" )._renderItem = function( ul, item) {
      var items;
      if(selectedFilters.includes(item.value)){
        items = $( "<li>" )
          .append( "<div class='filter-label'>limit to " + item.label + "</div>" )
          .appendTo( ul );
      }
      else{
        items = $( "<li>" )
          .append( "<div class='ac-label'>" + item.label + "</div>" )
          .appendTo( ul );
      }
    return items;
  };





});
