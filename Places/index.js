(function (){
    const APP = this;
    

    const showPlaces = (places) => {
        places.forEach((place) => {
            const latitude = place.location.lat;
            const longitude = place.location.lng;

            // add place name
            const placeThumbnail = document.createElement('a-entity');

            placeThumbnail.addEventListener('loaded', () => {
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    console.log('fired')
                }, 50)
            });

            placeThumbnail.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
            placeThumbnail.setAttribute('data-title', place.name);
            placeThumbnail.setAttribute('data-thumb', place.image)
            placeThumbnail.setAttribute('look-at', '[gps-camera]')
            placeThumbnail.setAttribute('scale', '30 30 30');
            placeThumbnail.setAttribute('template', 'src: #link')
            placeThumbnail.setAttribute('data-placeId', place.id)

            placeThumbnail.addEventListener('click', function (evt) {
                GalleryManager.showGallery(place.id)
            });


            

            scene.appendChild(placeThumbnail);
        });
    }

    const init = () => {
        APP.scene = document.querySelector('#places');
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const places = await MapService.loadPlaces(position.coords);
                showPlaces(places);
            }),
            (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
        document.querySelector('#close').addEventListener('click', () => {
            GalleryManager.clearGallery()
        })
    }

    window.onload = init
})()