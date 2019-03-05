$('#EDSsearch').on('submit', function(e){
  e.preventDefault();
  var query = $('#EDS-query').val();
  searchEDS(query);
});

var autocompleteToken = "";
function autocomplete(inp, arr) {
  console.log(inp);
  getAutocompleteToken(function(token){
    autocompleteToken = token;
    console.log("Autocomplete Token: " + autocompleteToken);
  });


}

function getAutocompleteToken(handleData){
  $.ajax({
    type: "GET",
    url: "https://gss.ebscohost.com/mdale/Phoenix/autocomplete-search-box/search.php",
    timeout: 2000,
    dataType:"json",
    success: function(result){
      handleData(result.Autocomplete.Token);
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


function renderResults(data){
    if (data.SearchResult.Statistics.TotalHits > 0) {
      var results = data.SearchResult.Data.Records;
      console.log(results);
      for (i = 0; i < results.length; i++){
        var plink = results[i].PLink;

        for(j = 0; j < results[i].Items.length; j++){
          console.log(results[i].Items[j].Data);
          //Not every Record has Items
        }
      }

      $('#EDS-results-wrapper').html(results.Items[0].Data);
    }
    else {
      $('#EDS-results-wrapper').append('<div id="no-results">No Results Found</div>');
    }
  }


  function searchEDS (query) {
      var searchterms = encodeURIComponent(query);

  }
