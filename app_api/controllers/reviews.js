const Loc = require('../models/locations');

const reviewsCreate = (req, res) => {
  const locationId = req.params.locationId;
  if (locationId) {
    Loc
      .findById(locationId)
      .select('reviews')
      .exec((err, location) => {
        if (err) {
          res.status(400).json(err);
        } else {
          doAddReview(req, res, location);
        }
      });
  } else {
    res.status(404).json({message: 'Location not found'});
  }
};

const reviewsReadOne = (req, res) => {
  Loc
    .findById(req.params.locationId)
    .select('name reviews')
    .exec((err, location) => {
      if (!location) {
        return res
          .status(404)
          .json({message: 'Location not found'});
      } else if (err) {
        return res
          .status(404)
          .json(err);
      }
      if (location.reviews && location.reviews.length > 0) {
        const review = location.reviews.id(req.params.reviewId);
        if (!review) {
          return res
          .status(404)
          .json({message: 'Review not found'});
        } else {
          let response = {
            location: {
              name: location.name,
              id: req.params.locationId
            },
            review
          };
          return res
            .status(200)
            .json(response);
        }
      } else {
        return res
          .status(404)
          .json({
            message: 'No reviews found'
          });
      }
    });
};

const reviewsUpdateOne = (req, res) => {
  if (!req.params.locationId || !req.params.reviewId) {
    res
      .status(404)
      .json({
        "message": "Not found, locationId and reviewId are both required"
      });
    return;
  }
  Loc
    .findById(req.params.locationId)
    .select('reviews')
    .exec((err, location) => {
      if (!location) {
        res
          .status(404)
          .json({
            "message": "locationId not found"
          });
        return;
      } else if (err) {
        res
          .status(400)
          .json(err);
        return;
      }
      if (location.reviews && location.reviews.length > 0) {
        let thisReview = location.reviews.id(req.params.reviewId);
        if (!thisReview) {
          res
            .status(404)
            .json({
              "message": "reviewId not found"
            });
        } else {
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          location.save((err, location) => {
            if (err) {
              res
                .status(404)
                .json(err);
            } else {
              updateAverageRating(location._id);
              res
                .status(200)
                .json(thisReview);
            }
          });
        }
      } else {
        res
          .status(404)
          json({
            "message": "No review to update"
          });
      }
    }
  );
};

const reviewsDeleteOne = (req, res) => {
  const {locationId, reviewId} = req.params;
  if (!locationId || !reviewId) {
    return res.status(404)
      .json({message: 'Not found, locationId and reviewId are required'});
  }

  Loc.findById(locationId).select('reviews').exec((err, location) => {
    if (!location) {
      return res.status(404).json({message: 'Location not found'});
    } else if (err) {
      return res.status(400).json(err);
    }
    if (location.reviews && location.reviews.length > 0) {
      if (!location.reviews.id(reviewId)) {
        return res.status(404).json({message: 'Review not found'});
      } else {
        location.reviews.id(reviewId).remove();
        location.save(err => {
          if (err) {
            return res.status(404).json(err);
          } else {
            updateAverageRating(location._id);
            res.status(204).json(null);
          }
        });
      }
    } else {
      res.status(404).json({message: 'No review to delete'});
    }
  });
};

const doAddReview = (req, res, location) => {
  if (!location) {
    res.status(404).json({message: 'Location not found'});
  } else {
    const {author, rating, reviewText} = req.body;
    location.reviews.push({
      author,
      rating,
      reviewText
    });
    location.save((err, location) => {
      if (err) {
        res.status(400).json(err);
      } else {
        updateAverageRating(location._id);
        const thisReview = location.reviews.slice(-1).pop();
        res.status(201).json(thisReview);
      }
    });
  }
};

const doSetAverageRating = function(location) {
  if (location.reviews && location.reviews.length > 0) {
    const reviewCount = location.reviews.length;
    let ratingTotal = 0;
    for (let i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
    let ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
};

const updateAverageRating = function(locationId) {
  Loc
    .findById(locationId)
    .select('rating reviews')
    .exec((err, location) => {
      if (!err) {
        doSetAverageRating(location);
      }
    });
};

module.exports = {
  reviewsCreate,
  reviewsReadOne,
  reviewsUpdateOne,
  reviewsDeleteOne
};