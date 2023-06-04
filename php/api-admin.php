// THOMAS : toute la journée du vendredi pour le calendrier
// samedi: début modal calendrier en boostrap

// Permet de perdre le focus sur le modal bootstrap afin de pouvoir remplir les input du calendrier
$.fn.modal.Constructor.prototype._enforceFocus = function() {};

var chaletId;
let isAdmin = false;
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
    eventColor: 'red',
    selectable: true,
    selectAllow: function(select) {
      return moment().diff(select.start, 'days') <= 0
    },
    select: async function (start, end, allDay) {
      // Vérifiez si l'utilisateur est un administrateur
      if (isAdmin) {
        // Si l'utilisateur est un administrateur, affichez la boîte de dialogue Swal avec le bouton
        const { value: formValues } = await Swal.fire({
          title: 'Add Event',
          confirmButtonText: 'Submit',
          showCloseButton: true,
          showCancelButton: true,
          timezone: 'Europe/Paris',
          html:
            '<input id="swalEvtTitle" class="swal2-input" placeholder="Enter title">' +
            '<input id="Nom" class="swal2-input" placeholder="Entrez votre nom">'+
            '<input id="Prenom" class="swal2-input" placeholder="Entrez votre prenom">'+
            '<input id="Email" class="swal2-input" placeholder="Entrez votre e-mail">'+
            '<input id="Telephone" class="swal2-input" placeholder="Entrez votre telephone">'+
            '<input id="Personnes" class="swal2-input" placeholder="Entrez le nombre de personnes">'+
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
      } else {
        // Si l'utilisateur n'est pas un administrateur, affichez la boîte de dialogue Swal sans le bouton
        Swal.fire({
          title: 'Add Event',
          showCloseButton: true,
          showCancelButton: false,
          html:
            '<p>You are not authorized to add events.</p>',
        });
      }
    },

    eventClick: function(info) {
      info.jsEvent.preventDefault();
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
      
      Swal.fire({
        title: info.event.title,
        icon: 'info',
        html:`<p>${info.event.extendedProps.nom}</p><p>${info.event.extendedProps.prenom}</p><p>${info.event.extendedProps.email}</p><p>${info.event.extendedProps.telephone}</p><p>${info.event.extendedProps.personnes}</p><input disabled type="checkbox" ${breakf ? 'checked' : ''}><span>breakfast</span> <input disabled type="checkbox" ${din ? 'checked' : ''} ><span>dinner</span><input disabled type="checkbox" ${spa ? 'checked' : ''} ><span>spa</span>`,
        showCloseButton: true,
        showCancelButton: true,
        showDenyButton: true,
        cancelButtonText: 'Close',
        confirmButtonText: 'Edit',
        denyButtonText: 'Delete',
      }).then((result) => {
        // Vérifiez si l'utilisateur est un administrateur
        if (isAdmin) {
          // Si l'utilisateur est un administrateur, traitez la modification/suppression de l'événement
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
                '<input id="swalEvtTitle_edit" class="swal2-input" placeholder="Enter title" value="'+info.event.title+'">' +
                '<input id="Nom_edit" class="swal2-input" placeholder="Entrez votre nom" value="'+info.event.extendedProps.nom+'">'+
                '<input id="Prenom_edit" class="swal2-input" placeholder="Entrez votre prenom" value="'+info.event.extendedProps.prenom+'">'+
                '<input id="Email_edit" class="swal2-input" placeholder="Entrez votre e-mail" value="'+info.event.extendedProps.email+'">'+
                '<input id="Telephone_edit" class="swal2-input" placeholder="Entrez votre telephone" value="'+info.event.extendedProps.telephone+'">'+
                '<input id="Personnes_edit" class="swal2-input" placeholder="Entrez le nombre de personnes" value="'+info.event.extendedProps.personnes+'">'+
                '<div>'+
                '<input id="case1_edit" type="checkbox" '+ (info.event.extendedProps.breakfast == 1 ? 'checked' : '') +'><span>breakfast</span>'+
                '<input id="case2_edit" type="checkbox" '+ (info.event.extendedProps.dinner == 1 ? 'checked' : '') +'><span>dinner</span>'+
                '<input id="case3_edit" type="checkbox" '+ (info.event.extendedProps.spa == 1 ? 'checked' : '') +'><span>spa</span>'+
                '</div>',
              confirmButtonText: 'Submit',
              showCloseButton: true,
              showCancelButton: true,
              focusConfirm: false,
              preConfirm: () => {
                return [
                  document.getElementById('swalEvtTitle_edit').value,
                  document.getElementById('Nom_edit').value,
                  document.getElementById('Prenom_edit').value,
                  document.getElementById('Email_edit').value,
                  document.getElementById('Telephone_edit').value,
                  document.getElementById('Personnes_edit').value,
                  info.event.id,
                  document.getElementById("case1_edit").checked,
                  document.getElementById("case2_edit").checked,
                  document.getElementById("case3_edit").checked,
                ]
              }
            }).then((result) => {
              if (result.value) {
                // Update event
                fetch("./php/eventHandler.php", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ request_type:'updateEvent', event_id: result.value[6], event_data: result.value }),
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
          }
        }
      });
    }
  });

  calendar.render();
});
