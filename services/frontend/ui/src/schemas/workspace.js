export default {
  // $schema: 'http://json-schema.org/draft-07/schema#',
  id: '/workspace',
  type: 'object',
  properties: {
    simulations: {
      type: 'array',
      items: { $ref: '/simulation' },
    },
    stics: {
      type: 'array',
      items: { $ref: '/stic' },
    },
    animalProfiles: {
      type: 'array',
      items: { $ref: '/animalProfile' },
    },
    classicFeeds: {
      type: 'array',
      items: { $ref: '/classicFeed' },
    },
    mappings: {
      type: 'array',
      items: { $ref: '/mapping' },
    },
  },
  required: ['simulations', 'stics', 'animalProfiles', 'classicFeeds', 'mappings'],
}
