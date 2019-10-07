const Loc = require('../models/locations');

const locationsListByDistance = async (req, res) => {
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const maxDistance = parseInt(req.query.distance);

  if (!lng || !lat || !maxDistance) {
    return res
      .status(404)
      .json({
        "message": "distance, lng and lat query parameters are required"
      });
  }

  const near = {
    type: 'Point',
    coordinates: [lng, lat]
  };
  const geoOptions = {
    distanceField: "distance.calculated",
    spherical: true,
    maxDistance,
    limit: 10
  };
  try {
    const results = await Loc.aggregate([{
      $geoNear: {
        near,
        ...geoOptions
      }
    }]);
    const locations = results.map(result => {
      return {
        id: result._id,
        name: result.name,
        address: result.address,
        rating: result.rating,
        facilities: result.facilities,
        distance: `${result.distance.calculated.toFixed()}m`
      }
    });
    return res.status(200).json(locations);
  } catch (err) {
    return res.status(404).json(err);
  }
};

const locationsCreate = (req, res) => {
  res
    .status(200)
    .json({status: "success"});
};

const locationsReadOne = (req, res) => {
  Loc.findById(req.params.locationId)
    .exec((err, location) => {
      if (!location) {
        return res
          .status(404)
          .json({message: "Location not found"});
      } else if (err) {
        return res
          .status(404)
          .json({message: err});
      }
      res
        .status(200)
        .json(location);
    });
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