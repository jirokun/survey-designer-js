import React from 'react';
import { Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap';
import * as HelpMessages from '../../constants/HelpMessages';

export default function Help(props) {
  const html = HelpMessages[props.messageId];
  return (
    <OverlayTrigger
      placement={props.placement || 'top'}
      overlay={
        <Tooltip
          className="help-tooltip text-left wide-tooltip"
          id={`tooltip-${props.messageId}`}
        >
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </Tooltip>
      }
    >
      <Glyphicon className="help" glyph="question-sign" />
    </OverlayTrigger>
  );
}
