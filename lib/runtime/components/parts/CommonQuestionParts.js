import React from 'react';
import S from 'string';

export function title(question, replacer) {
  const html = question.getTitle();
  if (S(html).isEmpty()) return null;
  return (
    <h2
      className="question-title"
      data-dev-id-label={question.getDevId()}
      dangerouslySetInnerHTML={{ __html: replacer.id2Span(html) }}
    />
  );
}

export function description(question, replacer) {
  const html = question.getDescription();
  if (S(html).isEmpty()) return null;
  return <h3 className="question-description" dangerouslySetInnerHTML={{ __html: replacer.id2Span(html) }} />;
}
