/**
 * Checks if an object is empty (has no own properties)
 * @param {Object} obj - The object to check
 * @returns {boolean} - Returns true if the object is empty
 */
function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false
    }
  }

  return true
}

export { isEmpty }
