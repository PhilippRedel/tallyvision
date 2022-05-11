// set client local storage key
const LOCAL_STORAGE = 'tallyvisionName';

// set client socket settings
var socket = io('/client', {
  autoConnect: false,
});

// show scorecard on ballot close event
socket.on('appBallotClose', function() {  
  uiShow('scorecard');
});

// reset and show ballot form on ballot open event
socket.on('appBallotOpen', function(contestant) {
  var ui = $('#ui-ballot');

  $('form', ui).show();
  $('form fieldset', ui).prop('disabled', false);
  $('form input[type="radio"]', ui).prop('checked', false);
  $('form label', ui).removeClass('active');
  $('.card-header .contestant-country', ui).html(contestant.country);
  $('.card-header .contestant-details', ui).html(contestant.artist + ' – "' + contestant.title + '"');
  $('.card-header .contestant-score', ui).html('');

  uiShow('ballot');
});

// hide ballot form and show total score on voted event
socket.on('appVoted', function(score) {
  var ui = $('#ui-ballot');

  $('form', ui).hide();
  $('.card-header .contestant-score', ui).html(score);
});

// save name to local storage and show scorecard on connect event
socket.on('clientConnect', function(name) {
  localStorage.setItem(LOCAL_STORAGE, name);

  $('.navbar-brand').html(name);

  uiShow('scorecard');
});

// update total scores for all contestant on scorecard event
socket.on('clientScorecard', function(scores) {
  var ui = $('#ui-scorecard');

  for (let {id, voter, contestant, score} of scores) {
    $('tr#' + contestant + ' .col-score', ui).html(score);
  }
});

// disable form on submit
$('form').on('submit', function(event) {
  event.preventDefault();

  $('fieldset', this).prop('disabled', true);
});

// emit GNBB event on button click
$('#gnbb button').on('click', function() {
  socket.emit('clientGNBB');
});

// validate ballot form on click / press
$('#ui-ballot form').on('click', function() {
  formBallotValidate(this);
});

// emit ballot submission event on ballot form submit
$('#ui-ballot form').on('submit', function() {
  var checked = $('input[type="radio"]:checked', this);
  var scores = [];

  scores = checked.map(function(i, field) {
    return parseInt($(field).val());
  }).get();

  socket.emit('clientBallotSubmit', scores);
});

// validate join form on key up
$('#ui-join form').on('keyup', function() {
  formJoinValidate(this);
});

// connect as client socket on join form submit
$('#ui-join form').on('submit', function() {
  var nameInput = $('input#name', this);

  formJoinConnect(nameInput.val());
});

// check if name was previously saved to local storage and show join form 
function __init() {
  var form = $('#ui-join form');
  var nameLocal = localStorage.getItem(LOCAL_STORAGE);

  if (nameLocal) {
    $('input#name', form).val(nameLocal);
  }

  // manual reconnect
  formJoinValidate(form);
  uiShow('join');

  // automatic reconnect
  /* if (nameLocal) {
    formJoinConnect(nameLocal);
  } else {
    formJoinValidate(form);
    uiShow('join');
  } */
}

// check if all radio fields are checked and set submit button properties
function formBallotValidate(form) {
  var error = false;
  var categories = $('li.list-group-item', form);
  var checked = $('input[type="radio"]:checked', form);

  if (checked.length !== categories.length) {
    error = true;
  }

  formSubmitProp(form, error);
}

// set socket name property and connect as client socket
function formJoinConnect(name) {
  socket.auth = {
    name: name,
  };

  socket.connect();
}

// check if name field is filled and set submit button properties
function formJoinValidate(form) {
  var error = false;
  var nameInput = $('input#name', form);

  if (!nameInput.val()) {
    error = true;
  };

  formSubmitProp(form, error);
}

// check for errors and set submit button properties
function formSubmitProp(form, error) {
  if (error) {
    $('button[type="submit"]', form).prop('disabled', true);
  } else {
    $('button[type="submit"]', form).prop('disabled', false);
  }
}

// show defined UI element
function uiShow(ui) {
  $('html').scrollTop(0);
  $('[id*="ui-"]').hide();
  $('#ui-' + ui).show();
}

__init();
