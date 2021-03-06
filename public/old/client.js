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
                    $('#loggedInUser').val(result._id);
                    $('#loggedInUserFirstName').val(result.firstName);
                    $('#loggedInUserLastName').val(result.lastName);
                    $('#userPantry').val(result.pantry);
                    let pantry = $('#userPantry').val();
                    console.log(pantry);
                    showInventoryPage(pantry);
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
    $('#welcomeModal').show();
    $('#login-page').hide();
    $('#sign-up-page').hide();
    $('#new-pantry-page').hide();
    $('#inventory-page').hide();
    $('#new-item-page').hide();
    let isshow = localStorage.getItem('isshow');
    if (isshow == null) {
        localStorage.setItem('isshow', 1);

        // Show popup here
        $('#myWelcomeMessage').show();
        $('#closeWelcomeMessage').on('click', function (event) {
            showLoginScreen();
        });
    } else {
        showLoginScreen();
    }
});

function showLoginScreen() {
    $('#welcomeModal').hide();
    $('#login-page').show();
    $('#sign-up-page').hide();
    $('#new-pantry-page').hide();
    $('#inventory-page').hide();
    $('#new-item-page').hide();
    $(loginSubmit);
};

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

function populatePantries(pantries) {
    for (let i = 0; i < pantries.length; i++) {
        let pantry = pantries[i];
        let name = pantries[i].pantryName;
        console.log(name);
        $('#sign-up-pantry').append(
            `<option value="${pantries[i]._id}">${pantries[i].pantryName}</option>`
        );
    };

}


