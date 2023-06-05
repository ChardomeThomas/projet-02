fetch('./php/chalets.php')
  .then(response => response.json())
  .then(data => {
    let j =1;
    for (let i = 0; i < 3; i++) {
        
        console.log(data[i]);
        var div = document.querySelector('[data-chalet-id="' + j + '"]');
        
        if (div) {
          var img = div.querySelector('img');
          var h5 = div.querySelector('h5');
          var p = div.querySelector('p');
          
          img.src = data[i].image;
          h5.textContent = data[i].name;
          p.textContent = data[i].description;
        }
        j++;
    }
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des données JSON:', error);
  });
