const log = (string) => console.log(string);

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
        $(".admin-view").hide();
      } else {
        $("#login-btn").html(`Logout`)
        $("#login-submit").val(`Logout`)
        $(".login-input").show();
        $(".admin-view").hide();
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
          $(".admin-view").show();
          adminView();
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
    $(".admin-view").hide();
    $(".login-error").html(`
                        <div id="myModal" class="modal-component pt-2">
                            <div class="modal-content border border-warning p-2 text-center">
                                <div>You are logged out!</div>
                            </div>
                        </div>
                    `);
    $.post("php/api.php", { action: "logout" }, (data) => {
      console.log(data)
    })
  }
})

/**
 * Admin interface with a list of all reservation </br>
 * as well as filters handlers
 * @author Fred
 */
const adminView = () => {
  let reservations = [];

  const renderTable = (filteredReservations) => {
    const tableBody = $(".chalet-list");
    tableBody.empty();

    filteredReservations.map((rsv) => {
      tableBody.append(`
        <tr>
          <td>${rsv.chalet_id}</td>
          <td>${rsv.prenom}</td>
          <td>${rsv.nom}</td>
          <td>${rsv.email}</td>
          <td>${rsv.telephone}</td>
          <td>${rsv.personnes}</td>
          <td>${rsv.start}</td>
          <td>${rsv.status_id}</td>
        </tr>
      `);
    });
  };

  /**
   * Filter reservations based on name or email
   * @param {*} searchTerm 
   * @author Fred
   */
  const filterReservations = (searchTerm) => {
    return reservations.filter((rsv) => {
      const { nom, prenom, email } = rsv;
      return (
        nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  /**
   * Filter reservations based on star date
   * @param {*} searchTerm 
   * @author Fred
   */
  const sortReservations = (reservations, order) => {
    return reservations.sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      if (order === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  // fetch chalet list and then appy filter
  $.post("php/api.php", { action: "fetch" }, (data) => {
    reservations = data.rsv;
    renderTable(reservations);
  }, "json");

  $("#filter-input").on("input", () => {
    const searchTerm = $("#filter-input").val().trim();
    const filteredReservations = filterReservations(searchTerm);
    const order = $("#order-select").val();
    const sortedReservations = sortReservations(filteredReservations, order);
    renderTable(sortedReservations);
  });

  $("#order-select").on("change", () => {
    const searchTerm = $("#filter-input").val().trim();
    const filteredReservations = filterReservations(searchTerm);
    const order = $("#order-select").val();
    const sortedReservations = sortReservations(filteredReservations, order);
    renderTable(sortedReservations);
  });
};
