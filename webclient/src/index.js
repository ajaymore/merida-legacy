import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';
var config = {
  apiKey: 'AIzaSyAyvB1UvFFVLBCGqyM7DkmiiHELhok5NPU',
  authDomain: 'ossdevtk.firebaseapp.com',
  databaseURL: 'https://ossdevtk.firebaseio.com',
  projectId: 'ossdevtk',
  storageBucket: 'ossdevtk.appspot.com',
  messagingSenderId: '362331924139'
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
