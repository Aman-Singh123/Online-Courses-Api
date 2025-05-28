const { ApplicationError } = require('@strapi/utils').errors;

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Get the single course ID
        const courseId = data.course?.connect?.[0]?.id;
        const lessonOrder = data.lessonOrder;

        if (!courseId || !lessonOrder) {
            console.log("Missing course or lessonOrder");
            return;
        }

        // Check if a lesson with this order already exists in the course
        const existing = await strapi.entityService.findMany('api::lesson.lesson', {
            filters: {
                course: { id: courseId },
                lessonOrder,
            },
        });

        if (existing.length > 0) {
            throw new ApplicationError(`Lesson order ${lessonOrder} already exists for this course.`);
        }
    },

    async beforeUpdate(event) {
        const { data, where } = event.params;

        // Get the single course ID
        const courseId = data.course?.connect?.[0]?.id;
        const lessonOrder = data.lessonOrder;

        if (!courseId || !lessonOrder) {
            console.log("Missing course or lessonOrder in update");
            return;
        }

        // Check if a lesson with this order already exists in the course excluding the current lesson
        const existing = await strapi.entityService.findMany('api::lesson.lesson', {
            filters: {
                course: { id: courseId },
                lessonOrder,
                id: { $ne: where.id },
            },
        });

        if (existing.length > 0) {
            throw new ApplicationError(`Lesson order ${lessonOrder} already exists for this course.`);
        }
    },
};
