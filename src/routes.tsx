import { h, Component } from 'preact';
import Router from 'preact-router';
import App from "./app.tsx";
import ThreejsScene from './components/ThreejsScene';

export default class Routes extends Component {
  render() {
    return (
      <div id="app">
        <Router>
          <App path="/" />
          <ThreejsScene path="/floating-panel" />
        </Router>
      </div>
    );
  }
}
