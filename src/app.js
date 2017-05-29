/*
 * This project is part of the Full Stack Nano Degree Course from Udacity.
 * As part of the project, is required to load a map and show some locations on it,
 * implement features like list locations, include markers in the map and open info windows
 * with some representative information about the place.
 *
 * For this specific project, the implementation is: Show a list of cities in Europe and
 * for each city, list the best 5 restaurants according to a previous search on Yelp (best rated).
 * Then, with some hardcoded data, display the cities chosen and the best 5 restaurants, display in
 * the map their location and some information about how many people were there before and how many
 * people evaluated that restaurant (for populatiry).
 *
 * @author: Filipe Costa (s.costa.filipe@gmail.com)
 */
import $ from 'jquery';
import _ from 'lodash';
import ko from 'knockout';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import '../styles/main.css';

import 'font-awesome/css/font-awesome.min.css';

// Definitions for some of the variables used in the code below.
var map, geocoder, viewModel, infoWindow, largeInfoWindow;
// For the markers in the map, currently showing
var pinPoints = [];
// For caching information about the restaurant, just to avoid doing request every time
var pinPointsInfo = [];

const FOURSQUARE_CLIENT_ID = 'IOPRJUMVZOTR1VL5XGLTELYHIUFDWJP4R0VCWSXAP2GD4SPS';
const FOURSQUARE_CLIENT_SECRET = 'XXG3ZOCJCDNJTBDLKJ4W1ASCRNCQP35ADV1KODV3UMH5J4LM';
const FOURSQUARE_DATE_VERSION = '20170520';


