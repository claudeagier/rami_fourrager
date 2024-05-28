export default {
  id: '/nutritionalValues',
  type: 'object',
  properties: {
    UEL: { type: ['number', 'null'] },
    UEB: { type: ['number', 'null'] },
    UEM: { type: ['number', 'null'] },
    UFL: { type: ['number', 'null'] },
    PDI_inf: { type: ['number', 'null'] },
    UFV: { type: ['number', 'null'] },
    PDIN: { type: ['number', 'null'] },
    PDIE: { type: ['number', 'null'] },
    rejection: { type: ['number', 'null'] },
  },
  required: ['UEL', 'UEB', 'UEM', 'UFL', 'PDI_inf', 'UFV', 'PDIN', 'PDIE', 'rejection'],
}
