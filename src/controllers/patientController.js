const {
  createPatient,
  updatePatient,
  deletePatient,
  findPatientById,
} = require('../services/patientService');
const { isValidObjectId } = require('../utils/objectId');

async function create(req, res, next) {
  try {
    const patient = await createPatient(req.body);
    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
    const existing = await findPatientById(id);
    if (!existing) return res.status(404).json({ error: 'Patient not found' });
    const patient = await updatePatient(id, req.body);
    res.json(patient);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
    const existing = await findPatientById(id);
    if (!existing) return res.status(404).json({ error: 'Patient not found' });
    await deletePatient(id);
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, update, remove };
