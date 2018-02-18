import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import Stats from "../../components/Stats";
import InsightsNavBar from "../../components/InsightsNavBar";

export default class LeadersContainer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <InsightsNavBar />
        <Stats />
      </div>
    );
  }
}
