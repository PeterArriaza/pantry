'use strict';

$(document).ready(function () {
    $('#login-page').show();
    $('#sign-up-page').hide();
    $('#new-pantry-page').hide();
    $('#inventory-page').hide();
    $('#new-item-page').hide();
    $(loginSubmit);
})

// get values of email and password
function loginSubmit() {
    $('#login-sumbit').on('click', function (event) {
        event.preventDefault();
        let email = $('#login-email').val();
        let password = $('#login-password').val();
        $('#login-email').val("");
        $('#login-password').val("");
        validateUser(email, password);
    });
}

function validateUser(email, password) {
    console.log('test passed');
}

// on #login-page, if checkbox is checked, will toggle 
// password visibility
function togglePasswordVisibility() {
    let x = document.getElementById("login-password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function showSignUpPage() {
    $('#login-page').hide();
    $('#sign-up-page').show();
    $('#new-pantry-page').hide();
    $('#inventory-page').hide();
    $('#new-item-page').hide();
    $(signUpSubmit);
}

// dynamically tells user if password and confirmation password 
// match during new account sign up. Will show that password does not 
// match before confirmation password is typed
$('#new-password, #confirm-new-password').on('keyup', function () {
    if ($('#new-password').val() == $('#confirm-new-password').val()) {
        $('#password-validation-message').html('Passwords match!').css('color', 'green');
    } else
        $('#password-validation-message').html('Passwords do not match.').css('color', 'red');
});

// get values from new user sign up form
function signUpSubmit() {
    $('#sign-up-submit').on('click', function (event) {
        event.preventDefault();
        let firstName = $('#sign-up-first-name').val();
        let lastName = $('#sign-up-last-name').val();
        let email = $('#sign-up-email').val();
        let password = $('#new-password').val();
        let confirmPassword = $('#confirm-new-password').val();
        let pantry = $('#sign-up-pantry').val();
        $('#sign-up-first-name').val("");
        $('#sign-up-last-name').val("");
        $('#sign-up-email').val("");
        $('#new-password').val("");
        $('#confirm-new-password').val("");
        $('#confirm-new-password').val("");
        $('#sign-up-pantry').val("");

        if (firstName == "") {
            alert('Please enter first name!');
        } else if (lastName == "") {
            alert('Please enter last name!');
        } else if (email == "") {
            alert('Please enter an email');
        } else if (password == "") {
            alert('Please enter a password');
        } else if (password !== confirmPassword) {
            alert('Passwords must match!');
        } else {
            const newUserObject = {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                pantry: pantry
            };
            console.log(newUserObject);
            $.ajax({
                    type: 'POST',
                    url: '/users/create',
                    dataType: 'json',
                    data: JSON.stringify(newUserObject),
                    contentType: 'application/json'
                })
                .done(function (result) {
                    $('.js-signin-success').html('Thanks for signing up! Please sign in.');
                    $('.js-signin-success').addClass('change-status-success');
                    showLogInScreen();
                })
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                });
        };

        showNewPantryPage();
    });
}

function showNewPantryPage() {
    $('#login-page').hide();
    $('#sign-up-page').hide();
    $('#new-pantry-page').show();
    $('#inventory-page').hide();
    $('#new-item-page').hide();
    $(newPantrySubmit);
}

function newPantrySubmit() {
    $('input[type=submit]').on('click', function (event) {
        event.preventDefault();
        let pantryName = $('input[type=text]').val();
        let memberEmail = $('input[type=email]').val();
        // /\s/g = regex for global whitespace
        let memberArray = memberEmail.replace(/\s/g, '').split(',');
        $('input[type=text]').val("");
        $('input[type=email]').val("");
        createPantry(pantryName, memberArray);
    });
}

function createPantry(pantryName, memberArray) {
    console.log(pantryName, memberArray);
}

function showNewItemPage() {
    $('#login-page').hide();
    $('#sign-up-page').hide();
    $('#new-pantry-page').hide();
    $('#inventory-page').hide();
    $('#new-item-page').show();
    $(newItemSubmit);
    $(handleNewItemCancel);
}

function newItemSubmit() {
    $('#new-item-submit').on('click', function (event) {
        event.preventDefault();
        let itemName = $('#new-item-name').val();
        let quantity = $('#new-item-quantity').val();
        let units = $('#new-item-units').val();
        let description = $('#new-item-description').val();
        let price = $('#new-item-price').val();
        $('#new-item-name').val("");
        $('#new-item-quantity').val("");
        $('#new-item-units').val("");
        $('#new-item-description').val("");
        $('#new-item-price').val("");
        createNewItem(itemName, quantity, units, description, price);
    });
}

function createNewItem(itemName, quantity, units, description, price) {
    console.log(itemName, quantity, units, description, price);
}

function handleNewItemCancel() {
    $('#new-item-cancel').on('click', function () {
        showInventoryPage();
    });
}

function showInventoryPage() {
    $('#login-page').hide();
    $('#sign-up-page').hide();
    $('#new-pantry-page').hide();
    $('#inventory-page').show();
    $('#new-item-page').hide();
    $(addNewItem);
    $(editItems);
}

function addNewItem() {
    $('#new-item-button').on('click', function () {
        showNewItemPage();
    });
}

function editItems() {
    $('#edit-items-button').on('click', function (event) {
        $('.inventory-table').attr('contenteditable', 'true');
        $('.inventory-table').addClass('edit-items-border');
        $('#edit-items-button').hide();
        $('#save-changes-button').show();
        $(saveChanges);
    });
}

function saveChanges() {
    $('#save-changes-button').on('click', function () {
        $('.inventory-table').attr('contenteditable', 'false');
        $('.inventory-table').removeClass('edit-items-border');
        $('#edit-items-button').show();
        $('#save-changes-button').hide();
    })
}
