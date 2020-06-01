export function openBaloonOfChoosenPlacemark(idOfPlacemark, map, clusterer) {
    let currentPlacemark;
    const placemarksArray = clusterer.getGeoObjects();

    for (let item of placemarksArray) {
        if (item.properties.get('id') == idOfPlacemark) {
            currentPlacemark = item;
            break;
        }
    }

    clusterer.balloon.close();
    clusterer.remove(currentPlacemark);
    map.geoObjects.add(currentPlacemark);
    currentPlacemark.balloon.open();
}
