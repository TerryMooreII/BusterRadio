



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

require(['knockout'], function(ko){

    ko.bindingHandlers.sortDate = {

            init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                // This will be called when the binding is first applied to an element
                // Set up any initial state, event handlers, etc. here
                //console.log('here')
                //console.log(allBindingsAccessor())
                console.log(allBindingsAccessor().sortDate)
            },
            update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                // This will be called once when the binding is first applied to an element,
                // and again whenever the associated observable changes value.
                // Update the DOM element based on the supplied values here.
                console.log('update')
            }
        };
})


require(['jquery','knockout', 'viewModels/AppViewModel', 'bootstrap', 'artistsList', 'jqueryui'], function($, ko, AppViewModel){
    
    var viewModel = new AppViewModel();
    ko.applyBindings(viewModel);
    viewModel.init();

    // $('#searchArtists').typeahead({
    //                                 source:list, 
    //                                 onselect: function() { 
    //                                     $(this).change(); 
    //                                 }
    //                             });

    $('#searchArtists').autocomplete({
      source: list,
      select: function( event, ui ) {
        $('#searchArtists').val(ui.item.value).change(); 
      }
    });
    
    $('#myTab a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    
    //setup an empty slitder
    $( "#slider" ).slider({
      range: "max",
      value: 0,
      min: 0,
      max: 700
    });
    $('.ui-slider-handle').height(10).width(10);


});

