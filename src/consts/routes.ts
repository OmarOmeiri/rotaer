export const APP_ROUTES = {
  home: (locale: Langs) => `${locale}/`,
  aerodromeInfo: (id: string, locale: Langs) => `${locale}/aerodrome-info?id=${id}`,
  myAircraft: (locale: Langs) => `${locale}/my-aircraft`,
  flightPlan: (locale: Langs) => `${locale}/flight-plan`,
};
