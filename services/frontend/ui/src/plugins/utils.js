export function deepEqual(obj1, obj2) {
  // Si les deux objets sont du même type, on les compare
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
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
  } else {
    // Si les objets sont de types différents, on les compare directement
    return obj1 === obj2
  }
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
export function getCurrentDateTime() {
  var now = new Date()
  var year = now.getFullYear()
  var month = ('0' + (now.getMonth() + 1)).slice(-2) // Les mois sont 0-indexés, donc on ajoute 1
  var day = ('0' + now.getDate()).slice(-2)
  var hours = ('0' + now.getHours()).slice(-2)
  var minutes = ('0' + now.getMinutes()).slice(-2)
  var seconds = ('0' + now.getSeconds()).slice(-2)
  var formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  return formattedDateTime
}
