export const gMapLink = (coords: {lat: number, lon: number}, zoom = 15) => `https://www.google.com/maps/place/${coords.lat},${coords.lon}/@${coords.lat},${coords.lon},${zoom}z`;
// `https://www.google.com/maps/@?api=1&map_action=map&center=${coords.lat}%2C${coords.lon}${zoom ? `&zoom=${zoom}` : ''}`;
// `https://www.google.com/maps/search/?api=1&query=${coords.lat}%2C${coords.lon}${zoom ? `&zoom=${zoom}` : ''}`;
// https://www.google.com/maps/place/${coords.lat},${coords.lon}/${coords.lat},${coords.lon},${zoom}z

// https://www.google.com/maps/place/-23.9232676,-46.2703268/-23.9232676,-46.2703268,9.62z
// https://www.google.com/maps/place/-23.9232676,-46.2703268/-23.9232676,-46.2703268,15z
// https://www.google.com/maps/place/-23.9232676,-46.2703268/@-23.9232676,-46.2703268,12z
