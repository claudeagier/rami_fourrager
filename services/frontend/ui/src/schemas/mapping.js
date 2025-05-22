export default {
  id: '/mapping',
  type: 'object',
  properties: {
    name: { type: 'string' },
    protected: { type: 'boolean' },
    inUse: { type: 'boolean' },
    fields: { type: 'array' },
  },

  required: ['name', 'protected', 'inUse', 'fields'],
}
