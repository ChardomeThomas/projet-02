document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      height:350,
      event:'./php/fetchEvents.php',
      selectable: true,
      select: async function (debut, fin, allDay){
        const {value: formValues} = await Swal.fire({
          title: "ajouter un évènement",
          confirmButtonText: 'valider',
          showCloseButton: true,
          showCancelButton: true,
          html:
            // '<input id="Titre" class="swal2-input" placeholder="Ajouter un évènement">' +
            '<input id="Nom" class="swal2-input" placeholder="Entrez votre nom">' +
            '<input id="Prenom" class="swal2-input" placeholder="Entrez votre prénom">' +
            '<input id="Mail" class="swal2-input" placeholder="Entrez votre e-mail">'+
            '<input id="Telephone" class="swal2-input" placeholder="Entrez votre téléphone">'+
            '<input id="Nb_personnes" class="swal2-input" placeholder="Pour combien de personnes réservez-vous?">',
          focusConfirm: false,
          preConfirm: () => {
            return [
              // document.getElementById('Titre').value,
              document.getElementById('Nom').value,
              document.getElementById('Prenom').value,
              document.getElementById('Mail').value,
              document.getElementById('Telephone').value,
              document.getElementById('Nb_personnes').value
            ];
          }
        });

        if (formValues){
          //ajout event
          fetch("./php/eventHandler.php", {
            method: "POST",
            header: { "Content-Type": "application/json"},
            body: JSON.stringify({request_type:'addEvent', debut:debut.startStr, fin:debut.endStr, event_data: formValues}),
          })
          .then(response => {
            console.log(response); // Affiche la réponse dans la console
            return response.json();
          })
          .then(data => {
            if (data.status == 1){
              Swal.fire('Evénement ajouté avec succès', '', 'success');
            } else{
              Swal.fire(data.error, '', 'error')
            }

            calendar.refecthEvents();
          })
          .catch(console.error);
        }

        eventClick: function test(info) {
          info.jsEvent.preventDefault();
          
          // change the border color
          info.el.style.borderColor = 'red';
          
          Swal.fire({
            title: info.event.title,
            icon: 'info',
            html:'<p>'+info.event.extendedProps.description+'</p><a href="'+info.event.url+'">Visit event page</a>',
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: 'close',
          });
        }
      },
      // dateClick: function(info) {
      //     alert('clicked ' + info.dateStr);
          
      //   },
      //   select: function(info) {
      //       alert('selected ' + info.startStr + ' to ' + info.endStr);
      //   },
    });
    

    calendar.render();
  });







//   CALENDRIER 2
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl2 = document.getElementById('calendar2');
    var calendar2 = new FullCalendar.Calendar(calendarEl2, {
      initialView: 'dayGridMonth',
      selectable: true,
      dateClick: function(info) {
        alert('clicked ' + info.dateStr);
        
      },
      select: function(info) {
        alert('selected ' + info.startStr + ' to ' + info.endStr);
      },
      height:350
    });
    calendar2.render();
  });

// CALENDRIER3
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl3 = document.getElementById('calendar3');
    var calendar3 = new FullCalendar.Calendar(calendarEl3, {
      initialView: 'dayGridMonth',
      selectable: true,
      dateClick: function(info) {
        alert('clicked ' + info.dateStr);
        
      },
      select: function(info) {
        alert('selected ' + info.startStr + ' to ' + info.endStr);
      },
      height:350
    });
    calendar3.render();
  });