// Models initialization ( hardcoded data )
const CITIES_LOCATIONS_DATA = [
    {
        id: 0,
        name: 'Rome',
        restaurants: [
            {
                id: 0,
                name: 'La Prosciutteria',
                address: 'Centro Storico Via della Panetteria 34A, 00187 Rome, Italy',
                toggled: false,
                showing: false,
                location: {
                    lat: 41.9019098,
                    lng: 12.4845208
                }
            },
            {
                id: 1,
                name: 'Pane & Vino',
                address: 'Via Ostilia, 10, 00184 Rome, Italy',
                toggled: false,
                showing: false,
                location: {
                    lat: 41.8891366,
                    lng: 12.4953596
                }
            },
            {
                id: 2,
                name: 'Eggs',
                address: 'Trastevere Vicolo del Cedro 26, 00153 Rome, Italy',
                toggled: false,
                showing: false,
                location: {
                    lat: 41.890106,
                    lng: 12.4682487
                }
            },
            {
                id: 3,
                name: 'Pizza Zizza',
                address: 'Borgo Via delle Fornaci 11, 00165 Rome, Italy',
                toggled: false,
                showing: false,
                location: {
                    lat: 41.8997644,
                    lng: 12.4566226
                }
            },
            {
                id: 4,
                name: 'Osteria del Cavaliere',
                address: 'Appio San Giovanni, Via Alba 32, 00182 Rome, Italy',
                toggled: false,
                showing: false,
                location: {
                    lat: 41.8801814,
                    lng: 12.5172714
                }
            }
        ]
    },
    {
        id: 1,
        name: 'Berlin',
        restaurants: [
            {
                id: 5,
                name: 'Lorenz Adlon Esszimmer',
                address: 'Mitte Unter den Linden 77, 10117 Berlin, Germany',
                toggled: false,
                showing: false,
                location: {
                    lat: 52.5160672,
                    lng: 13.3776993
                }
            },
            {
                id: 6,
                name: 'Weingalerie und Café NÖ!',
                address: 'Mitte Glinkastr. 23, 10117 Berlin, Germany',
                toggled: false,
                showing: false,
                location: {
                    lat: 52.5133095,
                    lng: 13.3840176
                }
            },
            {
                id: 7,
                name: 'PeterPaul',
                address: 'Mitte Torstr. 99, 10119 Berlin, Germany',
                toggled: false,
                showing: false,
                location: {
                    lat: 52.5299506,
                    lng: 13.4020436
                }
            },
            {
                id: 8,
                name: 'Imbiss 204',
                address: 'Prenzlauer Berg Prenzlauer Allee 204, 10405 Berlin, Germany',
                toggled: false,
                showing: false,
                location: {
                    lat: 52.537798,
                    lng: 13.4208244
                }
            },
            {
                id: 9,
                name: 'Marral',
                address: 'Mitte Torstr. 222, Via Alba 32, 10115 Berlin, Germany',
                toggled: false,
                showing: false,
                location: {
                    lat: 52.5272532,
                    lng: 13.3865213
                }
            }
        ]
    },
    {
        id: 2,
        name: 'Paris',
        restaurants: [
            {
                id: 10,
                name: 'Le Potager du Père Thierry',
                address: 'Montmartre, 18ème 16 rue des Trois Frères, 75018 Paris, France',
                toggled: false,
                showing: false,
                location: {
                    lat: 48.8845531,
                    lng: 2.3390321
                }
            },
            {
                id: 11,
                name: 'Comptoir de la Gastronomie',
                address: '1er, Châtelet/Les Halles 34 rue Montmartre, 75001 Paris, France',
                toggled: false,
                showing: false,
                location: {
                    lat: 48.8645135,
                    lng: 2.3432283
                }
            },
            {
                id: 12,
                name: 'Pizzeria Popolare',
                address: 'Bourse, 2ème 111 rue Réaumur, 75002 Paris, France',
                toggled: false,
                showing: false,
                location: {
                    lat: 48.8681305,
                    lng: 2.3411043
                }
            },
            {
                id: 13,
                name: 'Le Bistrot des Augustins',
                address: 'Saint-Michel/Odéon, 6ème 39 quai Grands Augustins, 75006 Paris, France',
                toggled: false,
                showing: false,
                location: {
                    lat: 48.8547436,
                    lng: 2.3399316
                }
            },
            {
                id: 14,
                name: 'La Cordonnerie',
                address: 'Palais Royal/Musée du Louvre, 1er 20 rue Saint Roch, 75001 Paris, France',
                toggled: false,
                showing: false,
                location: {
                    lat: 48.8630378,
                    lng: 2.3328432
                }
            }
        ]
    },
    {
        id: 3,
        name: 'London',
        restaurants: [
            {
                id: 15,
                name: 'Ffiona’s Restaurant',
                address: 'Kensington, 51 Kensington Church Street, London W8 4BA, United Kingdom',
                toggled: false,
                showing: false,
                location: {
                    lat: 51.5040831,
                    lng: -0.194964
                }
            },
            {
                id: 16,
                name: 'Regency Café',
                address: 'Westminster, 17-19 Regency Street, London SW1P 4BY, United Kingdom',
                toggled: false,
                showing: false,
                location: {
                    lat: 51.4939972,
                    lng: -0.1344122
                }
            },
            {
                id: 17,
                name: 'Bella Cosa',
                address: 'Isle of Dogs, Mudchute/Cubitt Town, 213 Marsh Wall, London E14 9FJ, United Kingdom',
                toggled: false,
                showing: false,
                location: {
                    lat: 51.500694,
                    lng: -0.0143294
                }
            },
            {
                id: 18,
                name: 'Dishoom',
                address: 'Soho, 22 Kingly Street, London W1B 5QP, United Kingdom',
                toggled: false,
                showing: false,
                location: {
                    lat: 51.512996,
                    lng: -0.1419235
                }
            },
            {
                id: 19,
                name: 'Bageriet',
                address: 'Covent Garden, 24 Rose Street, London WC2E 9EA, United Kingdom',
                toggled: false,
                showing: false,
                location: {
                    lat: 51.5119269,
                    lng: -0.1283708
                }
            }
        ]
    },
    {
        id: 4,
        name: 'Dublin',
        restaurants: [
            {
                id: 20,
                name: 'Green Bench Café',
                address: 'Harcourt, 18, Montague Street, Dublin 2, Republic of Ireland',
                toggled: false,
                showing: false,
                location: {
                    lat: 53.3364482,
                    lng: -6.2662675
                }
            },
            {
                id: 21,
                name: 'Brother Hubbard',
                address: 'North Inner City, 153 Capel Street, Dublin 1, Republic of Ireland',
                toggled: false,
                showing: false,
                location: {
                    lat: 53.3471171,
                    lng: -6.2705609
                }
            },
            {
                id: 22,
                name: 'Queen of Tarts',
                address: 'South Inner City, Dame Street, Dublin 2, Republic of Ireland',
                toggled: false,
                showing: false,
                location: {
                    lat: 53.3443726,
                    lng: -6.2711026
                }
            },
            {
                id: 23,
                name: 'The Bank on College Green',
                address: 'South Inner City, 20-22 College Green, Dublin 2, Republic of Ireland',
                toggled: false,
                showing: false,
                location: {
                    lat: 53.3441223,
                    lng: -6.2636954
                }
            },
            {
                id: 24,
                name: 'The Boxty House',
                address: 'Temple Bar, 20-21 Temple Bar, 00182 Rome, Dublin 2',
                toggled: false,
                showing: false,
                location: {
                    lat: 53.3457222,
                    lng: -6.2644047
                }
            }
        ]
    }
];

