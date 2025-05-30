'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::lesson.lesson', ({ strapi }) => ({
    async findOne(ctx) {
        const { id: documentId } = ctx.params;
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You must be logged in to view this lesson.");
        }

        // Fetch lesson using documentId and populate course
        const lessons = await strapi.entityService.findMany('api::lesson.lesson', {
            filters: { documentId },
            populate: { course: true },
        });

        const lesson = lessons[0];

        if (!lesson || !lesson.course) {
            return ctx.notFound("Lesson or course not found.");
        }

        // Check if user is enrolled in the course of this lesson
        const enrollments = await strapi.entityService.findMany('api::enrollment.enrollment', {
            filters: {
                user: user.id,
                course: lesson.course.id,
            },
        });

        if (!enrollments.length) {
            return ctx.unauthorized("You are not enrolled in this course.");
        }

        return lesson;
    },
}));
