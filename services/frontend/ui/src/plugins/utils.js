import jsonSchemaValidator from '@/plugins/jsonSchemaValidator'
import _ from 'lodash'
export function replaceNan(value, defaultValue) {
  return isNaN(value) ? defaultValue : value
}
export const fixFloatingPoint = (val, precision = 3) => Number.parseFloat(val.toPrecision(precision))
export function deepEqual(obj1, obj2) {
  // Si les deux objets sont identiques, ils sont égaux
  if (obj1 === obj2) {
    return true
  }

  // Si l'un des objets est null ou que les deux objets ne sont pas de type 'object', ils ne sont pas égaux
  if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false
  }

  // On vérifie si les deux objets ont le même nombre de propriétés
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  if (keys1.length !== keys2.length) {
    return false
  }

  // On compare récursivement les valeurs de chaque propriété
  for (const key of keys1) {
    if (!deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}
export function deepCopy(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj // Si l'objet n'est pas un objet ou est null, retourne directement l'objet
  }

  const copy = Array.isArray(obj) ? [] : {} // Crée une copie vide de type tableau ou objet

  for (const key in obj) {
    copy[key] = deepCopy(obj[key]) // Copie récursive des propriétés de l'objet
  }

  return copy
}
export function getCurrentDateTime(full = true) {
  var now = new Date()
  var year = now.getFullYear()
  var month = ('0' + (now.getMonth() + 1)).slice(-2) // Les mois sont 0-indexés, donc on ajoute 1
  var day = ('0' + now.getDate()).slice(-2)
  var hours = ('0' + now.getHours()).slice(-2)
  var minutes = ('0' + now.getMinutes()).slice(-2)
  var seconds = ('0' + now.getSeconds()).slice(-2)
  var formattedDateTime = ''
  if (full) {
    formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  } else {
    formattedDateTime = day + '-' + month + '-' + year
  }
  return formattedDateTime
}

function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function transformToAppCode(fromValue) {
  return removeDiacritics(fromValue.trim().toLowerCase().replace(/ /g, '_'))
}

export async function validateJson(data, schemaName) {
  const options = {
    nestedErrors: true,
    throwFirst: true,
  }

  const schemaModule = await import('@/schemas/' + schemaName + '.js')
  const schema = schemaModule.default || schemaModule

  const validation = jsonSchemaValidator.validate(data, schema, options)
  const isValid = validation.valid

  return isValid
}

export function roundValues(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      roundValues(obj[key]) // Appel récursif pour les objets imbriqués
    } else if (typeof obj[key] === 'number') {
      obj[key] = _.round(obj[key], 0) // Arrondir la valeur
    }
  }
}
