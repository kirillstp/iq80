import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import Camera from "./components/camera"
import Sensors from "./components/sensors"
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'



const routing = (
    <Router>
      <Route exact path="/" component={App} />
      <Route path="/camera" component={Camera} />
      <Route path="/sensors" component={Sensors} />
    </Router>
  )


ReactDOM.render(routing, document.getElementById("root"));