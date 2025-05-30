'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::enrollment.enrollment', ({ strapi }) => ({
    async create(ctx) {
        const response = await super.create(ctx);
        return response;
    },
    async markLessonCompleted(ctx) {
        // console.log('markLessonCompleted called');
        const { enrollmentId, lessonId } = ctx.request.body;

        const enrollments = await strapi.entityService.findMany('api::enrollment.enrollment', {
            filters: { documentId: enrollmentId },
            populate: {
                completedLessons: true,
                course: { populate: ['lessons'] },
            },
        });
        // console.log("enrollments **********", enrollments);

        const enrollment = enrollments.length > 0 ? enrollments[0] : null;
        if (!enrollment) {
            console.log("Not found");
            return ctx.notFound('Enrollment not found');
        }

        const alreadyCompleted = enrollment.completedLessons.find(l => l.id === lessonId);
        if (!alreadyCompleted) {
            await strapi.entityService.update('api::enrollment.enrollment', enrollment.id, {
                data: {
                    completedLessons: [...enrollment.completedLessons.map(l => l.id), lessonId],
                },
            });
        }

        const updatedEnrollment = await strapi.entityService.findOne('api::enrollment.enrollment', enrollment.id, {
            populate: {
                completedLessons: true,
                course: { populate: ['lessons'] },
            },
        });

        const totalLessons = updatedEnrollment.course.lessons.length;
        const completedCount = updatedEnrollment.completedLessons.length;
        const newProgress = Math.round((completedCount / totalLessons) * 100);

        await strapi.entityService.update('api::enrollment.enrollment', enrollment.id, {
            data: {
                progress: newProgress,
            },
        });

        ctx.send({ message: 'Lesson marked complete', progress: newProgress });
    },
    

    async find(ctx) {
        console.log("find working  here ")
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

        return enrollment.length > 0 ? enrollment[0] : ctx.notFound('Enrollment not found');
    },


}));
