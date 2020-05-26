const { Octokit } = require("@octokit/rest"); //Github API
const $ = require("jquery"); //Web DOM
const showdown = require('showdown') // Markdown -> HTML Converter 

const converter = new showdown.Converter();
const octokit = new Octokit();

owner = "GreXLin85", repo = "ClearJobList"

octokit.issues.listForRepo({
  owner,
  repo,
}).then((OctokitResponse) => {

  if (OctokitResponse.data.length != 0) {
    for (let i = 0; i < OctokitResponse.data.length; i++) {
      if (OctokitResponse.data[i].labels[0].name == "job") {
        let date = new Date(OctokitResponse.data[i].created_at)

        $(document).ready(function () {
          $("#jobs").append(
            '<div class="card text-center">' +
            '<a type="button" onclick="a()" href="#' + OctokitResponse.data[i].number + '" class="btn btn-secondary bg-white text-dark border border-success" data-container="body" data-toggle="popover" data-placement="top" >' +
            'Click to me for see more detail' +
            '</a>' +
            '<div class="card-body">' +
            '<h5 class="card-title">' + OctokitResponse.data[i].title + '</h5>' +
            //'<p class="card-text">' + OctokitResponse.data[i].body.substr(0, 100) + '</p>' +
            '</div>' +
            '<div class="card-footer text-muted">' +
            ZeroedToZeroedNumber(NumberToZeroed(date.getUTCDay())) + "." + ZeroedToZeroedNumber(NumberToZeroed(date.getUTCMonth())) + "." + date.getUTCFullYear() +
            '</div>' +
            '</div><br>'
          );
        });
      }
    }
  } else {
    $(document).ready(function () {
      $("#jobs").append(
        "No jobs found <br>" +
        '<a href="https://github.com/GreXLin85/IWantRemoteJob/issues/new"><kbd>Click me</kbd></a> if you want to post a job advertisement'
      );
    });
  }


})
//Stolen from stackoverflow lol
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

window.a = async function a() {

  $("#jobs").html(
    '<div class="d-flex justify-content-center">' +
    '<div class="spinner-border" role="status">' +
    '<span class="sr-only">Loading...</span>' +
    '</div>' +
    '</div>')



  await sleep(10)

  let issue_numbers = await (window.location.hash.substr(1, window.location.hash.length))

  octokit.issues.get({
    owner,
    repo,
    issue_number: await issue_numbers
  }).then((OctokitResponse) => {
    $("#jobs").html(
      '<div class="card">' +
      '<a type="button"  href="/" class="btn btn-secondary bg-white text-dark border border-success text-center" data-container="body" data-toggle="popover" data-placement="top">' +
      'Go Back!' +
      '</a>' +
      '<div class="card-body">' +
      '<h5 class="card-title text-center">' + OctokitResponse.data.title + '</h5>' +
      '<p class="card-text">' + converter.makeHtml(OctokitResponse.data.body) + '</p>' +
      '</div>' +
      '</div><br>'
    )
  })
}


function NumberToZeroed(number) {
  if (number.toLocaleString().length == 1) {
    return ["0"].concat(number.toLocaleString().split(""))
  } else {
    return number.toLocaleString().split("")
  }
}

function ZeroedToZeroedNumber(Zeroed) {
  let ZeroedNumber = 0
  for (let i = 0; i < Zeroed.length; i++) {
    ZeroedNumber += Zeroed[i];
  }
  return ZeroedNumber.toString().substr(1, ZeroedNumber.toString().length)
}