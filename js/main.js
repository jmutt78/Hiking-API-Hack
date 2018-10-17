



//Displays the slider
function displaySlider() {
  $( function() {
     $( "#slider-range" ).slider({
       range: true,
       min: 0,
       max: 100,
       values: [ 0, 100 ],
       slide: function( event, ui ) {
         $( "#amount" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
       }
     });
     $( "#amount" ).val( "" + $( "#slider-range" ).slider( "values", 0 ) +
       " - " + $( "#slider-range" ).slider( "values", 1 ) );

   } );
}


//formats the params for the hiking api
function formatQueryParamsHiking() {

}

//formats the params for the google maps converter
function formatQueryParamsGoogle() {

}

//converts address to lat and long
function convertAddress() {

}

//dispalys the results from the hiking api
function displayResults() {

}

//Get request to the hiking api
function getHikeingData() {

  }


//watches the form values from the user
function watchForm() {
displaySlider();


  }


$(watchForm);
