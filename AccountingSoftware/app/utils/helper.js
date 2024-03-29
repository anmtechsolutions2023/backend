exports.isEmpty = (value) => {
  return (
    // null or undefined
    value == null ||
    // has length and it's zero
    (value.hasOwnProperty('length') && value.length === 0) ||
    // is an Object and has no keys
    (value.constructor === Object && Object.keys(value).length === 0)
  )
}

exports.updateFieldValue = (existingObj, updatedObject) => {
  return this.isEmpty(updatedObject)
    ? existingObj[0].FromTransactionTypeId
    : updatedObject
}
