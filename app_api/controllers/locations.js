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
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(','),
    coords: {
      type: 'Point',
      coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
    },
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }]
  }, (err, location) => {
    if (err) {
      res
        .status(400)
        .json(err);
    } else {
      res
        .status(201)
        .json(location);
    }
  });
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
  if (!req.params.locationId) {
    res
      .status(404)
      .json({
        "message": "Not found, locationId is required"
      });
    return;
  }
  Loc
    .findById(req.params.locationId)
    .select('-reviews -rating')
    .exec((err, location) => {
      if (!location) {
        res
          .json(404)
          .status({
            "message": "locationId not found"
          });
        return;
      } else if (err) {
        res
          .status(400)
          .json(err);
        return;
      }
      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities = req.body.facilities.split(",");
      location.coords = {
        type: 'Point',
        coordinates: [
          parseFloat(req.body.lng),
          parseFloat(req.body.lat)
        ]
      };
      location.openingTimes = [{
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1,
      }, {
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2,
      }];
      location.save((err, location) => {
        if (err) {
          res
            .status(404)
            .json(err);
        } else {
          res
            .status(200)
            .json(location);
        }
      });
    }
  );
};

const locationsDeleteOne = (req, res) => {
  const {locationId} = req.params;
  if (locationId) {
    Loc.findByIdAndRemove(locationId)
      .exec((err, location) => {
        if (err) {
          res.status(404).json(err)
        }
        res.status(204).json(null);
      });
  } else {
    res.status(404).json({message: "No location"})
  }
};

module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne
};