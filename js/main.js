'use strict';
const hikeKey = '200374662-587dcab816d8b46ebb6a1320143c05e8';
const googleKey = 'AIzaSyAlfZawjUjjPhFVgPP55skv22vktzNhPGM';
const googleUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
const hikeURL = 'https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10';




//formats the params for the hiking api
function formatQueryParamsHiking(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}


//dispalys the results from the hiking api
function displayResults(responseJson) {
  console.log(responseJson);
      $('#results-list').empty();

    for (let i = 0; i < responseJson.trails.length; i++){





      $('#results-list').append(
        `<ul><a href='${responseJson.trails[i].url}'>${responseJson.trails[i].name}</a>
        <p>${responseJson.trails[i].summary}</p>
        <img src='${responseJson.trails[i].imgSmallMed}' alt='${responseJson.trails[i].name} photo'>
        <br>
        <h3>Trail Detail</h3>
        <li>Location: ${responseJson.trails[i].location}</li>
        <li>Length: ${responseJson.trails[i].length}</li>
        <li>Condition: ${responseJson.trails[i].conditionStatus}</li>
        <li>Max Altitude: ${responseJson.trails[i].high}</li>
        <li>Min Altitude: ${responseJson.trails[i].low}</li>
        <li>Difficulty: ${responseJson.trails[i].difficulty}</li>


        </ul>`
      )};
    //display the results section
    $('#results').removeClass('hidden');

}

//Get request to the hiking api
function getHikeingData(googleLat, googleLng, minMile, maxMile) {
  console.log(minMile);
  console.log(googleLng);
  console.log(googleLat);
  const params = {
    lat: googleLat,
    lon: googleLng,
    maxDistance: 10,
    minLength: minMile,
    key: hikeKey

  };
  const queryString = formatQueryParamsHiking(params)
      const url = hikeURL + '?' + queryString;
      console.log(url);
      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
          $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}


//handles the slider, the form, converts user city to lat and long,
function handleGoogle() {
  //display the slider
  let sliderElement = $("#slider-range");
  $(function() {
    sliderElement.slider({
      range: false,
      min: 0,
      values: [0],
      slide: function(event, ui) {
        $("#amount").val(ui.values[0]);
      }
    });
    $("#amount").val($("#slider-range").slider("values", 0));
    pushForm(sliderElement);
  });

  // Get data from user
  function pushForm() {
    $('form').submit(event => {
      event.preventDefault();
      const minMile = sliderElement.slider('values', 0);
      const addressQuary = $('#search-input').val();
      convertAddress(addressQuary);
      //formats the params for the google maps converter
      function formatQueryParamsGoogle(googleParams) {
        const googleQueryItems = Object.keys(googleParams)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(googleParams[key])}`)
        return googleQueryItems.join('&');
      }

      //converts address to lat and long4
      function convertAddress(addressQuary) {
        const googleParams = {
          address: addressQuary,
          key: googleKey

        };
        const googleQueryString = formatQueryParamsGoogle(googleParams)
        const url = googleUrl + '?' + googleQueryString;

        //fetch data from Google api
        fetch(url)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.statusText);
          })
          .then(responseJson => getLatLong(responseJson))
          .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
          });
      }
      //get lat and long
      function getLatLong(responseJson) {
        for (let i = 0; i < responseJson.results.length; i++) {
          let googleLng = responseJson.results[i].geometry.location.lng;
          let googleLat = responseJson.results[i].geometry.location.lat;
          getHikeingData(googleLat, googleLng, minMile);
        }
      }
    });
  }
}


$(handleGoogle);
