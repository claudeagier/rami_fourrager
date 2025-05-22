import { Validator } from 'jsonschema'
import sticSchema from '@/schemas/stic'
import simulation from '@/schemas/simulation'
import classicFeedSchema from '@/schemas/classicFeed'
import animalProfileSchema from '@/schemas/animalProfile'
import nutritionalValuesSchema from '@/schemas/nutritionalValues'
import mapping from '@/schemas/mapping'

var v = new Validator()

v.addSchema(sticSchema, '/stic')
v.addSchema(animalProfileSchema, '/animalProfile')
v.addSchema(classicFeedSchema, '/classicFeed')
v.addSchema(nutritionalValuesSchema, '/nutritionalValues')
v.addSchema(mapping, '/mapping')
v.addSchema(simulation, '/simulation')

export default v
