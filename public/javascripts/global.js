var userListData = [];
$(document).ready(function() {
  populateTableContent();
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  $('#btnAddUser').on('click', addUser);
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
  $('#userList table tbody').on('click', 'td a.linkupdateuser', changeUserInfo);
  $('#btnCancelUpdateUser').on('click', togglePanels);
  $('#updateUser input').on('change', function() {
    $(this).addClass('updated')
  })
  $('#btnUpdateUser').on('click', updateUser);


})

function populateTableContent() {
  var tableContent = '';
  $.getJSON('/users/userlist', function(data) {
    userListData = data;

    $.each(data, function() {
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a>/<a href="#" class="linkupdateuser" rel="' + this._id + '">update</a></td>';
      tableContent += '</tr>';
    });
    $('#userList table tbody').html(tableContent);
  })
}

function showUserInfo(event) {
  event.preventDefault();
  var thisUserName = $(this).attr('rel');
  var arrayPosition = userListData.map(function(arrayItem) {
    return arrayItem.username;
  }).indexOf(thisUserName);
  var thisUserObject = userListData[arrayPosition];

  //Populate Info Box
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);

}

function addUser(event) {
  event.preventDefault();
  var errorCount = 0;
  var newUser;
  $('#addUser input').each(function(index, val) {
    if ($(this).val() === '') {
      errorCount++;
    }
  });

  if (errorCount === 0) {
    newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    };

  } else {
    newUser = randomCreateUser();

  }

  $.ajax({
    type: 'POST',
    data: newUser,
    url: '/users/adduser',
    dataType: 'JSON'
  }).done(function(res) {
    if (res.msg === '') {
      $('#addUser fieldset input').val('');

      // Update the table
      populateTableContent();
    } else {
      alert('Error: ' + response.msg);

    }
  })
}

function updateUser(event) {
  event.preventDefault();
  var confirmation = confirm('Are you sure you want to update this user?');

  if (confirmation === true) {
    var _id = $('#updateUser').attr('rel');
    var fieldsToBeUpdated = $('#updateUser input.updated');
    var fields = {}
    $(fieldsToBeUpdated).each(function() {
      //fix later
      var key = $(this).attr('placeholder').replace(" ", "").toLowerCase();
      var value = $(this).val();
      fields[key] = value;
    })
    $.ajax({
      type: 'PUT',
      url: 'users/updateuser/' + _id,
      data: fields
    }).done(function(res) {
      if (res.msg === '') {
        togglePanels();

      } else {
        alert('error: ' + res.msg)
      }
    })
    populateTableContent();
  } else {
    return false;
  };

}

function deleteUser(event) {
  event.preventDefault();
  var confirmation = confirm('Are you sure you want to delete?');
  console.log($(this).attr('rel'));
  if (confirmation) {
    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel')

    }).done(function(res) {
      if (res.msg === '') {

      } else {
        alert('Error delete user: ' + res.msg)
      }

    })
    populateTableContent();
  } else {
    return false;
  }
}

function changeUserInfo(event) {
  event.preventDefault();
  if ($('#addUserPanel').is(":visible")) {
    togglePanels();
  }
  var _id = $(this).attr('rel');

  var arrayPosition = userListData.map(function(arrayItem) {
    return arrayItem._id;
  }).indexOf(_id);
  var thisUserObject = userListData[arrayPosition];

  //Populate Info Box
  $('#updateUserFullname').val(thisUserObject.fullname);
  $('#updateUserAge').val(thisUserObject.age);
  $('#updateUserGender').val(thisUserObject.gender);
  $('#updateUserLocation').val(thisUserObject.location);
  $('#updateUserName').val(thisUserObject.username);
  $('#updateUserEmail').val(thisUserObject.email);


  $('#updateUser').attr('rel', thisUserObject._id);

}

function togglePanels() {
  $('#addUserPanel').toggle();
  $('#updateUserPanel').toggle();
}


function randomCreateUser() {
  var newUser = new User();
  console.log(newUser);
  return newUser;
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function User() {
  this.username = 'user' + getRandomInt(0, 1000)
  this.email = this.username + '@domainemail.com';
  this.fullname = 'full_' + this.username;
  this.age = getRandomInt(20, 40);
  this.location = 'HCM, Vietnam'
  this.gender = 'male';
}
