const request = require('request');
const apiOptions = {
  server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://boiling-river-05656.herokuapp.com';
}

const homeList = (req, res) => {
  const path = '/api/locations';
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {},
    qs: {
      lng: -0.9692884,
      lat: 51.455262,
      distance: 100
    }
  };
  request(requestOptions, (err, response, body) => {
    renderHomePage(res, res, body);
  });
};

const locationInfo = (req, res) => {
  res.render('location-info', {
    title: 'Starcups',
    pageHeader: {title: 'Starcups'},
    sidebar: {
      context: ' is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: {
      name: 'Starcups',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 3,
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      coords: {lat: 51.455041, lng: -0.9690884},
      openingTimes: [{
        days: 'Monday - Friday',
        opening: '07:00am',
        closing: '07:00pm',
        closed: false
      }, {
        days: 'Saturday',
        opening: '08:00am',
        closing: '05:00pm',
        closed: false
      }, {
        days: 'Sunday',
        closed: true
      }],
      reviews: [{
        author: 'Simon Holmes',
        rating: 5,
        timestamp: '16 July 2013',
        reviewText: 'What a great place. I can\'t say enough good things about it.'
      }, {
        author: 'Charlie Chaplin',
        rating: 3,
        timestamp: '16 June 2013',
        reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
      }]
    }
  });
};

const addReview = (req, res) => {
  res.render('location-review-form', {
    title: 'Review Starcups on Loc8r',
    pageHeader: {title: 'Review Starcups'}
  });
};

const renderHomePage = (req, res, responseBody) => {
  console.log(responseBody);
  res.render('location-lists', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    locations: responseBody,
    sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. ' +
      'Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.'
  });
};

module.exports = {
  homeList,
  locationInfo,
  addReview
};