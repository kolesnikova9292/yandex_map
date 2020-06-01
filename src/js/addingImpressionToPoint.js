export function addingImpressionToPoint(
    id,
    username,
    place,
    impressionText,
    map,
    clusterer
) {
    let currentPlacemark;
    const placemarksArray = clusterer.getGeoObjects();

    for (let item of placemarksArray) {
        if (item.properties.get('id') == id) {
            currentPlacemark = item;
            break;
        }
    }

    if (!currentPlacemark) {
        map.geoObjects.each(function (geoObject) {
            if (geoObject.properties && geoObject.properties.get('id') == id) {
                currentPlacemark = geoObject;

                return false;
            }
        });
    }

    let impress = {
        place: place,
        impressions: [],
    };

    let impression = {
        username: username,
        impression: impressionText,
    };

    impress.impressions.push(impression);

    const thisPlace = currentPlacemark.properties
        .get('impressions')
        .filter((x) => x.place == place);

    if (thisPlace.length > 0) {
        let index = currentPlacemark.properties
            .get('impressions')
            .indexOf(thisPlace[0]);

        currentPlacemark.properties
            .get('impressions')
            [index].impressions.push(impression);
    } else {
        currentPlacemark.properties.get('impressions').push(impress);
    }
}
