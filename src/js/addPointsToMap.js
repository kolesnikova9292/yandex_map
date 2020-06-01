import points from './points';
export const addPointsToMap = (clusterer, BalloonContentLayout) => {
    for (var item of points) {
        let placeMark = new ymaps.Placemark(
            item.coords,
            {
                name: item.name,
                impressions: item.impressions,
                id: item.id,
            },
            {
                balloonContentLayout: BalloonContentLayout,
                balloonPanelMaxMapArea: 0,
            }
        );

        clusterer.add(placeMark);
    }
};
