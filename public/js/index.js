$( () => {
  console.log('index.js loaded!');

  $( '.form-search' ).submit((e) => {
    e.preventDefault();
    let $term = $( '#term' ).val();
    let $category = $( '#category' ).val();
    let $neighborhood = $( '#neighborhood' ).val();
    let $city = $( '#city' ).text().trim();

    // start off with minimal search terms object,
    // later add to it depending on what's filled out in the search
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
        searchResults(data.businesses);
      });
  }) // end of form search

}); // end of document load

function searchResults(d) {
  const $results = $( '.search-results' );
  // const $divColItem = $( '<div class="col-md-5 no-padding lib-item" data-category="view"></div>' );
  // const $divPanel = $( '<div class="lib-panel"></div>' );
  // const $divRowBox = $( '<div class="row box-shadow"></div>' );
  // const $divColImg = $( '<div class="col-md-6"></div>' );
  // const $divColDesc = $( '<div class="col-md-6"></div>' );

  // for each result
  d.forEach( (el) => {
    // build the card view for each result
    let $divRow = $( '<div row row-margin-bottom></div>' );
    let $divColItem = $( '<div class="col-md-5 no-padding lib-item" data-category="view"></div>' );
    let $divPanel = $( '<div class="lib-panel"></div>' );
    let $divRowBox = $( '<div class="row box-shadow"></div>' );
    let $divColImg = $( '<div class="col-md-6"></div>' );
    let $divColDetails = $( '<div class="col-md-6"></div>' );

    $results.append($divRow);
    $divRow.append($divColItem);
    $divColItem.append($divPanel);
    $divPanel.append($divRowBox);
    $divRowBox.append($divColImg);
    $divColImg.append( `<img class="lib-img-show" src="${el.image_url}"/>` );
    $divRowBox.append($divColDetails);
    $divColDetails.append(
      `<div class="lib-row lib-header">
          ${el.name}
          <div class="lib-header-seperator"></div>
       </div>` );
    $divColDetails.append(`<div class="lib-row lib-desc"><b>Area: </b>${el.location.neighborhoods}</div>`);
    $divColDetails.append(`<div class="lib-row lib-desc">${el.location.address}, ${el.location.city}</div>`);
    $divColDetails.append(`<div class="lib-row lib-desc"><img class="rating-img" src="${el.rating_img_url}"/></div>`);
    $divColDetails.append(`<div class="lib-row lib-desc"><b>Review Count: </b>${el.review_count}</div>`);
    $divColDetails.append(`<div><a class="lib-row lib-desc" href="${el.url}">link to yelp</a></div>`);

    // build hidden form and submit to add the restaurant
    // $divColDetails.append(`<div><a class="lib-row lib-desc" href="${el.url}">link to yelp</a></div>`);
  })
}