// Defines a City according to the model above.
var City = function( data ) {
    var self = this;
    self.id = data.id;
    self.name = ko.observable( data.name );
    self.restaurants = ko.observableArray(
        _.chain( data.restaurants )
        .map( restaurant => new RestaurantInfo( restaurant ) )
        .value()
    );
};

// Defines a RestaurantInfo according to the model above.
var RestaurantInfo = function( data ) {
    var self = this;

    self.id = data.id;
    self.name = data.name;
    self.address = data.address;
    self.toggled = ko.observable( data.toggled );
    self.showing = ko.observable( data.showing );
    self.location = data.location;
};

// The ViewModel using KnockoutJS
var CityViewModel = function( data, map ) {
    var self = this;

    // List of cities according to the model
    self.cities = ko.observableArray(
        _.chain( data )
        .map( city => new City( city ) )
        .value()
    );

    // The current city selected in the side bar
    self.currentCity = ko.observable( self.cities()[ 0 ] );

    // The current restaurants, according to the city selected
    self.currentRestaurants = ko.observableArray(
        _.chain( self.currentCity().restaurants() )
        .map( restaurant => {
            restaurant.toggled( false );
            restaurant.showing( true );
            return restaurant
        } )
        .value()
    );

    self.filterQuery = ko.observable("");

    // Filter the restaurant's list and pinpoints in the map
    self.filterRestaurants = function() {
        self.currentRestaurants(
            // chain -> value to chain operations for the same data
            _.chain( self.currentCity().restaurants() )
            .map( restaurant => {
                // Check if the restaurant name matches the filter, and set them to visible and toggled
                if ( restaurant.name.toLowerCase().indexOf( self.filterQuery().toLowerCase() ) > -1 ) {
                    restaurant.toggled( true );
                    restaurant.showing( true );
                } else {
                    restaurant.toggled( false );
                    restaurant.showing( false );
                }
                return restaurant;
            } )
            .filter( restaurant => restaurant.name.toLowerCase().indexOf( self.filterQuery().toLowerCase() ) > -1 )
            .value()
        );
        filterPinPoints();
        centralizeViewMap();
    }

    // For each city displayed in the view to be selected when clicked
    self.selectCity = function(city) {
        self.currentCity( city );
        self.currentRestaurants(
            _.chain( city.restaurants() )
            .map( restaurant => {
                restaurant.toggled( false );
                restaurant.showing( true );
                return restaurant;
            } )
            .value()
        );
        self.filterQuery("");
        showPinPoints();
    }

    // Set each restaurant to toggled if it's currently not toggled (selected)
    self.toggleRestaurant = function( restaurant ) {
        var toggled = false;
        if ( restaurant.toggled() ) {
            restaurant.toggled( false );
        } else {
            restaurant.toggled( true );
            toggled = true;
        }

        if ( toggled ) {
            animateToggledPinPoint( restaurant.id );
        } else {
            infoWindow.close();
        }
    }
};

window.initMap = initMap;
window.onMapError = onMapError;

function onMapError() {
    $( '#map' ).addClass( 'hidden' );
    $( '#error' ).removeClass( 'hidden' );
}

// Javascript functions
function initMap() {
    map = new google.maps.Map(document.getElementById('map'),
        {
            center: {lat: 40.74135, lng: -73.99802},
            zoom: 14
        }
    );

    infoWindow = new google.maps.InfoWindow;

    main();
}

