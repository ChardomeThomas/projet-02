const log = (string) => {
  console.log(string);
}

/**
 * Show login ou logout depending if the user is connected </br>
 * and there's a session 
 * @author Fred
 */
$(document).ready(() => {
  $.post(
    "php/api.php",
    { action: "session" },
    (data) => {
      if (data.session === "none") {
        $("#login-btn").html(`Login`)
        $("#login-submit").val(`Login`)
        $(".login-input").show();
        $(".logout-input").hide();
      } else {
        $("#login-btn").html(`Logout`)
        $("#login-submit").val(`Logout`)
        $(".login-input").show();
        $(".logout-input").hide();
      }
    },
    "json"
  );
});

$("#login-submit").on("click", () => {
  let username = $("#username").val().trim();
  let password = $("#pwd").val().trim();
  let buttonVal = $("#login-submit").val().trim();

  if (buttonVal === 'Login') {
    $.post(
      "php/api.php",
      {
        action: "login",
        username: username,
        pwd: password,
      },
      (data) => {
        if (data.error) {
          $(".login-error").html(`
                        <div id="myModal" class="modal-component pt-2">
                            <div class="modal-content border border-danger p-2 text-center">
                                <div>${data.error}</div>
                            </div>
                        </div>
                    `);
        } else {
          $("#login-btn").html(`Logout`)
          $("#login-submit").val(`Logout`)
          $(".login-input").hide();
          $(".logout-input").show();
          $(".login-error").html(`
                        <div id="myModal" class="modal-component pt-2">
                            <div class="modal-content border border-success p-2 text-center">
                                <div>You are logged in!</div>
                            </div>
                        </div>
                    `);
        }
      },
      "json"
    );
  }
  else {
    $("#login-btn").html(`Login`)
    $("#login-submit").val(`Login`)
    $(".login-input").show();
    $(".logout-input").hide();
    $.post("php/api.php", { action: "logout" }, (data) => {
      console.log(data)
    })
  }
})