

require.config({
    baseUrl: "js",
    paths: {
        'jquery': 'vendor/jquery-1.9.0.min',
        'bootstrap': 'vendor/bootstrap.min',
        'knockout': 'vendor/knockout-2.2.1',
        'jqueryui': 'vendor/jquery-ui-1.10.0.custom.min',
        'sammyjs': 'vendor/sammy-latest.min'
    },
    shim: {
        'bootstrap': ['jquery'],
        'jqueryui': ['jquery'],
        'sammyjs': ['jquery']
    }
});




require(['jquery','knockout', 'viewModels/AppViewModel', 'bootstrap', 'artistsList', 'jqueryui'], function($, ko, AppViewModel){
    
    ko.bindingHandlers.tooltips = {
        // init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            
        //     var value = valueAccessor();
        //     var defaults = {
        //         placement:'right',
        //         title:'missing',

        //     }
        //     var tooltip = $.extend(defaults, value);
        //     console.log(tooltip)
        //     $(element).tooltip(tooltip);
        // }
        // ,
        update:function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = valueAccessor();
            var defaults = {
                placement:'right',
                title:'missing'
            }
            var tooltip = $.extend(defaults, value);
            console.log(tooltip)
            $(element).tooltip(tooltip)

        }
    };
    
    var viewModel = new AppViewModel();
    ko.applyBindings(viewModel);
    viewModel.init();

    $('#searchArtists').autocomplete({
      source: list,
      select: function( event, ui ) {
        //console.log(ui.item)
        $(this).val(ui.item.label).change(); 
      }
    });
    
    $('#myTab a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    $('#tabsInfo a').click(function (e) {
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
    $('.ui-slider-handle').height(7).width(7);


});

