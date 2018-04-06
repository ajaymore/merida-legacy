import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import { StyledFirebaseAuth } from 'react-firebaseui';

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccess: () => false
  },
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      // Invisible reCAPTCHA with image challenge and bottom left badge.
      recaptchaParameters: {
        size: 'invisible',
        badge: 'bottomleft'
      },
      defaultCountry: 'IN'
    }
  ]
};

class App extends Component {
  state = {
    value: ''
  };
  componentDidMount() {
    // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    //   'sign-in-button',
    //   {
    //     size: 'invisible',
    //     callback: response => {
    //       console.log(response);
    //       // reCAPTCHA solved, allow signInWithPhoneNumber.
    //     }
    //   }
    // );
    // firebase.auth().useDeviceLanguage();
    firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        window.postMessage(JSON.stringify(user), '*');
      } else {
        console.log('user not found');
      }
    });
    // window.addEventListener(
    //   'message',
    //   function(event) {
    //     console.log('Received post message', event.data);
    //   },
    //   false
    // );
  }

  _getMessage = async () => {
    const phoneNumber = '+918095937179';
    const appVerifier = window.recaptchaVerifier;
    try {
      const confirmationResult = await firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier);
      this.confirmationResult = confirmationResult;
    } catch (err) {
      console.log(err);
    }
  };

  _confirm = () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        this.confirmationResult.verificationId,
        this.state.value
      );
      firebase.auth().signInWithCredential(credential);
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this._getMessage} id="sign-in-button">
          Send message
        </button>
        <br />
        <input
          type="number"
          value={this.state.code}
          onChange={e => this.setState({ value: e.target.value })}
        />
        <br />
        <button onClick={this._confirm}>Confirm</button> */}
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    );
  }
}

export default App;
