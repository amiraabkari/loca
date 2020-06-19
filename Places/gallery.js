const GalleryManager = (function Gallery() {
    const GM = this;
    GM.visible = false;

    const createImageNode = (image) => {
        const imageNode = document.createElement('a-entity');
        imageNode.setAttribute('look-at', '[gps-camera]')
        imageNode.setAttribute('data-thumb', `${image}`)
        imageNode.setAttribute('template', 'src: #galleryImage')
        return imageNode
    }

    const showGallery = async (placeId) => {

        const placeNodes = document.querySelectorAll('.place');
        placeNodes.forEach(placeNode => {
            placeNode.setAttribute('visible', false);
            const image = placeNode.querySelector('.link')
            image.classList.add('hidden')
        })
        const imageGallery = document.querySelector('#images');

        const images = await MapService.loadImages(placeId, 5);
        images.forEach(image => {
            const imageNode = createImageNode(image)
            imageGallery.appendChild(imageNode)
        })

        const closeButton = document.querySelector('#close');
        closeButton.setAttribute('visible', true);
        closeButton.classList.remove('hidden')

        GM.visible = true;
    }

    const clearGallery = async () => {
        const imageGallery = document.querySelector('#images');
        imageGallery.innerHTML = '';

        const closeButton = document.querySelector('#close');
        closeButton.setAttribute('visible', false);
        closeButton.classList.add('hidden')

        const placeNodes = document.querySelectorAll('.place');
        placeNodes.forEach(placeNode => {
            placeNode.setAttribute('visible', true);
            const image = placeNode.querySelector('.link')
            image.classList.remove('hidden')
        })
        GM.visible = false;
    }

    GM.showGallery = showGallery;
    GM.clearGallery = clearGallery;

    return GM
})()