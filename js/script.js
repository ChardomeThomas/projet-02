// THOMAS : toute la journée du vendredi pour le calendrier
//samedi: début modal calendrier en boostrap

//permet de perdre le focus sur le modal bootstrap afin de pouvoir remplir les input du calendrier
$.fn.modal.Constructor.prototype._enforceFocus = function() {};

var chaletId;
let isAdmin = true;
let testCouleur;
// var today = new Date().toISOString().slice(0,10);
document.addEventListener('DOMContentLoaded', function() {
  

  var buttons = document.querySelectorAll('.cal');
  // Parcourez chaque bouton et ajoutez un gestionnaire d'événements click
  buttons.forEach(function(button) {
    button.addEventListener('click', function(event) {
      // Récupérez l'attribut "data-id-calendar"
      chaletId = button.getAttribute('data-id-calendar');
      
      // Utilisez l'ID pour ajouter des informations ou effectuer d'autres opérations
      console.log('Calendar ID:', chaletId);
      // ... Autres actions à effectuer avec l'ID
      // Pour empêcher le comportement par défaut du bouton (comme la soumission de formulaire)
      event.preventDefault();
      
    });
  });

  var calendarEl = document.getElementById('calendar');
  
  var calendar = new FullCalendar.Calendar(calendarEl, {
    


    
    initialView: 'dayGridMonth',
    height: 500,
    events: './php/fetchEvents.php',
    selectable: true,
    eventDidMount: function(info) {
      var event = info.event;
      var chaletId = event.extendedProps.chalet_Id;
    
      // Définir la couleur en fonction de chaletId
      var color ; // Couleur par défaut
      if (chaletId === '1') {
        color = 'green';
      } else if (chaletId === '2') {
        color = 'blue';
      }else if (chaletId ==='3'){
      color = 'red' // Ajoutez d'autres conditions pour chaque chalet_Id
    }
      event.setProp('backgroundColor', color);
    },
    selectAllow: function(select) {
      var eventsOnSameDay = calendar.getEvents().filter(function(event) {
        return event.start.toISOString().slice(0, 10) === select.start.toISOString().slice(0, 10);
      });
  
      if (moment().diff(select.start, 'days') > 0 || eventsOnSameDay.length >= 3) {
        Swal.fire("Impossible de sélectionner cette case. Vérifiez que la date est future et qu'il n'y a pas déjà trois événements sur cette journée.", '', 'error');
        return false;
      }
  
      return true;
    },
    
    select: async function (start, end, allDay) {
      
      const { value: formValues } = await Swal.fire({
        title: 'Remplissez vos informations',
        confirmButtonText: 'Submit',
        showCloseButton: true,
        showCancelButton: true,
        html:
          '<input id="swalEvtTitle" class="swal2-input" placeholder="Entrez un nom pour votre réservation">' +
          '<input id="Nom" class="swal2-input" placeholder="Entrez votre nom">'+
          '<input id="Prenom" class="swal2-input" placeholder="Entrez votre prenom">'+
          '<input id="Email" class="swal2-input" placeholder="Entrez votre e-mail">'+
          '<input id="Telephone" class="swal2-input" placeholder="Entrez votre telephone">'+
          '<input id="Personnes" class="swal2-input" placeholder="Combien de personnes?">'+
          '<div>'+
          '<input id="case1" type="checkbox"><span>breakfast</span>'+
          '<input id="case2" type="checkbox"><span>dinner</span>'+
          '<input id="case3" type="checkbox"><span>spa</span>'+
          '</div>',
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById('swalEvtTitle').value,
            document.getElementById('Nom').value,
            document.getElementById('Prenom').value,
            document.getElementById('Email').value,
            document.getElementById('Telephone').value,
            document.getElementById('Personnes').value,
            chaletId,
            document.getElementById("case1").checked,
            document.getElementById("case2").checked,
            document.getElementById("case3").checked,
          ]
        }
      });

      if (formValues) {
        // Add event
        fetch("./php/eventHandler.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ request_type:'addEvent', start:start.startStr, end:start.endStr, event_data: formValues}),
        })
        .then(response => response.json())
        .then(data => {
          if (data.status == 1) {
            Swal.fire('Event added successfully!', '', 'success');
          } else {
            Swal.fire(data.error, '', 'error');
          }

          // Refetch events from all sources and rerender
          calendar.refetchEvents();
        })
        .catch(console.error);
      }
    },

    eventClick: function(info) {
      var eventsOnSameDay = calendar.getEvents().filter(function(event) {
        return event.start.toISOString().slice(0, 10) === info.event.start.toISOString().slice(0, 10);
      });
    
      if (eventsOnSameDay.length >= 3) {
        // Afficher un message d'erreur lorsque trois événements sont présents sur la même journée
        Swal.fire('Impossible de sélectionner cette case. Trois événements sont déjà présents sur cette journée.', '', 'error');
        return false; // Annuler l'action par défaut
      }
    
      // Le code restant pour afficher les détails de l'événement lorsque moins de trois événements sont présents
      info.jsEvent.preventDefault();
      // ...
    
      if(info.event.extendedProps.breakfast==1){
        var breakf = true;
      }else{
        breakf = false;
      }
      if(info.event.extendedProps.dinner==1){
        var din = true;
      }else{
        din = false;
      }
      if(info.event.extendedProps.spa==1){
        var spa = true;
      }else{
        spa = false;
      }
      // change the border color
      info.el.style.borderColor = 'red';
      if (isAdmin) { //mettre en comm si on veut que les utilisateurs puissent cliquer pour voir les réservations
      Swal.fire({
        title: info.event.title,
        icon: 'info',
        html:`<p>${info.event.extendedProps.nom}</p><p>${info.event.extendedProps.prenom}</p><p>${info.event.extendedProps.email}</p><p>${info.event.extendedProps.telephone}</p><p>${info.event.extendedProps.personnes}</p><input disabled type="checkbox" ${breakf ? 'checked' : ''}><span>breakfast</span> <input disabled type="checkbox" ${din ? 'checked' : ''} ><span>dinner</span><input disabled type="checkbox" ${spa ? 'checked' : ''} ><span>spa</span><p>status: ${info.event.extendedProps.status_id} (1:waiting, 2:canceled, 3:confirmed, 4:payed)</p>`,
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: isAdmin,
        showDenyButton: isAdmin,
        cancelButtonText: 'Close',
        confirmButtonText: 'Edit',
        denyButtonText: 'Delete',
      }).then((result) => {
        // if (isAdmin) { enlever le comm si on veut que les utilisateurs puissent cliquer pour voir les réservations
        if (result.isDenied) {
          // Delete event
          fetch("./php/eventHandler.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ request_type:'deleteEvent', event_id: info.event.id}),
          })
          .then(response => response.json())
          .then(data => {
            if (data.status == 1) {
              Swal.fire('Event deleted successfully!', '', 'success');
            } else {
              Swal.fire(data.error, '', 'error');
            }

            // Refetch events from all sources and rerender
            calendar.refetchEvents();
          })
          .catch(console.error);
        } else if (result.isConfirmed) {
          // Edit and update event
          Swal.fire({
            title: 'Edit Event',
            html:
              '<input id="swalEvtTitle_edit" class="swal2-input" placeholder="Entrez un nom pour votre réservation" value="'+info.event.title+'">' +
              '<input id="swalNom_edit" class="swal2-input" placeholder="Nom" value="'+info.event.extendedProps.nom+'">'+
              '<input id="swalPrenom_edit" class="swal2-input" placeholder="Prenom" value="'+info.event.extendedProps.prenom+'">'+
              '<input id="swalEmail_edit" class="swal2-input" placeholder="Email" value="'+info.event.extendedProps.email+'">'+
              '<input id="swalTelephone_edit" class="swal2-input" placeholder="Telephone" value="'+info.event.extendedProps.telephone+'">'+
              '<input id="swalPersonnes_edit" class="swal2-input" placeholder="Combien serez-vous?" value="'+info.event.extendedProps.personnes+'">'+
              '<input id="swalStart" type="date" id="start" name="trip-start value="'+info.event.start+'>'+
              '<input id="swalEnd" type="date" id="start" name="trip-start value="'+info.event.end+'>'+
              // '<input id="swalStatus" class="swal2-input" placeholder="choisissez le status" value="'+info.event.extendedProps.status_id+'">',
              '<select name="status" id="swalStatus"><option value="1">waiting</option><option value="2">canceled</option><option value="3">confirmed</option><option value="4">payed</option></select>',
            focusConfirm: false,
            confirmButtonText: 'Submit',
            preConfirm: () => {
              return [
                document.getElementById('swalEvtTitle_edit').value,
                document.getElementById('swalNom_edit').value,
                document.getElementById('swalPrenom_edit').value,
                document.getElementById('swalEmail_edit').value,
                document.getElementById('swalTelephone_edit').value,
                document.getElementById('swalPersonnes_edit').value,
                document.getElementById('swalStart').value,
                document.getElementById('swalEnd').value,
                document.getElementById('swalStatus').value,

              ]
            }
          }).then((result) => {
            if (result.value) {
              // Edit event
              fetch("./php/eventHandler.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ request_type:'editEvent', start:info.event.startStr, end:info.event.endStr, event_id: info.event.id, event_data: result.value})
              })
              .then(response => response.json())
              .then(data => {
                if (data.status == 1) {
                  Swal.fire('Event updated successfully!', '', 'success');
                } else {
                  Swal.fire(data.error, '', 'error');
                }

                // Refetch events from all sources and rerender
                calendar.refetchEvents();
              })
              .catch(console.error);
            }
          });
        } else {
          Swal.close();
        }
      // } enlever le com si on veut que les utilisateurs puissent cliquer sur les réservations
      });
    } //à mettre en com si on veut que les utilisateurs puissent cliquer sur les réservation
    }
    
  });


  calendar.render();

  
  $('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('Choisissez votre réservation ' + recipient)
    modal.find('.modal-body input').val(recipient)
  
  })});
