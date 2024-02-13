import { h, Component } from 'preact';
import Router from 'preact-router';
import App from "./app.tsx";
import FloatingPanel from './components/FloatingPanel';

export default class Routes extends Component {
  render() {
    return (
      <div id="app">
        <Router>
          <App path="/" />
          <FloatingPanel path="/floating-panel" />
        </Router>
      </div>
    );
  }
}
