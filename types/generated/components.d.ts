import type { Schema, Struct } from '@strapi/strapi';

export interface QuestionOptionsOptions extends Struct.ComponentSchema {
  collectionName: 'components_question_options_options';
  info: {
    displayName: 'options';
  };
  attributes: {
    label: Schema.Attribute.String;
  };
}

export interface QuizQuestionsQuestion extends Struct.ComponentSchema {
  collectionName: 'components_quiz_questions_question_s';
  info: {
    description: '';
    displayName: 'question ';
  };
  attributes: {
    correctAnswerIndex: Schema.Attribute.Integer;
    options: Schema.Attribute.Component<'question-options.options', true>;
    questiontext: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'question-options.options': QuestionOptionsOptions;
      'quiz-questions.question': QuizQuestionsQuestion;
    }
  }
}
