function isValidObjectId(id) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

module.exports = { isValidObjectId };