function showSignUpPage() {
    $.ajax({
            type: 'GET',
            url: `/get-pantries`,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function (result) {
            console.log(result.pantries);
            populatePantries(result.pantries);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
    $('#welcomeModal').hide();
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
$('#confirm-new-password').on('keyup', function () {
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
            console.log(result.entries.length);
            $('#emailDuplicated').val(result.entries.length);
            let emailLength = result.entries.length;
            if (emailLength !== 0) {
                alert('Email is already in use');
            };
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

// get values from new user sign up form
function signUpSubmit() {
    $('#sign-up-submit').on('click', function (event) {
        let checkEmailStatus = true;
        event.preventDefault();
        let firstName = $('#sign-up-first-name').val();
        let lastName = $('#sign-up-last-name').val();
        let email = $('#sign-up-email').val();
        let password = $('#new-password').val();
        let confirmPassword = $('#confirm-new-password').val();
        let pantry = $('#sign-up-pantry').val();
        if (pantry == null) {
            alert('Please create a new pantry or create an existing one');
            return;
        };
        $('#sign-up-first-name').val("");
        $('#sign-up-last-name').val("");
        $('#sign-up-email').val("");
        $('#new-password').val("");
        $('#confirm-new-password').val("");
        $('#confirm-new-password').val("");
        $.ajax({
                type: 'GET',
                url: `/check-duplicate-email/${email}`,
                dataType: 'json',
                contentType: 'application/json'
            })
            .done(function (users) {
                console.log(users.entries.length);
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
                } else if (users.entries.length !== 0) {
                    alert('Email is already in use');
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
                            $('#loggedInUser').val(result._id);
                            $('#loggedInUserFirstName').val(result.firstName);
                            $('#loggedInUserLastName').val(result.lastName);

                            let user = $('#loggedInUser').val();
                            if (pantry != 'create') {
                                console.log(result);
                                alert('Thank you for signing up!');
                                // show existing pantry page that user signed up for
                                $('#userPantry').val(result.pantry);
                                console.log(result.pantry);
                                $('#userPantryName').inner(result.pantry);

                                showInventoryPage(user);
                            } else {
                                alert('Thank you for signing up! Now please create a new Pantry to keep track of your food items.');
                                showNewPantryPage();
                            };
                        })
                        .fail(function (jqXHR, error, errorThrown) {
                            console.log(jqXHR);
                            console.log(error);
                            console.log(errorThrown);
                        });
                }
            }).fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    });
}

function showNewPantryPage() {
    $('#welcomeModal').hide();
    $('#login-page').hide();
    $('#sign-up-page').hide();
    $('#new-pantry-page').show();
    $('#inventory-page').hide();
    $('#new-item-page').hide();
    $(newPantrySubmit);
}

function addPantryToUser(user, pantry) {
    console.log(user);
    const updateObject = {
        pantry: $('#userPantry').val(),
        _id: user
    };
    $.ajax({
            type: 'PUT',
            url: '/add-user-pantry/' + user,
            dataType: 'json',
            data: JSON.stringify(updateObject),
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            console.log('Pantry added to User');
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function newPantrySubmit() {
    $('#new-pantry-submit').on('click', function (event) {
        event.preventDefault();
        let pantryName = $('#name-of-pantry').val();
        let user = $('#loggedInUser').val();
        $('#name-of-pantry').val("");
        // validate pantry credentials
        if (pantryName == "") {
            alert('Please input Pantry name');
        } else {
            console.log('pantry validated');
            const pantryObject = {
                pantryName: pantryName,
                memberIds: user
            };
            console.log(pantryObject);
            $.ajax({
                    type: 'POST',
                    url: '/pantry/create',
                    dataType: 'json',
                    data: JSON.stringify(pantryObject),
                    contentType: 'application/json'
                })
                //if call is succefull
                .done(function (result) {
                    console.log(result);
                    $('#userPantry').val(result._id);
                    addPantryToUser(user, pantryName);
                    showInventoryPage(user);
                    $('#userPantryName').html(pantryName);
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

function getUserPantryName(user) {
    const userObject = {
        _id: user
    };
    $.ajax({
        type: 'GET',
        url: '/users/' + user,
        dataType: 'json',
        data: JSON.stringify(userObject),
        contentType: 'application/json'
    }).done(function (res) {
        console.log(res);
    }).fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });
};

function displayItem(item) {
    let username = $('#loggedInUserFirstName').val() + " " + $('#loggedInUserLastName').val();
    let itemId = item._id;

    $('#pantryContent').append(
        `<div class="item-row" onclick="">
                <input type="hidden" value="${itemId}" class="itemId">
                <div class="item-detail item-name">${item.name}</div>
                <div class="item-detail item-qty">${item.quantity}</div>
                <div class="item-detail item-unit">${item.units}</div>
                <div class="item-detail item-description">${item.description}</div>
                <div class="item-detail item-price">${item.price}</div>
                <div class="item-detail item-added-by">${username}</div>
                <div class="edit-buttons-row">
                    <button class="edit edit-items">Edit Item</button>
                    <button class="edit save-changes">Save Changes</button>
                    <button class="edit delete-item">- Delete Item</button>
                </div>
        </div>`);

}

function showInventoryPage(pantry) {
    console.log('showInventory page called');
    $('#pantryContent').empty();
    // perform ajax call to get user's inventory
    const itemObject = {
        pantryId: pantry
    };
    $.ajax({
        type: 'GET',
        url: '/show-pantry/' + pantry,
        dataType: 'json',
        data: JSON.stringify(itemObject),
        contentType: 'application/json'
    }).done(function (res) {
        console.log(res);
        $('#login-page').hide();
        $('#sign-up-page').hide();
        $('#new-pantry-page').hide();
        $('#inventory-page').show();
        $('#new-item-page').hide();

        $.each(res, function (key, value) {
            displayItem(value);
        });
        $(saveChanges);
        $(addNewItem);
        $(editItems);
        $(deleteItem);
    }).fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });

    //    $('.edit-buttons-row').hide();
}

function showNewItemPage() {
    $('#welcomeModal').hide();
    $('#login-page').hide();
    $('#sign-up-page').hide();
    $('#new-pantry-page').hide();
    $('#inventory-page').hide();
    $('#new-item-page').show();
    $(newItemSubmit);
    $(handleNewItemCancel);
}

function clearError(input, span) {
    $(input).keyup(function (event) {
        //        $(`#${span}`).empty()
        $(span).empty();
        return;
    });
}

function newItemSubmit() {
    $('#new-item-submit').on('click', function (event) {
        event.preventDefault();
        let itemName = $('#new-item-name').val();
        let quantity = $('#new-item-quantity').val();
        let units = $('#new-item-units').val();
        let description = $('#new-item-description').val();
        let price = $('#new-item-price').val();
        let date = new Date();
        let pantryId = $('#userPantry').val();
        if (itemName == "") {
            $('#itemNameError').text('Item name is required');
            clearError('#new-item-name', '#itemNameError');
            return;
        } else if (quantity == "") {
            $('#qtyNameError').text('Quantity is required');
            return;
        } else if (units == "") {
            $('#unitsError').text('Units are required');
            return;
        } else {
            let user = $('#loggedInUser').val();
            console.log('item validated');
            console.log(date);
            const newItemObject = {
                name: itemName,
                quantity: quantity,
                units: units,
                description: description,
                price: price,
                addedByUserId: user,
                addedTimestamp: date,
                updatedTimestamp: date,
                pantryId: pantryId
            };
            $.ajax({
                    type: 'POST',
                    url: '/add-new-item/' + user,
                    dataType: 'json',
                    data: JSON.stringify(newItemObject),
                    contentType: 'application/json'
                })
                //if call is succefull
                .done(function (result) {
                    console.log(result);
                    showInventoryPage(pantryId);
                })
                //if the call is failing
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                });
        };
        $('#new-item-name').val("");
        $('#new-item-quantity').val("");
        $('#new-item-units').val("");
        $('#new-item-description').val("");
        $('#new-item-price').val("");
    });
}

function handleNewItemCancel() {
    $('#new-item-cancel').on('click', function () {
        $('#new-item-page').hide();
        $('#inventory-page').show();
    });
}

function addNewItem() {
    $('#new-item-button').on('click', function () {
        showNewItemPage();
    });
}

function editItems() {
    $('.edit-items').on('click', function (event) {
        $(this).closest('.item-row').attr('contenteditable', 'true');
        $(this).closest('.item-row').addClass('edit-items-border');
        //        $(this).closest('.edit-buttons-row').attr('display', 'flex');
        $('.edit-items').hide();
        $('.save-changes').hide();
        $(this).closestz('.item-row').toggleClass('hover').show();
        $(this).hide();
        $(this).parent().find('.save-changes').show();
    });
}

function saveChanges() {
    $('.save-changes').on('click', function () {
        $(this).closest('.item-row').attr('contenteditable', 'false');
        $(this).closest('.item-row').removeClass('edit-items-border');
        $('.edit-items').show();
        $(this).hide();

        //        get values of items row content
        let itemName = $(this).parent().parent().find('.item-name').text();
        let quantity = $(this).parent().parent().find('.item-qty').text();
        let units = $(this).parent().parent().find('.item-unit').text();
        let description = $(this).parent().parent().find('.item-description').text();
        let price = $(this).parent().parent().find('.item-price').text();
        let date = new Date();
        //        let itemId = $(this).parent().parent().find('.itemId').val();
        let itemId = $(this).parent().parent().find('.itemId').val();
        //        let pantryId = $('#userPantry').val();
        console.log(itemId);
        const newItemObject = {
            name: itemName,
            quantity: quantity,
            units: units,
            description: description,
            price: price,
            updatedTimestamp: date
        };
        console.log(newItemObject);
        $.ajax({
                type: 'PUT',
                url: '/update-item/' + itemId,
                dataType: 'json',
                data: JSON.stringify(newItemObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                //                showInventoryPage(pantryId);
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });

    });
}

function deleteItem() {
    $('.delete-item').on('click', function () {
        let itemId = $(this).parent().parent().find('.itemId').val();

        let itemName = $(this).parent().parent().find('.item-name').text();
        console.log(itemId, itemName);
        let confirmDelete = confirm(`Are you sure you want to delete ${itemName}?`);
        if (confirmDelete == true) {
            handleDeleteItem(itemId);
        } else {
            showInventoryPage($('#userPantry').val());
        }
    });
}

function handleDeleteItem(itemId) {

    $.ajax({
            type: 'DELETE',
            url: '/delete-item/' + itemId,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            showInventoryPage($('#userPantry').val());
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });

}