function main() {
    ko.applyBindings( new CityViewModel( CITIES_LOCATIONS_DATA, map ) );
    // Get all the binds in KnockoutJS structure to reuse them in JS
    viewModel = ko.dataFor(document.body);
    showPinPoints();
}

$( () => {
    $( '.collapsed' ).click( function() {
        var $container = $( this );
        toggleSideBarSelection( $container );
    } );

} );

// Show the pinpoints in the map according to the current restaurants in the ViewModel
function showPinPoints() {
    clearPinPoints();
    _.each( viewModel.currentRestaurants(), restaurant => {
        // Mount the current pinpoint
        var pinPoint = new google.maps.Marker( {
            position: restaurant.location,
            title: restaurant.name,
            animation: google.maps.Animation.DROP,
            id: restaurant.id
        } );

        pinPoints.push(pinPoint);
        // Adds a listener to include the infowindow for the pinpoint, when clicked
        pinPoint.addListener( 'click', function() {
            populateInfoWindowWithLoader( this, infoWindow );
            // Set the visibility of the map to center to this pinpoint
            map.panTo( pinPoint.getPosition() );
            // Animate the selected pinpoint
            toggleBounce( this );
            getInfoForPinPoint( restaurant, pinPoint )
        } );

    } );
    centralizeViewMap();
}

function filterPinPoints() {
    _.chain( pinPoints )
    .each( pinPoint => pinPoint.setVisible( false ) )
    .filter( pinPoint => _.includes(_.map(viewModel.currentRestaurants(), restaurant => restaurant.id),  pinPoint.id) )
    .each( pinPoint => pinPoint.setVisible( true ) )
    .value()

    infoWindow.close();
}

// Reset the filter to empty
function resetFilter() {
    $( '#filter' ).val( '' );
}

// Set the pinpoint map to null and clear the list of pinpoints
function clearPinPoints() {
    _.each(pinPoints, (pinPoint) => {
        pinPoint.setMap(null);
    });
    pinPoints = [];
}

// Calls the action to animate the pinpoint when the restaurant is selected in the View
function animateToggledPinPoint( id ) {
    _.chain( pinPoints )
    .filter( ( pinPoint ) => pinPoint.id === id)
    .each( ( pinPoint ) => {
        new google.maps.event.trigger( pinPoint, 'click' );
    } )
    .value();
}

// Set the pinpoint visibility (hidden or showing)
function setPinPointVisibility( id, visible ) {
    _.chain( pinPoints )
    .filter( ( pinPoint ) => pinPoint.id === id)
    .each( ( pinPoint ) => {
        pinPoint.setMap( visible ? map : null )
    } )
    .value();
}

// Set the current infowindow to display a loading circle, while the request to Foursquare is done
function populateInfoWindowWithLoader( pinPoint, infoWindow ) {
    if ( infoWindow.marker != pinPoint ) {
        infoWindow.marker = pinPoint;
        // Includes a nice loader for each infowindow used in the project
        infoWindow.setContent("<div class='loader'></div");
        infoWindow.open(map, pinPoint);

        infoWindow.addListener( 'closeclick', function() {
            infoWindow.close();
        });
    } else {
        infoWindow.open( map, pinPoint )
    }
}

// Populate the infowindow with information retrieved from Foursquare
function populateInfoWindow( pinPoint, infoWindow, info ) {
    var infoWindowContent = "<div class='row text-center'>";

    if ( !info ) {
        // The info is undefined if the request to Foursquare erroed.
        infoWindowContent += "<div class='col-md-12 alert-danger'>Error while retrieving information from<span class='foursquare-logo'> Foursquare </span>API. Try again later.</div>";
    }
    else if ( info && !info.general ) {
        // The info is empty if no results were found using Foursquare API
        infoWindowContent += "<div class='col-md-12'>No information found about this place.</div>";
    } else {
        // Information was retrieved, let's exhibit it
        infoWindowContent += "<div class='col-md-12 restaurant-name'>" + info.general.name + "</div>";
        infoWindowContent += "<div class='col-md-12'><span class='" + info.general.checkinsCountClass + "'>" + info.general.checkinsCount + "</span> checked-in ever here.</div>";
        infoWindowContent += "<div class='col-md-12'><span class='" + info.general.tipCountClass + "'>" + info.general.tipCount + "</span> users wrote tips about this place.</div>";
        infoWindowContent += "<div class='col-md-12'><span class='" + info.general.usersCountClass + "'>" + info.general.usersCount + "</span> Foursquare registered users ever checked-in here.</div>";
        infoWindowContent += "</div>";
    }
    infoWindowContent += "</div>";

    // Just to inform on each infowindow opened that Foursquare was used as the other third-part library
    if ( info ) {
        infoWindowContent += "<br><div class='row text-center'><div class='col-md-12 alert-info'>Information retrieved using<span class='foursquare-logo'> Foursquare </span>API.</div></div>";
    }
    infoWindow.setContent(infoWindowContent);
}

