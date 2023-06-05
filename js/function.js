const log = (string) => console.log(string);

/**
 * Show login or logout depending on whether the user is connected </br>
 * and there's a session 
 */
$(document).ready(() => {
  $.post(
    "php/api.php",
    { action: "session" },
    (data) => {
      if (data.session === "none") {
        $("#login-btn").html(`Login`)
        $("#login-submit").val(`Login`)
        $("#modal-ctn").removeClass("modal-fullscreen")
        $(".login-input").show();
        $(".admin-view").hide();
      } else {
        $("#login-btn").html(`Admin view`)
        $("#login-submit").val(`Logout`)
        $("#modal-ctn").addClass("modal-fullscreen")
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
          $(".login-error").fadeIn().delay(3000).fadeOut();
        } else {
          $("#login-btn").html(`Admin view`)
          $("#login-submit").val(`Logout`)
          $("#modal-ctn").addClass("modal-fullscreen")
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
          $(".login-error").fadeIn().delay(3000).fadeOut();
        }
      },
      "json"
    );
  }
  else {
    $("#login-btn").html(`Login`)
    $("#login-submit").val(`Login`)
    $("#modal-ctn").removeClass("modal-fullscreen")
    $(".login-input").show();
    $(".admin-view").hide();

    $(".login-error").html(`
                        <div id="myModal" class="modal-component pt-2">
                            <div class="modal-content border border-warning p-2 text-center">
                                <div>You are logged out!</div>
                            </div>
                        </div>
                    `);
    $(".login-error").fadeIn().delay(3000).fadeOut();

    $.post("php/api.php", { action: "logout" }, (data) => {
      console.log(data)
    })
  }
});

/**
 * Admin interface with a list of all reservations </br>
 * as well as filter handlers
 */
const adminView = () => {
  let reservations = [];
  let sortOrders = {
    start: "asc",
    creation_date: "asc",
    nom: "asc",
    prenom: "asc",
  };

  const renderTable = (filteredReservations) => {
    const tableBody = $(".chalet-list");
    tableBody.empty();

    filteredReservations.map((rsv) => {
      tableBody.append(`
        <tr >
          <td>${rsv.c_name}</td>
          <td>${rsv.prenom}</td>
          <td>${rsv.nom}</td>
          <td>${rsv.email}</td>
          <td>${rsv.telephone}</td>
          <td>${rsv.personnes}</td>
          <td><input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" ${rsv.breakfast ? "checked" : ""} disabled></td>
          <td><input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" ${rsv.dinner ? "checked" : ""} disabled></td>
          <td><input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" ${rsv.spa ? "checked" : ""} disabled></td>
          <td>${rsv.start}</td>
          <td>${rsv.creation_date}</td>
          <td>${rsv.status}</td>
        </tr>
      `);
    });
  };

  /**
   * Filter reservations based on name or email
   * @param {*} searchTerm 
   */
  const filterReservations = (searchTerm, chaletName, status) => {
    return reservations.filter((rsv) => {
      const { nom, prenom, email, c_name, status: rsvStatus } = rsv;
      const searchTermMatch =
        nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase());
      const chaletMatch = chaletName === "ALL" || c_name === chaletName;
      const statusMatch = status === "ALL" || rsvStatus === status;
  
      return searchTermMatch && chaletMatch && statusMatch;
    });
  };

  /**
   * Filter reservations based on chalet
   * @param {*} chaletName 
   */
  const filterReservationsByChalet = (chaletName) => {
    if (chaletName === "ALL") {
      return reservations;
    } else {
      return reservations.filter((rsv) => {
        return rsv.c_name === chaletName;
      });
    }
  };

  /**
   * Filter reservations based on status
   * @param {*} status 
   */
  const filterReservationsByStatus = (status) => {
    if (status === "ALL") {
      return reservations;
    } else {
      return reservations.filter((rsv) => {
        return rsv.status === status;
      });
    }
  };

  /**
   * Sort reservations based on clicked element
   * @param {*} reservations 
   * @param {*} sortBy 
   * @param {*} order 
   */
  const sortReservations = (reservations, sortBy) => {
    const currentOrder = sortOrders[sortBy];
  
    if (currentOrder === "asc") {
      sortOrders[sortBy] = "desc";
    } else {
      sortOrders[sortBy] = "asc";
    }
  
    return reservations.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
  
      let comparisonResult;
  
      if (typeof valueA === "string" && typeof valueB === "string") {
        comparisonResult = valueA.localeCompare(valueB);
      } else if (typeof valueA === "number" && typeof valueB === "number") {
        comparisonResult = valueA - valueB;
      } else {
        comparisonResult = String(valueA).localeCompare(String(valueB));
      }
  
      return currentOrder === "asc" ? comparisonResult : -comparisonResult;
    });
  };


  // Fetch chalet list and then apply filters
  $.post("php/api.php", { action: "fetch" }, (data) => {
    reservations = data.rsv;
    renderTable(reservations);
  }, "json");

const applyFilter = (sortBy) => {
  const searchTerm = $("#filter-input").val().trim();
  const chaletName = $("#chalet-filter").val().trim();
  const status = $("#status-filter").val().trim();

  const filteredReservations = filterReservations(searchTerm, chaletName, status);
  const sortedReservations = sortReservations(filteredReservations, sortBy);
  renderTable(sortedReservations);
};
  
  $("#filter-input").on("input", () => {
    applyFilter();
  });
  
  $("#chalet-filter").on("change", () => {
    applyFilter();
  });
  
  $("#status-filter").on("change", () => {
    applyFilter();
  });
  
  $("th").on("click", function () {
    const sortBy = $(this).data("sort");
    applyFilter(sortBy);
  });
};
