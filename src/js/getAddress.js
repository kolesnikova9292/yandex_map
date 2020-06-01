export const getAddress = async (coords) => {
    const result = await ymaps.geocode(coords);
    const firstGeoObject = await result.geoObjects.get(0);
    return await firstGeoObject.getAddressLine();
};
