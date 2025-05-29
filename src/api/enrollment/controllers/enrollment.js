'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::enrollment.enrollment', ({ strapi }) => ({
    // Override create if needed
    async create(ctx) {
        const response = await super.create(ctx);  // Call the default create logic
        return response;
    },

    async find(ctx) {
        const enrollments = await strapi.entityService.findMany('api::enrollment.enrollment', {
            populate: {
                course: {
                    populate: ['thumbnail'],
                },
                user: true,
            },
        });
        return enrollments;
    },

    async findOne(ctx) {
        const { id: documentId } = ctx.params;

        const enrollment = await strapi.entityService.findMany('api::enrollment.enrollment', {
            filters: {
                documentId: documentId,
            },
            populate: {
                course: {
                    populate: ['thumbnail'],
                },
                user: true,
            },
        });

        // Return the first match if it exists
        return enrollment.length > 0 ? enrollment[0] : ctx.notFound('Enrollment not found');
    },
}));
