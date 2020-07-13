


var pokemonRepository = (function () {
  var pokemonList = [];

  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';


  function add(item) {
    pokemonList.push(item);

  }

  function getAll() {
    return pokemonList;
  }

  function showDetails(item) {
    loadDetails(item).then(function () {

      var modalBody = $('.modal-body');
      var modalTitle = $('.modal-title');

       // Clear all existing modal content
      modalBody.empty();
      modalTitle.empty();


        //adding the new modal content
       

        var modalName = $('<h1 class="modal-title2"></h1>').text(item.name);
        modalTitle.append(modalName);
     
        var modalHeight = $('<p></p>').text('Height: ' + item.height + 'm');
       

        var modalTypes = $('<p></p>').text('Type(s): ' + item.types.join(', '));
      

        var modalImage = $('<img class="modal-image">').attr("src", item.imageUrl);
      
        modalBody.append(modalHeight).append(modalTypes).append(modalImage);
        

 

        // to close the modal using the escape key (checking if the modal is open)

        window.on('keydown', (e) => {
          var modalContainer = $('#modal-container');
          if (e.key === 'Escape' && modalContainer.hasClass('is-visible')) {
            hideModal();
          }
        })

        // to close the modal by clicking outside of the modal

        modalContainer.on('click', (e) => {
          // also triggered when clicking INSIDE the modal but the modalContainer is the overlay around the modal div
          var target = e.target;
          if (target === modalContainer) {
            hideModal();
          }
        })
       

   });
  }


  function addListItem(pokemon) {
    var $pokemonUl = $('.pokemon-ul');
    var $listItem = $('<button type="button" class="list-group-item list-group-item-action"></button>');
    var $button = $('<button type ="button" class ="btn-outline-danger btn-block btn-lg" data-toggle="modal" data-target="#modal-container"></button>').text(pokemon.name)
    $listItem.append($button);
    $pokemonUl.append($listItem);
    $button.on('click', function (event) {
      showDetails(pokemon);
    });
  }

  function loadList() {
    return $.ajax(apiUrl, { dataType: "json" } ).then(function (item) {
      $.each(item.results, function (i, item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    })
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url).then(function (details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types.map(function(pokemon) { // .map turns the [object, object] into the actual names of the types...Map is a collection of elements where each element is stored as a Key, value pair.
        return pokemon.type.name;
      })
    }).catch(function (e) {
      console.error(e);
    });
  }



  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails
  };


  function hideModal() {
    var modalContainer = $('#modal-container');
    modalContainer.removeClass('is-visible'); }

})();

pokemonRepository.loadList().then(function() {
  var pokemon = pokemonRepository.getAll();

  $.each(pokemon, function(index, pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

