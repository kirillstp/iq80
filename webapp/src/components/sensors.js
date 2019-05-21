import React, { Component } from "react";
import "../App.css";
//MUI
import Header from './shared/header.js'


const styles = {
};



class Sensors extends Component {
    
    // Motion detection user interface. 

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render(){
        return(
          <Header title="Sensors and Environment"></Header>
        );
    }
}

export default Sensors;