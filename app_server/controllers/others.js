const about = (req, res) => {
  res.render('index', {title: 'Express'});
};

module.exports = {
  about
};