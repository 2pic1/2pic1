import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirm: ""
    };
  }

  render() {
    const samePasswords =
      this.state.password &&
      this.state.confirm &&
      this.state.password === this.state.confirm;

    if (this.state.success) {
      return <Redirect to={{ pathname: "/totally-not-an-admin-page" }} />;
    }
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          Accounts.resetPassword(
            this.props.match.params.token,
            this.state.password,
            err => {
              if (!err) this.setState({ success: true });
            }
          );
        }}
      >
        <input
          type="password"
          placeholer="Password"
          onChange={e => {
            e.preventDefault();
            this.setState({ password: e.target.value });
          }}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={e => {
            e.preventDefault();
            this.setState({ confirm: e.target.value });
          }}
        />

        {samePasswords ? (
          <button type="submit">Change Password</button>
        ) : (
          <div>Passwords do not match</div>
        )}
      </form>
    );
  }
}
