const express = require('express');
const config = require('../../config/config');

const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const productRoute = require('./product.route');
const xmlRoute = require('./xml.route');
const xmlHistoryRoute = require('./xmlhistory.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/product',
    route: productRoute,
  },
  {
    path: '/xml',
    route: xmlRoute,
  },
  {
    path: '/history',
    route: xmlHistoryRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
