window.onload = () => {

}

var map;
var markers = [];
var infoWindow;

function initMap() {
    var styles = [
        { elementType: 'geometry', stylers: [{ color: '#570532' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#0c0214' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#0b8513' }] },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: 'blue' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c' }]
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: 'green' }]
                //#261633
        },
        {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }]
        }
    ]
    var losAngelos = {
        lat: 34.063380,
        lng: -118.358080
    }
    var options = {
            zoom: 13,
            styles: styles,
            center: losAngelos,


        }
        // new map
    map = new google.maps.Map(document.getElementById('map'), options);
    infoWindow = new google.maps.InfoWindow();

    searchStore();

}

function searchStore() {
    var foundStore = [];
    var zipCode = document.getElementById('search-input').value;
    //var zipCode = zipCodes.value
    if (zipCode) {
        for (var store of stores) {
            var postal = store['address']['postalCode'].substring(0, 5);

            if (postal == zipCode) {
                foundStore.push(store);
            }

        }
    } else {
        foundStore = stores
    }
    clearLocation();
    displayStore(foundStore);
    showStoreMarker(foundStore);
    setOnclikListener();

}

function clearLocation() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;

    //var storeHTML = '';
    const storeData = document.querySelector('.displayAreas');

    storeData.innerHTML = ''


}

function setOnclikListener() {
    var storeElements = document.querySelectorAll(".store-container");
    storeElements.forEach(function(elem, index) {
        elem.addEventListener('click', function() {
            new google.maps.event.trigger(markers[index], 'click');


        });
    });

}

function displayStore(stores) {
    var storeHTML = '';
    const storeData = document.querySelector('.displayAreas');

    for (let [index, store] of stores.entries()) {
        // console.log(store);
        let address = store["addressLines"];
        let phone = store["phoneNumber"];

        var storeHTML = `
        <div class="store-container-background">
            <div class="store-container">
                <div class="store-container-list">
                        <div class="address">
                            <h4 class="store-address"><span>${address[0]}</span>
                                <span>${address[1]}</span></h4>
                                <p class="store-phone-number">${phone}</p>
                        </div>
                        <div class='store-number-container'>
                             <span class="store-number">${index+1}</span>
                       </div>
                </div>
            <div>  
          </div>
    `;

        storeData.innerHTML += storeHTML;

    }
}

function showStoreMarker(stores) {
    var bounds = new google.maps.LatLngBounds();
    for (var [index, store] of stores.entries()) {
        var latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"],
        );

        var name = store["name"];
        var address = store['addressLines'][0];
        let openingTime = store['openStatusText'];
        let phone = store["phoneNumber"];
        bounds.extend(latlng)
        createMarker(latlng, name, address, (index + 1), openingTime, phone);
    }
    map.fitBounds(bounds);
}

function createMarker(latlng, name, address, index, openingTime, phone) {

    var html = ` <div class='store-marker-container'>
    <div class='store-marker-name-container'>
        <div class='store-marker-name'>${name}</div> 
         <div class='store-marker-time'>${openingTime}</div>
        </div>
            <div class='store-marker-address-container'>
            <div class='store-marker-address'>
            <a href="http://maps.google.com/?q=${address}" target='_blank'>
           <span><i class="fa fa-location-arrow" aria-hidden="true"></i></span> ${address}</a></div>
            <div class='store-marker-phone'>
             <span><i class="fa fa-phone" aria-hidden="true"></i></span>${phone}</div>

</div>
    </div>`;
    //index.style.color = "red";
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: {
            color: '#568c0b',
            fontSize: '15px',
            fontWeight: '1000',
            text: index.toString()
        },
        icon: './image/MapMarker_Marker_Inside_Pink .png'
    });

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);

}