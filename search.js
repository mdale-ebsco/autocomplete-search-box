$( document ).ready(function() {

  var Facets = {
          RV: "Peer Reviewed Articles",
          FC: "The Library Catalog",
          FT: "Full Text Available Online",
          FT1: "Full Text Available in Print or Online",
          FC1: "Institutional Repository"
  };

  var custid = jQuery("#eds-autocorrect-searchbox").data("c").trim();
  var filters = jQuery("#eds-autocorrect-searchbox").data("filters");
  var selectedFilters = [];
  if(filters){
    selectedFilters = filters.split(',').map(function(item){
      return item.trim();
    });
  }
//  console.log(selectedFilters);

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
           if(result.length > 0){
           for(var i = 0; i < selectedFilters.length; i++){
             result.push({
               label: Facets[selectedFilters[i]],
               value: selectedFilters[i]
             });
           }
         }
           cache[ term ] = json;
          // console.log(result);
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
        event.preventDefault();
        $(".eds-autocomplete").val(ui.item.value);
        $("#EDS-search-form").submit();

        //reset html inputs
        $("#fname").val("");
        $("#fvalue").val("N");
        ui.item.value = value;
       },
       open: function(event, ui){
         for(var i = 0; i < selectedFilters.length; i++){
           var filterfirst = jQuery(".ui-menu li:first-child" );
           var filterlast = jQuery(".ui-menu li:nth-last-child(1)" );
           filterfirst.after(filterlast);
         }
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
