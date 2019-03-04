// on #login-page, if checkbox is checked, will toggle 
// password visibility
function togglePasswordVisibility() {
    let x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
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

function loginSubmit() {
    $('#login-sumbit').on('click', function (event) {
        event.preventDefault();
        let email = $('#login-email').val();
        let password = $('#password').val();
        console.log(email);
        console.log(password);
        $('#login-email').val("");
        $('#password').val("");
    });
}

$(loginSubmit);
