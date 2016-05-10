$( () => {
  console.log('index.js loaded!');

  $( '.form-search' ).submit((e) => {
    e.preventDefault();
    let $term = $( '#term' ).val();
    let $category = $( '#category' ).val();
    let $neighborhood = $( '#neighborhood' ).val();
    let $city = $( '#city' ).text().trim();

    // start off with minimal search terms object,
    // later add to it depending on what's fille out in the search
    let searchTerms = {
      term: $term
    }

    // location
    if ($neighborhood) {
      searchTerms.location = `${$neighborhood}, ${$city}`;
    } else {
      searchTerms.location = $city;
    }

    // category
    if ($category) {
      searchTerms.category = `restaurants, ${$category}`;
    }

    // get the search results
    $.get( '/restaurants/searchresults', searchTerms )
      .done( (data) => {
        console.log(data.businesses);
      });
  })


});
