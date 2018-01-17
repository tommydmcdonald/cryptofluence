const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('./models');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser  = require("body-parser");
const { updateTickerData, updateChartData } = require('./functions');
const keys = require('./config/keys');
const { mongoURI } = require('./config/mongoURI');

require('./services/passport');

mongoose.connect(mongoURI);

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

require('./routes/authRoutes')(app);
require('./routes/stockRoutes')(app);

updateTickerData(11 * 1000);
updateChartData(60 * 5 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
