import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import tooltipsterCss from 'tooltipster/dist/css/tooltipster.bundle.min.css';
import EnquetePreviewApp from './containers/EnquetePreviewApp';
import { configureStore } from './store';
import css from './css/runtime.scss';

window.loadState = (state) => {
  const store = configureStore(state);

  const rootElement = document.getElementById('root');
  render(
    <Provider store={store}>
      <EnquetePreviewApp />
    </Provider>,
    rootElement,
  );
};
