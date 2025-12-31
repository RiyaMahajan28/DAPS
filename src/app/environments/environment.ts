export const environment = {
  production: false,

  baseUrl: 'http://northeyeapi.thedaps.com/',

  apiKey: '1',

    headers: {
    'NorthEyeApiKey': '1',
    'Content-Type': 'application/json'
  },

  endpoints: {
    login: 'Client/Login',
    getClient: 'Client/getClient',
    insertClient: 'Client/insertClient',
    updateClient: 'Client/updateClient',

    getState: 'Client/getState',
    insertState: 'Client/insertState',
    updateState: 'Client/updateState',

    getCity: 'Client/getCity',
    insertCity: 'Client/insertCity',
    updateCity: 'Client/updateCity',

    insertLocation: 'Client/insertLocation',
    updateLocation: 'Client/updateLocation',

    getClientZone: 'Client/getClientZone',
    insertClientZone: 'Client/insertClientZone',
    updateClientZone: 'Client/updateClientZone',

    getMenu: 'Client/getMenu',
    getChartClient: 'Client/getChartClient',

    cityDD: 'Client/cityDD',
    cityDDBByMultiState: 'Client/cityDDBByMultiState',
    getLocationByCity: 'Client/getLocationByCity'
  }
};
