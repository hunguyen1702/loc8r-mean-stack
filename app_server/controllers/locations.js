const homeList = (req, res) => {
  res.render('location-lists', {title: 'Home'});
};

const locationInfo = (req, res) => {
  res.render('location-info', {title: 'Location info'});
};

const addReview = (req, res) => {
  res.render('location-review-form', {title: 'Add review'});
};

module.exports = {
  homeList,
  locationInfo,
  addReview
};