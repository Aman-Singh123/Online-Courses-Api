'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;// this file exports your POST route array

module.exports = createCoreRouter('api::enrollment.enrollment');
    