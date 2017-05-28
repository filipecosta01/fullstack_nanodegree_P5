import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import ko from 'knockout';

import Yelp from 'node-yelp-api-v3';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import '../styles/main.css';

import swal from 'sweetalert/dist/sweetalert.min.js';
import 'sweetalert/dist/sweetalert.css';

import 'font-awesome/css/font-awesome.min.css';

var map, geocoder, viewModel, infoWindow, largeInfoWindow;
var pinPoints, pinPointsPhotos = [];
// Valid for 185 days, more than enough for the project.

var yelp;

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

var RestaurantInfo = function( data ) {
    var self = this;

    self.id = data.id;
    self.name = data.name;
    self.address = data.address;
    self.toggled = ko.observable( data.toggled );
    self.showing = ko.observable( data.showing );
    self.location = data.location;
};

var CityViewModel = function( data, map ) {
    var self = this;

    self.cities = ko.observableArray(
        _.chain( data )
        .map( city => new City( city ) )
        .value()
    );

    self.currentCity = ko.observable( self.cities()[ 0 ] );

    self.currentRestaurants = ko.observableArray(
        _.chain( self.currentCity().restaurants() )
        .map( restaurant => {
            restaurant.toggled( true );
            restaurant.showing( true );
            return restaurant
        } )
        .value()
    );

    self.filterRestaurants = function() {
        const query = $( '#filter' ).val();
        self.currentRestaurants(
            _.chain( self.currentCity().restaurants() )
            .map( restaurant => {
                var toggled = false;
                if ( restaurant.name.toLowerCase().indexOf( query.toLowerCase() ) > -1 ) {
                    restaurant.toggled( true );
                    restaurant.showing( true );
                    toggled = true;
                } else {
                    restaurant.toggled( false );
                    restaurant.showing( false );
                }
                return restaurant;
            } )
            .filter( restaurant => restaurant.name.toLowerCase().indexOf( query.toLowerCase() ) > -1 )
            .value()
        );
        showPinPoints();
    }

    self.selectCity = function(city) {
        self.currentCity( city );
        self.currentRestaurants(
            _.chain( city.restaurants() )
            .map( restaurant => {
                restaurant.toggled( true );
                restaurant.showing( true );
                return restaurant;
            } )
            .value()
        );
        resetFilter();
        showPinPoints();
    }

    self.toggleRestaurant = function( restaurant ) {
        var toggled = false;
        if ( restaurant.toggled() ) {
            restaurant.toggled( false );
        } else {
            restaurant.toggled( true );
            toggled = true;
        }

        setPinPointVisibility( restaurant.id, toggled );

        if ( toggled ) {
            animateToggledPinPoint( restaurant.id );
        }
    }
};

window.initMap = initMap;

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
    viewModel = ko.dataFor(document.body);
    showPinPoints();

    yelp = new Yelp( {
        consumer_key: 'CIz-tW_cOfKadJMveua1vw',
        consumer_secret: 'urj1sBZtRqy0mITbuIOPUtQhED0FdSFDu5QaxAeQSr7dwjE2SHSHb9CuJt8cJK3n'
    });
}

$( () => {
    $( '.collapsed' ).click( function() {
        var $container = $( this );
        toggleSideBarSelection( $container );
    } );

} );

function showPinPoints() {
    clearPinPoints();
    _.each( viewModel.currentRestaurants(), restaurant => {
        var pinPoint = new google.maps.Marker( {
            position: restaurant.location,
            title: restaurant.name,
            animation: google.maps.Animation.DROP,
            id: restaurant.id
        } );

        pinPoints.push(pinPoint);
        pinPoint.addListener( 'click', function() {
            populateInfoWindowWithLoader( this, infoWindow );
            map.panTo(pinPoint.getPosition());
            toggleBounce(this);
            showPhotosForPinPoint( pinPoint )
        } );

    } );
    centralizeViewMap();
}

function resetFilter() {
    $( '#filter' ).val( '' );
}

function clearPinPoints() {
    _.each(pinPoints, (pinPoint) => {
        pinPoint.setMap(null);
    });
    pinPoints = [];
}

function animateToggledPinPoint( id ) {
    _.chain(pinPoints)
    .filter(( pinPoint ) => pinPoint.id === id)
    .each( ( pinPoint ) => {
        new google.maps.event.trigger( pinPoint, 'click' );
    } )
    .value();
}

function setPinPointVisibility( id, visible ) {
    _.chain(pinPoints)
    .filter(( pinPoint ) => pinPoint.id === id)
    .each( ( pinPoint ) => {
        pinPoint.setMap( visible ? map : null )
    } )
    .value();
}

function populateInfoWindowWithLoader( pinPoint, infoWindow ) {
    if ( infoWindow.marker != pinPoint ) {
        infoWindow.marker = pinPoint;
        infoWindow.setContent("<div class='loader'></div");
        infoWindow.open(map, pinPoint);

        infoWindow.addListener( 'closeclick', function() {
            infoWindow.close();
        });
    } else {
        infoWindow.open( map, pinPoint )
    }
}

function populateInfoWindow(pinPoint, infoWindow, pictures) {
    if ( infoWindow.marker != pinPoint ) {
        infoWindow.marker = pinPoint;
        infoWindow.setContent("<div>" + pinPoint.position + "</div");
        infoWindow.open( map, pinPoint );

        infoWindow.addListener( 'closeclick', function() {
            infoWindow.close();
        });
    }
}

function centralizeViewMap() {
    if ( !pinPoints.length ) {
        return;
    }
    var bounds = new google.maps.LatLngBounds();
    _.each( pinPoints, pinPoint => {
        pinPoint.setMap( map );
        bounds.extend( pinPoint.position )
    } );
    map.fitBounds(bounds);
}

function toggleSideBarSelection( el ) {
    if ( el.hasClass( 'collapsed' ) ) {
        el.addClass( 'active ' );
    } else {
        el.removeClass( 'active' );
    }
}

function toggleBounce( pinPoint ) {
    pinPoint.setAnimation( google.maps.Animation.BOUNCE );
    _.delay( function removeAnimation() {
        pinPoint.setAnimation( null );
    }, 740 );
}

function showPhotosForPinPoint( pinPoint ) {
    yelp.searchBusiness( {
        latitude: pinPoint.position.lat(),
        longitude: pinPoint.position.lng()
    } ).then( ( results ) => console.log(results)) 
}