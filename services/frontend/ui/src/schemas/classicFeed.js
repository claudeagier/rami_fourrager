export default {
  id: '/classicFeed',
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    correspondingStock: { type: 'string' },
    nutritional_values: { $ref: '/nutritionalValues' },
  },
  required: ['name', 'correspondingStock', 'nutritional_values'],
}
