'use strict';
const hikeKey = '200374662-587dcab816d8b46ebb6a1320143c05e8';
const googleKey = 'AIzaSyAlfZawjUjjPhFVgPP55skv22vktzNhPGM';
const googleUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
const hikeURL = 'https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10';

//formats the params for the google maps converter
function formatQueryParamsGoogle(googleParams) {
  const googleQueryItems = Object.keys(googleParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(googleParams[key])}`)
  return googleQueryItems.join('&');
}

//converts address to lat and long
function convertAddress(addressQuary) {
  const googleParams = {
      address: addressQuary,
      key: googleKey

    };
    const googleQueryString = formatQueryParamsGoogle(googleParams)
    const url = googleUrl + '?' + googleQueryString;

    console.log(url);


}


//formats the params for the hiking api
function formatQueryParamsHiking() {

}


//dispalys the results from the hiking api
function displayResults() {

}

//Get request to the hiking api
function getHikeingData() {

}


//watches the form values from the user
function watchForm() {
  //display the slider
  let sliderElement = $("#slider-range");
  $(function() {
    sliderElement.slider({
      range: true,
      min: 0,
      max: 100,
      values: [0, 100],
      slide: function(event, ui) {
        $("#amount").val(ui.values[0] + " - " + ui.values[1]);
      }
    });
    $("#amount").val($("#slider-range").slider("values", 0) +
      " - " + $("#slider-range").slider("values", 1));
    pushForm(sliderElement);

  });

  function pushForm() {
    $('form').submit(event => {
      event.preventDefault();
      const minMile = sliderElement.slider('values', 0);
      const maxMile = sliderElement.slider('values', 1);
      const addressQuary = $('#search-input').val();
      console.log(minMile);
      console.log(maxMile);
      console.log(addressQuary);
      convertAddress(addressQuary);

    });
  }
}


$(watchForm);
