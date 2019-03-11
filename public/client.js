'use strict';

// get values of email and password
function loginSubmit() {
    $('#login-submit').on('click', function (event) {
        console.log('submitted')
        event.preventDefault();
        let email = $('#login-email').val();
        let password = $('#login-password').val();
        console.log(email, password);
        $('#login-email').val("");
        $('#login-password').val("");
        // validate login credentials
        if (email == "") {
            alert('Please input email');
        } else if (password == "") {
            alert('Please input password');
        } else {
            console.log('user validated');
            const loginUserObject = {
                email: email,
                password: password
            };
            $.ajax({
                    type: 'POST',
                    url: '/users/login',
                    dataType: 'json',
                    data: JSON.stringify(loginUserObject),
                    contentType: 'application/json'
                })
                //if call is succefull
                .done(function (result) {
                    console.log(result);

                })
                //if the call is failing
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                });
        };

    });
}

$(document).ready(function () {
    $('#login-page').show();
    $('#sign-up-page').hide();
    $('#new-pantry-page').hide();
    $('#inventory-page').hide();
    $('#new-item-page').hide();
    $(loginSubmit);
});

function showLoginScreen() {
    $(document).ready(function () {
        $('#login-page').show();
        $('#sign-up-page').hide();
        $('#new-pantry-page').hide();
        $('#inventory-page').hide();
        $('#new-item-page').hide();
        $(loginSubmit);
    });
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

// Check to see if email is already in database
function checkDuplicateEmail(inputEmail) {
    $.ajax({
            type: 'GET',
            url: `/check-duplicate-email/${inputEmail}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function (result) {
            if (result.entries.length !== 0) {
                alert("Sorry, that email is already in use")
            }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

$('#sign-up-email').on('blur', function (event) {
    event.preventDefault();
    let email = $('#sign-up-email').val();
    checkDuplicateEmail(email);
})

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
                    if (pantry) {
                        alert('Thank you for signing up!');
                        // show existing pantry page that user signed up for
                    } else {
                        alert('Thank you for signing up! Now please create a new Pantry to keep track of your food items.');
                        showNewPantryPage();
                    }
                })
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                });
        };
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

        // validate pantry credentials
        if (pantryName == "") {
            alert('Please input Pantry name');
        } else {
            console.log('pantry validated');
            const pantryObject = {
                pantryName: pantryName,
                memberEmail: memberArray
            };
            $.ajax({
                    type: 'POST',
                    url: '/pantry/create',
                    dataType: 'json',
                    data: JSON.stringify(loginUserObject),
                    contentType: 'application/json'
                })
                //if call is succefull
                .done(function (result) {
                    console.log(result);
                })
                //if the call is failing
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                });

        };
    })
};

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
    $(saveChanges);
    //    $('.edit-buttons-row').hide();
}

function addNewItem() {
    $('#new-item-button').on('click', function () {
        showNewItemPage();
    });
}

function editItems() {
    //    $('.mydiv').addClass('hover').click(function () {
    //        $(this).addClass('hover').fadeOut();
    //    });
    //
    //    $('a.mybutton').click(function () {
    //        $('.mydiv').toggleClass('hover').show();
    //    }).hover(function () {
    //        $('.mydiv.hover').fadeIn();
    //    }, function () {
    //        $('.mydiv.hover').fadeOut();
    //    });
    //    $('.item-row').addClass('hover').click(function () {
    //        $(this).addClass('hover').fadeOut();
    //    });
    $('.edit-items').on('click', function () {
        $(this).closest('.item-row').attr('contenteditable', 'true');
        $(this).closest('.item-row').addClass('edit-items-border');
        //        $(this).closest('.edit-buttons-row').attr('display', 'flex');
        $(this).closest('.item-row').toggleClass('hover').show();
        $('.edit-items').hide();
        $('.save-changes').show();
        //        $('.edit-buttons-row').attr('display', 'flex');
    });
    //        .hover(function () {
    //        $(this).closest('.item-row.hover').fadeIn();
    //    }, function () {
    //        $(this).closest('.item-row.hover').fadeOut();
    //    });
}

function saveChanges() {
    $('.save-changes').on('click', function () {
        $(this).closest('.item-row').attr('contenteditable', 'false');
        $(this).closest('.item-row').removeClass('edit-items-border');
        $('.edit-items').show();
        $('.save-changes').hide();
    })
}
