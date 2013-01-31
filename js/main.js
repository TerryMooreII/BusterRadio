



require.config({
    baseUrl: "js",
    paths: {
        'jquery': 'vendor/jquery-1.9.0.min',
        'bootstrap': 'vendor/bootstrap.min',
        'knockout': 'vendor/knockout-2.2.1',
        'jqueryui': 'vendor/jquery-ui-1.10.0.custom.min'
    },
    shim: {
        'bootstrap': ['jquery'],
        'jqueryui': ['jquery']
    }
});




require(['jquery','knockout', 'viewModels/AppViewModel', 'bootstrap', 'artistsList', 'jqueryui'], function($, ko, AppViewModel){

    var viewModel = new AppViewModel();
    ko.applyBindings(viewModel);
    viewModel.init();

    $('#searchArtists').typeahead({source:list, onselect: function() { $(this).change(); }});
    
    $('#myTab a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    })
    
    $( "#slider" ).slider({
      range: "max",
      value: 0,
      min: 0,
      max: 700, //sceconds
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.value );
      }
    });

});

