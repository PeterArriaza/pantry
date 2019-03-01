function togglePasswordVisibility() {
    let x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

$('#new-password, #confirm-new-password').on('keyup', function () {
    if ($('#new-password').val() == $('#confirm-new-password').val()) {
      $('#password-validation-message').html('Passwords match!').css('color', 'green');
    } else 
      $('#password-validation-message').html('Passwords do not match.').css('color', 'red');
  });
