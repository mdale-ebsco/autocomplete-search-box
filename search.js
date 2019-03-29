$( document ).ready(function() {

  var Facets = {
          RV: "Peer Reviewed Articles",
          FC: "the Library Catalog",
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

var TOKEN_URL = 'https://widgets.ebscohost.com/prod/simplekey/autocomplete/token.php?custid='+custid;

function getToken() {
    return $.ajax({
        url : TOKEN_URL,
        type: 'GET',
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(xhr.status);
          console.log(thrownError);
          console.log(xhr.responseText);
        }
    });
}

getToken().done(doAutocomplete);

function doAutocomplete(data){
  var token = data.token;
  console.log("Token generated: "+token);
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
         $.getJSON("https://f9q8ycr499.execute-api.us-east-1.amazonaws.com/prod/auto/"+ custid +"/"+ encodeURIComponent(token) +"/"+ encodeURIComponent(req.term), function(json) {
          result = json;
          if(result.length > 0){
           if(result[0].error){
             if($(".eds-autocomplete").hasClass('ui-autocomplete-input')){
               $(".eds-autocomplete").autocomplete( "destroy" );
             }
             console.log("Token is expired");
             getToken().done(doAutocomplete);
           }
           else{
             for(var i = 0; i < selectedFilters.length; i++){
               result.push({
                 label: Facets[selectedFilters[i]],
                 value: selectedFilters[i]
               });
             }
           }
          }
           cache[ term ] = json;
          // console.log(result);
           resp(result);
         });
       },
       select: function(event, ui){
         //TODO: create cli0 input elements dynamically
         var value = ui.item.value;
         if(selectedFilters.includes(value)){
             ui.item.value = result[0].value;
             $("input[name=cli0]").val(value);
             $("input[name=clv0]").val("Y");
         }
        event.preventDefault();
        $(".eds-autocomplete").val(ui.item.value);
        $("#EDS-search-form").submit();

        //reset html inputs
        $("input[name=cli0]").val("");
        $("input[name=clv0]").val("N");
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

}



});
