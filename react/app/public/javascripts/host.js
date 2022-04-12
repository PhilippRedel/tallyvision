// set host socket settings
var socket = io('/host');

// reset scoreboard voting controls and hide widget on ballot close event
socket.on('appBallotClose', function() {
  var ui = $('#ui-voting');

  $('button.ballot-close').hide();
  $('button.ballot-open').show();
  $('.badge', ui).html('Closed');
  $('.card-body', ui).hide();
});

// update scoreboard voting controls and show widget on ballot open event
socket.on('appBallotOpen', function(contestant) {
  var tr = $('tr#' + contestant.code);
  var ui = $('#ui-voting');

  $('button.ballot-close', tr).show();
  $('button.ballot-open').hide();
  $('.badge', ui).html('Open');
  $('.card-body .contestant-country', ui).html(contestant.country);
  $('.card-body .contestant-details', ui).html(contestant.artist + ' – "' + contestant.title + '"');
  $('.card-body', ui).show();
});

// update voters widget on voters event
socket.on('hostVoters', function(voters) {
  var tbody = '';
  var ui = $('#ui-voters');

  for (let {connected, name, voted} of voters) {
    var tr = '<tr id="' + name + '">';

    tr += '<td class="col-connected text-center text-nowrap ' + connected + '"></td>';
    tr += '<td class="col-name">' + name + '</td>';
    tr += '<td class="col-voted text-center text-nowrap ' + voted + '"></td>';

    tbody += tr + '</tr>';
  }

  $('.badge', ui).html(voters.length);

  if (voters.length > 0) {
    $('.card-body .table tbody', ui).html(tbody);
    $('.card-body', ui).show();
  } else {
    $('.card-body', ui).hide();
  }
});

// update total scores for all contestants on scoreboard event
socket.on('hostScoreboard', function(scores) {
  var ui = $('#ui-scoreboard');

  for (let {contestant, votes, score} of scores) {
    $('tr#' + contestant + ' .col-score', ui).addClass('text-hidden');
    $('tr#' + contestant + ' .col-score', ui).html(score);
    $('tr#' + contestant + ' .col-votes', ui).html(votes);
  }
});

// update PCA scores for defined category on category event
socket.on('pcaCategory', function(category, scores) {
  pcaTableBody(category, scores);
});

// update PCA GNBP scores on GNBP event
socket.on('pcaGNBP', function(scores) {
  pcaTableBody('gnbp', scores);
});

// update PCA total scores for all contestant on total event
socket.on('pcaTotal', function(scores) {
  pcaTableBody('total', scores);
});

// emit ballot close event on button click
$('button.ballot-close').on('click', function() {
    socket.emit('hostBallotClose');
});

// emit ballot open event on button click
$('button.ballot-open').on('click', function() {
  var i = $(this).attr('data-index');

  socket.emit('hostBallotOpen', i);
});

// remove blur from PCA table rows on click
$('#pca').on('click', 'tr.text-hidden', function() {
  $(this).removeClass('text-hidden');
});

// play PCA theme song on image click
$('#pca').on('click', '#panel-pca img', function() {
  var theme = new Audio('../media/theme.mp3');

  theme.play();
});

// generate PCA table markup and update defined panel
function pcaTableBody(panel, scores) {
  var tbody = '';

  for (let [i, {contestant, votes, score}] of scores.entries()) {
    var place = i + 1;
    var tr = '<tr class="text-hidden" id="' + contestant.code + '">';

    tr += '<th class="col-place text-center text-nowrap">' + place + '</th>';
    tr += '<td class="col-flag text-center text-nowrap"><img src="/media/flags/' + contestant.code + '.svg"></td>';
    tr += '<td class="col-contestant">';
    tr += '<span class="contestant-country">' + contestant.country + '</span>';
    tr += '<span class="contestant-details">' + contestant.artist + ' – "' + contestant.title + '"</span>';
    tr += '</td>';
    tr += '<td class="col-score text-center">' + score + '</td>';

    tbody += tr + '</tr>';
  }

  $('.table tbody', '#panel-' + panel).html(tbody);
}
