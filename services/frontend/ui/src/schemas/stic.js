const pasture_type = {
  id: null,
  name: null,
  code: null,
  nutritional_values: {
    UEL: null,
    UEB: null,
    UEM: null,
    UFL: null,
    PDI_inf: null,
    UFV: null,
    PDIN: null,
    PDIE: null,
    rejection: null,
  },
}
const site = { id: null, name: null, code: null }

export default {
  id: null,
  climatic_year_id: null,
  pasture_type_id: null,
  code: '',
  name: '',
  type: '',
  rendement: '',
  designation: '',
  RU: '',
  IN: '',
  ITK: '',
  detail_ITK: '',
  stic_periods: [
    { id: 1, period_id: 1, production: 0, farming_method: '' },
    { id: 2, period_id: 2, production: 0, farming_method: '' },
    { id: 3, period_id: 3, production: 0, farming_method: '' },
    { id: 4, period_id: 4, production: 0, farming_method: '' },
    { id: 5, period_id: 5, production: 0, farming_method: '' },
    { id: 6, period_id: 6, production: 0, farming_method: '' },
    { id: 7, period_id: 7, production: 0, farming_method: '' },
    { id: 8, period_id: 8, production: 0, farming_method: '' },
    { id: 9, period_id: 9, production: 0, farming_method: '' },
    { id: 10, period_id: 10, production: 0, farming_method: '' },
    { id: 11, period_id: 11, production: 0, farming_method: '' },
    { id: 12, period_id: 12, production: 0, farming_method: '' },
    { id: 13, period_id: 13, production: 0, farming_method: '' },
  ],
  site: null,
  pasture_type: null,
}