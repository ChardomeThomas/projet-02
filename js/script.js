document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 650,
    events: './php/fetchEvents.php',
    
    selectable: true,
    select: async function (start, end, allDay) {
      const { value: formValues } = await Swal.fire({
        title: 'Add Event',
        confirmButtonText: 'Submit',
        showCloseButton: true,
		    showCancelButton: true,
        html:
          '<input id="swalEvtTitle" class="swal2-input" placeholder="Enter title">' +
          // '<textarea id="swalEvtDesc" class="swal2-input" placeholder="Enter description"></textarea>' +
          // '<input id="swalEvtURL" class="swal2-input" placeholder="Enter URL">'+
          '<input id="Nom" class="swal2-input" placeholder="Entrez votre nom">'+
          '<input id="Prenom" class="swal2-input" placeholder="Entrez votre prenom">'+
          '<input id="Email" class="swal2-input" placeholder="Entrez votre e-mail">'+
          '<input id="Telephone" class="swal2-input" placeholder="Entrez votre telephone">'+
          '<input id="Personnes" class="swal2-input" placeholder="Entrez le nombre de personnes">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById('swalEvtTitle').value,
            // document.getElementById('swalEvtDesc').value,
            // document.getElementById('swalEvtURL').value,
            document.getElementById('Nom').value,
            document.getElementById('Prenom').value,
            document.getElementById('Email').value,
            document.getElementById('Telephone').value,
            document.getElementById('Personnes').value
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
      info.jsEvent.preventDefault();
      
      // change the border color
      info.el.style.borderColor = 'red';
      
      Swal.fire({
        title: info.event.title,
        icon: 'info',
        html:'<p>'+info.event.extendedProps.nom+'</p>'+'<p>'+info.event.extendedProps.prenom+'</p>'+'<p>'+info.event.extendedProps.email+'</p>'+'<p>'+info.event.extendedProps.telephone+'</p>'+'<p>'+info.event.extendedProps.personnes+'</p>',
        showCloseButton: true,
        showCancelButton: true,
        showDenyButton: true,
        cancelButtonText: 'Close',
        confirmButtonText: 'Delete',
        denyButtonText: 'Edit',
      }).then((result) => {
        if (result.isConfirmed) {
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
        } else if (result.isDenied) {
          // Edit and update event
          Swal.fire({
            title: 'Edit Event',
            html:
              '<input id="swalEvtTitle_edit" class="swal2-input" placeholder="Enter title" value="'+info.event.title+'">' +
              // '<textarea id="swalEvtDesc_edit" class="swal2-input" placeholder="Enter description">'+info.event.extendedProps.description+'</textarea>' +
              // '<input id="swalEvtURL_edit" class="swal2-input" placeholder="Enter URL" value="'+info.event.url+'">'+
              '<input id="swalNom_edit" class="swal2-input" placeholder="Enter Nom" value="'+info.event.extendedProps.nom+'">'+
              '<input id="swalPrenom_edit" class="swal2-input" placeholder="Enter Prenom" value="'+info.event.extendedProps.prenom+'">'+
              '<input id="swalEmail_edit" class="swal2-input" placeholder="Enter votre email" value="'+info.event.extendedProps.email+'">'+
              '<input id="swalTelephone_edit" class="swal2-input" placeholder="Enter votre telephone" value="'+info.event.extendedProps.telephone+'">'+
              '<input id="swalPersonnes_edit" class="swal2-input" placeholder="Enter le nombre de personnes" value="'+info.event.extendedProps.personnes+'">',
            focusConfirm: false,
            confirmButtonText: 'Submit',
            preConfirm: () => {
            return [
              document.getElementById('swalEvtTitle_edit').value,
              // document.getElementById('swalEvtDesc_edit').value,
              // document.getElementById('swalEvtURL_edit').value,
              document.getElementById('swalNom_edit').value,
              document.getElementById('swalPrenom_edit').value,
              document.getElementById('swalEmail_edit').value,
              document.getElementById('swalTelephone_edit').value,
              document.getElementById('swalPersonnes_edit').value
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
      });
    }
  });

  calendar.render();
});