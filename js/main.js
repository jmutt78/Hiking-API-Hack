'use strict';
const hikeKey = '200374662-587dcab816d8b46ebb6a1320143c05e8';
const googleKey = 'AIzaSyAlfZawjUjjPhFVgPP55skv22vktzNhPGM';
const googleUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
const hikeURL = 'https://www.hikingproject.com/data/get-trails';

//formats the params for the hiking api
function formatQueryParamsHiking(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//dispalys the results from the hiking api
function displayResults(responseJson) {
  $('#results-list').empty();
  $('#no-results-list').empty();
  $('#search-bar').trigger("reset");

  //If the results are not 0 then it loops through the object.
  if (responseJson.trails.length != 0) {
    for (let i = 0; i < responseJson.trails.length; i++) {
      $('#results-list').append(
        `<div class="card mb-3">
  <h3 class="card-header">${responseJson.trails[i].name}</h3>
  <div class="card-body">
    <h5 class="card-title">${responseJson.trails[i].location}</h5>
  </div>
 <img src='${responseJson.trails[i].imgSmallMed}' onerror="this.style.display='none'" alt='${responseJson.trails[i].name} photo'>
  <div class="card-body">
    <p class="card-text">${responseJson.trails[i].summary}</p>
  </div>
        <ul class="list-group list-group-flush">
        <li class="list-group-item">Length: ${responseJson.trails[i].length} Miles</li>
        <li class="list-group-item">Condition: ${responseJson.trails[i].conditionStatus}</li>
        <li class="list-group-item">Max Altitude: ${responseJson.trails[i].high}ft</li>
        <li class="list-group-item" style="color: #ffa707; font-weight: bold; background-color: ${responseJson.trails[i].difficulty};”>Min Altitude: ${responseJson.trails[i].low}</li>
        <li class="list-group-item">Difficulty: ${responseJson.trails[i].difficulty}</li>
        </ul>
  <div class="card-body">
     <a href='${responseJson.trails[i].url}' target="_blank">Learn More</a>
  </div>`
      )
    };
  } else {
    $('#no-results-list').append(`<h3>Sorry! No Results Found</h3>`)
  }
  //display the results section
  $('#results').removeClass('hidden');
}

//Get request to the hiking api
function getHikeingData(googleLat, googleLng, minMile, maxMile) {
  const params = {
    lat: googleLat,
    lon: googleLng,
    maxDistance: 15,
    maxResults: 50,
    minLength: minMile,
    key: hikeKey
  };
  const queryString = formatQueryParamsHiking(params)
  const url = hikeURL + '?' + queryString;
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
      const addressJoin = $('#search-input').val();
      const addressQuary = addressJoin.split(' ').join('+')
      convertAddress(addressQuary);
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
  //rest the slider
  function resetSlider() {
    var $slider = $("#slider-range");
    $slider.slider("values", 0, initialMinimumValue);
  }
}


$(handleGoogle);
