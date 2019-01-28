import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker, createContainer } from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor";
import {pathFor, menuItemClass} from "/imports/modules/client/router_utils";
import {getFormData} from "/imports/modules/client/form_utils";
import {Loading} from "/imports/ui/pages/loading/loading.jsx";
import {mergeObjects} from "/imports/modules/both/object_utils";


export class LoginPage extends Component {
	constructor () {
		super();
		this.state = {
			errorMessage: ""
		};
		this.renderErrorMessage = this.renderErrorMessage.bind(this);
		this.onLoginWithGoogle = this.onLoginWithGoogle.bind(this);
		this.onLoginWithGithub = this.onLoginWithGithub.bind(this);
		this.onLoginWithLinkedin = this.onLoginWithLinkedin.bind(this);
		this.onLoginWithFacebook = this.onLoginWithFacebook.bind(this);
		this.onLoginWithTwitter = this.onLoginWithTwitter.bind(this);
		this.onLoginWithMeteor = this.onLoginWithMeteor.bind(this);
		this.onLoginWithPassword = this.onLoginWithPassword.bind(this);
		this.onLoginWithAuth0 = this.onLoginWithAuth0.bind(this);
		
	}

	componentWillMount() {
		
	}

	componentWillUnmount() {
		
	}

	componentDidMount() {
		

		Meteor.defer(function() {
			globalOnRendered();
		});
	}

	renderErrorMessage() {
		return (
			<div className="alert alert-warning">
				{this.state.errorMessage}
			</div>
		);
	}

	onLoginWithGoogle(e) {
		e.preventDefault();
		this.setState({ errorMessage: "" });

		let self = this;

		var button = $(e.currentTarget);
		button.button("loading");

		Meteor.loginWithGoogle(
			{
				requestPermissions: ["email"]
			},
			function(err) {
				button.button("reset");
				if(err) {
					self.setState({ errorMessage: err.message });
					return false;
				}
			}
		);

		return false;
	}

	onLoginWithGithub(e) {
		e.preventDefault();
		this.setState({ errorMessage: "" });

		let self = this;

		var button = $(e.currentTarget);
		button.button("loading");

		Meteor.loginWithGithub(
			{
				requestPermissions: ["public_repo", "user:email"]
			},
			function(err) {
				button.button("reset");
				if(err) {
					self.setState({ errorMessage: err.message });
					return false;
				}
			}
		);

		return false;
	}

	onLoginWithLinkedin(e) {
		e.preventDefault();
		this.setState({ errorMessage: "" });

		let self = this;

		var button = $(e.currentTarget);
		button.button("loading");

		Meteor.loginWithLinkedIn({
				requestPermissions: ["r_basicprofile", "r_emailaddress"]
		},
		function(err) {
			button.button("reset");
			if(err) {
				self.setState({ errorMessage: err.message });
				return false;
			}
		});
		return false;
	}

	onLoginWithFacebook(e) {
		e.preventDefault();
		this.setState({ errorMessage: "" });

		let self = this;

		var button = $(e.currentTarget);
		button.button("loading");

		Meteor.loginWithFacebook({
			requestPermissions: ["email"]
		},
		function(err) {
			button.button("reset");
			if(err) {
				self.setState({ errorMessage: err.message });
				return false;
			}
		});
		return false;
	}

	onLoginWithTwitter(e) {
		e.preventDefault();
		this.setState({ errorMessage: "" });

		let self = this;

		var button = $(e.currentTarget);
		button.button("loading");

		Meteor.loginWithTwitter({
			requestPermissions: ["email"]
		},
		function(err) {
			button.button("reset");
			if(err) {
				self.setState({ errorMessage: err.message });
				return false;
			}
		});

		return false;
	}

	onLoginWithMeteor(e) {
		e.preventDefault();
		this.setState({ errorMessage: "" });

		let self = this;

		var button = $(e.currentTarget);
		button.button("loading");

		Meteor.loginWithMeteorDeveloperAccount({
			requestPermissions: ["email"]
		},
		function(err) {
			button.button("reset");
			if(err) {
				self.setState({ errorMessage: err.message });
				return false;
			}
		});

		return false;
	}

	onLoginWithAuth0(e) {
		e.preventDefault();
		this.setState({ errorMessage: "" });

		let self = this;

		var button = $(e.currentTarget);
		button.button("loading");

		Meteor.loginWithAuth0({
			requestPermissions: ["openid", "profile", "email"]
		},
		function(err) {
			button.button("reset");
			if(err) {
				self.setState({ errorMessage: err.message });
				return false;
			}
		});

		return false;
	}

	onLoginWithPassword(e) {
		e.preventDefault();
		this.setState({ errorMessage: "" });

		let self = this;

		let submitButton = $(e.target).find("button[type='submit']");

		getFormData(e.target, {
			onSuccess: function(values) {
				submitButton.button("loading");
				Meteor.loginWithPassword(values.email, values.password, function(err) {
					submitButton.button("reset");
					if(err) {
						self.setState({ errorMessage: err.message });
						return false;
					}
				});
			},
			onError: function(message) {
				self.setState({ errorMessage: message });
			},
			fields: {
				email: { type: "email", required: true },
				password: { required: true }
			}
		});

		return false;
	}

	

	

	render() {
		if(this.props.data.dataLoading) {
			return (
				<Loading />
			);
		} else {
			return (
				<div className="page-container container" id="content">
					<form id="login_form" className="account-form" role="form" onSubmit={this.onLoginWithPassword}>
						<h2>
							Please sign in
						</h2>
						{this.state.errorMessage ? this.renderErrorMessage() : null}
						<div id="login-with-password">
							<input type="text" id="login-email" name="email" className="form-control" placeholder="Email address" autoFocus />
							<input type="password" id="login-password" name="password" className="form-control" placeholder="Password" />
							<button className="btn btn-lg btn-primary btn-block" type="submit" data-loading-text="Please wait...">
								Sign in
							</button>
							<p className="account-form-text-after" id="register-link">
								Not a member?&nbsp;
								<a href={pathFor('register')}>
									Sign up here
								</a>
							</p>
							<p className="account-form-text-after" id="forgot-password-link">
								Forgot password?&nbsp;
								<a href={pathFor('forgot_password')}>
									Click here
								</a>
							</p>
						</div>
					</form>
				</div>
			);
		}
	}
}

export const LoginPageContainer = withTracker(function(props) {
	


	let isReady = function() {
		

		let subs = [
		];
		let ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	};

	let data = { dataLoading: true };

	if(isReady()) {
		

		data = {

			};
		

		
	}
	return { data: data };

})(LoginPage);

