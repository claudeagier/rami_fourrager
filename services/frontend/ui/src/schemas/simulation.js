export default {
  type: 'object',
  properties: {
    name: { type: 'string' },
    site: { type: ['integer', 'null'] },
    climaticYear: { type: ['integer', 'null'] },
    lastModifiedDate: { type: ['string', 'null'] },
    loaded: { type: 'boolean' },
    farm: {
      type: 'object',
      properties: {
        rotations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              constraint: { type: ['string', 'null'] },
              surface: { type: ['number', 'null'] },
            },
            required: ['name', 'surface'],
          },
        },
        dimensioning: {
          type: 'object',
          properties: {
            SAU: { type: ['number', 'null'] },
            constrainedSurfaces: {
              type: 'object',
              properties: {
                irrigable: { type: ['number', 'null'] },
                ploughable: { type: ['number', 'null'] },
                superficial: { type: ['number', 'null'] },
                reachable: { type: ['number', 'null'] },
              },
              required: ['irrigable', 'ploughable', 'superficial', 'reachable'],
            },
          },
          required: ['SAU', 'constrainedSurfaces'],
        },
      },
      required: ['rotations', 'totalAvailablePastureByPeriod', 'dimensioning'],
    },
    barn: {
      type: 'object',
      properties: {
        initialStrawStock: { type: ['number', 'null'] },
        initialFeedStock: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              name: { type: 'string' },
              quantity: { type: ['number', 'null'] },
            },
            required: ['code', 'name', 'quantity'],
          },
        },
        initialConcentratedStock: {
          type: 'object',
          properties: {
            proteicQuantity: { type: ['number', 'null'] },
            energeticQuantity: { type: ['number', 'null'] },
          },
          required: ['energeticQuantity', 'proteicQuantity'],
        },
      },
      required: [],
    },
    herd: {
      type: 'object',
      properties: {
        batchs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                },
                required: ['id', 'name'],
              },
              profile: { $ref: '/animalProfile' },
              count: { type: 'integer' },
              housing: {
                type: 'object',
                properties: {
                  // type: {
                  //   type: 'object',
                  //   properties: {
                  //     id: { type: 'integer' },
                  //     name: { type: 'string' },
                  //   },
                  //   required: ['id', 'name'],
                  // },
                  presence: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        period: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            name: { type: 'string' },
                          },
                          required: ['id', 'name'],
                        },
                        animalCount: { type: 'integer' },
                        days: { type: 'number' },
                      },
                      required: ['period', 'animalCount', 'days'],
                    },
                  },
                },
                required: ['presence'],
              },
              classicFeeds: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    period: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                      },
                      required: ['id', 'name'],
                    },
                    feeds: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          type: { $ref: '/classicFeed' },
                          proportion: { type: 'number' },
                        },
                        required: ['type', 'proportion'],
                      },
                    },
                  },
                  required: ['period', 'feeds'],
                },
              },
              concentratedFeeds: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    period: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                      },
                      required: ['id', 'name'],
                    },
                    feeds: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          type: {
                            type: 'object',
                            properties: {
                              id: { type: 'integer' },
                              name: { type: 'string' },
                              correspondingStock: { type: 'string' },
                              nutritional_values: { $ref: '/nutritionalValues' },
                            },
                            required: ['id', 'name', 'correspondingStock', 'nutritional_values'],
                          },
                          quantity: { type: 'number' },
                        },
                        required: ['type', 'quantity'],
                      },
                    },
                  },
                  required: ['period', 'feeds'],
                },
              },
            },
            required: ['type', 'profile', 'count', 'housing', 'classicFeeds', 'concentratedFeeds'],
          },
        },
      },
      required: ['batchs'],
    },
    description: { type: ['string', 'null'] },
  },
  required: ['name', 'site', 'climaticYear', 'lastModifiedDate', 'loaded', 'farm', 'barn', 'herd', 'description'],
}
