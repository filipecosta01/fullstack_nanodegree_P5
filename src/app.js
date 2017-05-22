import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import ko from 'knockout';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import '../styles/main.css';

import swal from 'sweetalert/dist/sweetalert.min.js';
import 'sweetalert/dist/sweetalert.css';

import 'font-awesome/css/font-awesome.min.css';

var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'),
        {
            center: {lat: 40.74135, lng: -73.99802},
            zoom: 14
        }
    );
}

window.initMap = initMap;

function main() {

}

$( document ).ready( () => main() );