import React, { Component } from "react";

const LeaderBoard = () => {
  return (
    <div>
      <h1>The Leader Board</h1>
      <div>
        <p>
          {" "}
          Most Clicked Image:
          <button
            onClick={e => {
              e.preventDefault();
              Meteor.call("comparisons.getMostPopularImage", function(
                error,
                result
              ) {
                if (error) {
                  console.log(error.reason);
                  return;
                }
                console.log(result);
              });
            }}
          >
            Find Out!
          </button>
        </p>
        <p> Closest to Even Split: </p>
        <button
          onClick={e => {
            e.preventDefault();
            Meteor.call("comparisons.getEvenComparison", function(
              error,
              result
            ) {
              if (error) {
                console.log(error.reason);
                return;
              }
              console.log(result);
            });
          }}
        >
          Find Out!
        </button>
        <p> Least Popular Image: </p>
        <button
          onClick={e => {
            e.preventDefault();
            Meteor.call("comparisons.getLeastPopularImage", function(
              error,
              result
            ) {
              if (error) {
                console.log(error.reason);
                return;
              }
              console.log(result);
            });
          }}
        >
          Find Out!
        </button>
        <p>
          {" "}
          Most Viewed Comparison:
          <button
            onClick={e => {
              e.preventDefault();
              Meteor.call("comparisons.getMostPopularComparison", function(
                error,
                result
              ) {
                if (error) {
                  console.log(error.reason);
                  return;
                }
                console.log(result);
              });
            }}
          >
            Find Out!
          </button>
        </p>
        <p> Average Session Time: </p>
        <p> Longest Session Time: </p>
        <p> Most Picks in One Session: </p>
        <p> UserId with Most Sessions: </p>
      </div>
    </div>
  );
};
export default LeaderBoard;
