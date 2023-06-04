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
      showCancelButton: isAdmin,
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
            showCancelButton: isAdmin,
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
  