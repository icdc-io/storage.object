import React, { useEffect } from 'react';
import Overview from './Components/overview';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AmazonStore } from './AppReducer';
import './App.scss';

const Amazon = ({ t, store }) => {
  useEffect(() => {
    store.injectReducer('AmazonStore', AmazonStore);
  }, []);

  return <Provider store={store}>
    <Router basename={process.env.NODE_ENV === 'production' ? '/storage' : ''}>
      <Overview t={t} />
    </Router>
  </Provider>
};

export default Amazon;
