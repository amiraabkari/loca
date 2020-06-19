const MapService = (function (){
    const MS = this;
    
    MS.params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: '0VXD0GQYRGUMDDA55YFSMYSXKXJYNT2IGSURHJBC3SA5TO40',
        clientSecret: '5YNU33YME5AM1GB1GLUM0CSUS0F5CNNN5W4DXJGNHZ4AMJFT',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    const loadPlaces = async (position) => {
        const params = MS.params;


        // Foursquare API (limit param: number of maximum places to fetch)
        const endpoint = `https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=30 
        &v=${params.version}`;

        const response = await fetch(endpoint);
        const json = await response.json()
        const places = json.response.venues;
        const fetchPlaces = places.map(place => {
            return async () => {
                const images = await loadImages(place.id, 1)
                return {
                    name: place.name,
                    image: images[0],
                    location: place.location,
                    id: place.id
                }
            }
        })
        const result = Promise.all(fetchPlaces.map(x => x()));
        return result;
    }

    const loadImages = async (placeId, limit) => {
        if (!limit) limit = 10;
        if (limit == 1) {
            const image = window.localStorage.getItem(placeId);
            if (image) return [image];
        }
        const params = MS.params;
        const corsProxy = MS.corsProxy;

        // Foursquare API (limit param: number of maximum places to fetch)
        const endpoint = `https://api.foursquare.com/v2/venues/${placeId}/photos?
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=${limit} 
        &v=${params.version}`;

        const response = await fetch(endpoint);
        if (!response.ok) {
            return ['/placeholder.jpg']
        }
        const json = await response.json();
        if (json.response.photos.count == 0) {
            window.localStorage.setItem(placeId, '/placeholder.jpg');
            return ['/placeholder.jpg']
        }
        const images = json.response.photos.items.map(photo => `${photo.prefix}200x200${photo.suffix}`)
        window.localStorage.setItem(placeId, images[0])
        return images;
    }

    MS.loadImages = loadImages;
    MS.loadPlaces = loadPlaces;
    return MS;
})()