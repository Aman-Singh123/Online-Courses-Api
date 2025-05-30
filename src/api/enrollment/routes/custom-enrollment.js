'use strict';

module.exports = [
    {
        method: 'POST',
        path: '/api/enrollments/mark-lesson-completed',
        handler: 'api::enrollment.enrollment.markLessonCompleted',
        config: {
            auth: false, // <-- make it public
            policies: [],
        },
    },
];
