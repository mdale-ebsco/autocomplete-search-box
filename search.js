$( document ).ready(function() {

  var Facets = {
          PeerReviewed: "Peer Reviewed Articles",
          Catalog: "The Library Catalog"
  };
  var facetsadded = false;

  var custid = jQuery("#eds-autocorrect-searchbox").data("c").trim();
  var filters = jQuery("#eds-autocorrect-searchbox").data("f");
  var selectedFilters = filters.split(',').map(function(item){
    return item.trim();
  });
  console.log(selectedFilters);

  var divs = "";
  var d;
  for(var i=0;i<selectedFilters.length;i++){
    d = '<li id="filter-'+selectedFilters[i]+'" class="ui-menu-item"><div class="ui-menu-item-wrapper ac-filter" id="ui-id-'+i+'"tabindex="-1">Limit Search to '+Facets[selectedFilters[i]]+'</div></li>';
    divs = divs.concat(d);
  }

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
               value: Facets[selectedFilters[i]]
             });
           }
           cache[ term ] = json;
           resp(result);
         });
       },
       select: function(event, ui){
         var value = ui.item.value;

         for(var j = 0; j<selectedFilters.length; j++){
           if(Facets[selectedFilters[j]] == value){
             ui.item.value = result[0].value;
           }
         }

        $(".eds-autocomplete").val(ui.item.value);
        $("#EDS-search-form").submit();
       },
       open: function(event, ui){
         var filterfirst = jQuery(".ui-menu li:first-child" );
         var filtersecondtolast = jQuery(".ui-menu li:nth-last-child(2)" );
         var filterlast = jQuery(".ui-menu li:nth-last-child(1)" );

         filterfirst.after(filtersecondtolast);
         filterfirst.after(filterlast);

       },
       focus: function(event, ui){
         $(".eds-autocomplete").val(ui.item.value);
       }
  });

  $(".eds-autocomplete").autocomplete( "instance" )._renderItem = function( ul, item) {
    var items = $( "<li>" )
      .append( "<div class='ac-label'>" + item.label + "</div>" )
      .appendTo( ul );
    return items;
  };





});
