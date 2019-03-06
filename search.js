$( document ).ready(function() {
  $('#EDSsearch').on('submit', function(e){
    e.preventDefault();
    var query = $('#EDS-query').val();
    searchEDS(query);
  });

  var autocompleteToken = "";
  var custid = "";

  getAutocompleteToken(function(token, cid){
    autocompleteToken = encodeURIComponent(token);
    console.log("Autocomplete Token: " + autocompleteToken);
    custid = cid;
    console.log("CustId: " + custid);

    if ( window.jQuery ) {
      console.log("Jquery loaded");

    var cache = {};
    $("#EDS-query").autocomplete({
         delay: 100,
         minLength: 3,
         source: function(req, resp) {
           var term = req.term;
           if ( term in cache ) {
             resp( cache[ term ] );
             return;
           }
           $.getJSON("https://f9q8ycr499.execute-api.us-east-1.amazonaws.com/dev/auto/" + custid + "/" + autocompleteToken + "/" + req.term, function(json) {
             console.log(json);
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
         }
    }).autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<div>" + item.label + "</div>" )
        .appendTo( ul );
    };
        }


  });


  function getAutocompleteToken(handleData){
    $.ajax({
      type: "GET",
      url: "https://gss.ebscohost.com/mdale/Phoenix/autocomplete-search-box/search.php",
      timeout: 2000,
      dataType:"json",
      success: function(result){
        handleData(result.Autocomplete.Token, result.Autocomplete.CustId);
      },
      error: function (jqXHR, exception, errorThrown) {
          var msg = '';
          if (jqXHR.status === 0) {
              msg = 'Not connected.\nVerify Network.';
          } else if (jqXHR.status == 404) {
              msg = 'Requested page not found. [404]';
          } else if (jqXHR.status == 500) {
              msg = 'Internal Server Error [500].';
          } else if (exception === 'parsererror') {
              msg = 'Requested JSON parse failed.';
          } else if (exception === 'timeout') {
              msg = 'Time out error.';
          } else if (exception === 'abort') {
              msg = 'Ajax request aborted.';
          } else {
              msg = 'Uncaught Error.\n' + jqXHR.responseText;
          }
          console.log(msg + "  " + exception + "  " + errorThrown);
      }
    });
  }

});
