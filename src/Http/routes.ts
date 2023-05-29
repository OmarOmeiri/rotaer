export const API_ROUTES = {
  aerodrome: {
    find: 'aerodrome/find',
    coordinates: 'aerodrome/prelim_info',
    info: 'aerodrome/info',
  },
  aircraft: {
    find: 'aircraft/find',
    save: 'aircraft/save-user-acft',
    findUserAcft: 'aircraft/get-user-acft',
    deleteUserAcft: 'aircraft/delete-user-acft',
    editUserAcft: 'aircraft/edit-user-acft',
  },
  auth: {
    authenticate: 'auth/authenticate',
    gauth: 'auth/g-auth',
  },
  user: {
    create: 'user/create',
    load: 'user/load',
  },
};