// Centralize the current view according to the pinpoints in the map
function centralizeViewMap() {
    const visiblePinPoints = _.filter( pinPoints, ( pinPoint ) => pinPoint.visible );
    if ( !pinPoints.length || !visiblePinPoints.length ) {
        return;
    }
    var bounds = new google.maps.LatLngBounds();
    _.each( pinPoints, pinPoint => {
        if ( pinPoint.visible ) {
            pinPoint.setMap( map );
            bounds.extend( pinPoint.position )
        }
    } );
    map.fitBounds( bounds );
}

// Togggle (set selected or not) the elements in the side bar
function toggleSideBarSelection( el ) {
    if ( el.hasClass( 'collapsed' ) ) {
        el.addClass( 'active ' );
    } else {
        el.removeClass( 'active' );
    }
}

// Bounce animation for the pinpoint when selected
function toggleBounce( pinPoint ) {
    pinPoint.setAnimation( google.maps.Animation.BOUNCE );
    _.delay( function removeAnimation() {
        pinPoint.setAnimation( null );
    }, 700 );
}

// Get information asyncronously from Foursquare about the pinpoint selected
function getInfoForPinPoint( restaurant, pinPoint ) {
    if ( pinPointsInfo[ restaurant.id ] && !pinPointsInfo[ restaurant.id ].general ) {
        // Get the information from the local cache variable, if exists
        populateInfoWindow( pinPoint, infoWindow, pinPointsInfo[restaurant.id] );
        return;
    }
    // Just do a regular async call to the API endpoint and show it after ends
    $.ajax( {
        url: 'https://api.foursquare.com/v2/venues/search',
        data: {
            'll': restaurant.location.lat + ',' + restaurant.location.lng,
            'intent': 'match',
            'query': restaurant.name,
            'client_id': FOURSQUARE_CLIENT_ID,
            'client_secret': FOURSQUARE_CLIENT_SECRET,
            'v': FOURSQUARE_DATE_VERSION
        },
        type: 'GET',
        success: ( data, status ) => {
            if ( status === 'success' ) {
                const venue = data.response.venues && data.response.venues[0];
                var venueInfo = {};
                if ( venue ) {
                    venueInfo = {
                        general: {
                            name: venue.name,
                            checkinsCount: venue.stats.checkinsCount,
                            checkinsCountClass: venue.stats.checkinsCount > 500 ? 'checkins-count-huge' : venue.stats.checkinsCount > 200 ? 'checkins-count-medium' : 'checkins-count-small',
                            tipCount: venue.stats.tipCount,
                            tipCountClass: venue.stats.tipCount > 100 ? 'tip-count-huge' : venue.stats.tipCount > 50 ? 'tip-count-medium' : 'tip-count-small',
                            usersCount: venue.stats.usersCount,
                            usersCountClass: venue.stats.usersCount > 200 ? 'users-count-huge' : venue.stats.usersCount > 100 ? 'users-count-medium' : 'users-count-small'
                        },
                        site: venue.url
                    };
                    pinPointsInfo[restaurant.id] = venueInfo;
                    populateInfoWindow( pinPoint, infoWindow, venueInfo );
                } else {
                    pinPointsInfo[restaurant.id] = venueInfo;
                    populateInfoWindow( pinPoint, infoWindow, venueInfo );
                }
            }
        },
        error: function() {
            populateInfoWindow( pinPoint, infoWindow, null );
        }
    } );
}