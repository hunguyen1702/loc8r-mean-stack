const Loc = require('../models/locations');

const locationsListByDistance = (req, res) => {
  res
    .status(200)
    .json({status: "success"});
};

const locationsCreate = (req, res) => {
  res
    .status(200)
    .json({status: "success"});
};

const locationsReadOne = (req, res) => {
  Loc.findById(req.params.locationId)
    .exec(function (err, location) {
      res.status(200)
        .json(location);
    })
};

const locationsUpdateOne = (req, res) => {
  res
    .status(200)
    .json({status: "success"});
};

const locationsDeleteOne = (req, res) => {
  res
    .status(200)
    .json({status: "success"});
};

module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne
};