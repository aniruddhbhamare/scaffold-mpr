import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker, createContainer } from "meteor/react-meteor-data";
import {pathFor, menuItemClass} from "/imports/modules/client/router_utils";
import {Loading} from "/imports/ui/pages/loading/loading.jsx";
import {userEmail, userFullName} from "/imports/modules/client/account_utils";


export class Layout extends Component {
	constructor () {
		super();
	}

	componentDidMount() {
		$(document).on("click", function (e) {
			var clickover = $(e.target).closest(".dropdown-toggle").length;
			var opened = $(".navbar-collapse").hasClass("in");
			if (opened === true && !clickover) {
				$(".navbar-collapse").collapse("hide");
			}
		});

		$(document).on("keydown", function (e) {
			var opened = $(".navbar-collapse").hasClass("in");
			if (opened === true) {
				$(".navbar-collapse").collapse("hide");
			}
		});
	}

	render() {
		return this.props.data.currentUser ?
			<PrivateLayoutContainer content={this.props.content} />
		:
	<PublicLayoutContainer content={this.props.content} />
}
}

export const LayoutContainer = withTracker(function(props) {
	var data = {};

	data.currentUser = Meteor.user();

	return { data: data };
})(Layout);
export class PublicLayout extends Component {
	constructor () {
		super();
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


	

	

	render() {
		if(this.props.data.dataLoading) {
			return (
				<Loading />
			);
		} else {
			return (
				<div className="layout-root">
					<div id="content" className="sticky-wrapper">
						<div id="navbar" className="navbar navbar-fixed-top navbar-default" role="navigation">
							<div className="navbar-container container">
								<div className="navbar-header">
									<button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
										<span className="sr-only">
											Toggle navigation
										</span>
										<span className="icon-bar">
										</span>
										<span className="icon-bar">
										</span>
										<span className="icon-bar">
										</span>
									</button>
									<a className="navbar-brand" href="/">
										MPR v0.0.2
									</a>
								</div>
								<div id="menu" className="collapse navbar-collapse">
									<PublicLayoutLeftMenu data={this.props.data} routeParams={this.props.routeParams} />
									<PublicLayoutRightMenu data={this.props.data} routeParams={this.props.routeParams} />
								</div>
							</div>
						</div>
						<div className="navbar-spacer">
						</div>
						{this.props.content}
					</div>
					<div id="footer" className="sticky-footer">
						<div className="footer-container container">
						</div>
					</div>
				</div>
			);
		}
	}
}

export const PublicLayoutContainer = withTracker(function(props) {
	


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

})(PublicLayout);
export class PublicLayoutLeftMenu extends Component {
	constructor () {
		super();
		
	}

	componentWillMount() {
		
	}

	componentWillUnmount() {
		
	}

	componentDidMount() {
		
	}

	

	

	render() {
		return (
			<ul id="menu-items" className="nav navbar-nav">
				<li id="menu-item-simple" className={menuItemClass('home_public')}>
					<a href={pathFor('home_public', {})}>
						<span className="item-title">
							Home
						</span>
					</a>
				</li>
			</ul>
		);
	}
}
export class PublicLayoutRightMenu extends Component {
	constructor () {
		super();
		
	}

	componentWillMount() {
		
	}

	componentWillUnmount() {
		
	}

	componentDidMount() {
		
	}

	

	

	render() {
		return (
			<ul id="menu-items" className="nav navbar-nav navbar-right">
				<li id="menu-item-simple" className={menuItemClass('register')}>
					<a href={pathFor('register', {})}>
						<span className="item-title">
							Register
						</span>
					</a>
				</li>
				<li id="menu-item-simple" className={menuItemClass('login')}>
					<a href={pathFor('login', {})}>
						<span className="item-title">
							Login
						</span>
					</a>
				</li>
			</ul>
		);
	}
}

export class PrivateLayout extends Component {
	constructor () {
		super();
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


	

	

	render() {
		if(this.props.data.dataLoading) {
			return (
				<Loading />
			);
		} else {
			return (
				<div className="layout-root">
					<div id="content" className="sticky-wrapper">
						<div id="navbar" className="navbar navbar-fixed-top navbar-default" role="navigation">
							<div className="navbar-container container">
								<div className="navbar-header">
									<button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
										<span className="sr-only">
											Toggle navigation
										</span>
										<span className="icon-bar">
										</span>
										<span className="icon-bar">
										</span>
										<span className="icon-bar">
										</span>
									</button>
									<a className="navbar-brand" href="/">
										MPR v0.0.2
									</a>
								</div>
								<div id="menu" className="collapse navbar-collapse">
									<PrivateLayoutLeftMenu data={this.props.data} routeParams={this.props.routeParams} />
									<PrivateLayoutRightMenu data={this.props.data} routeParams={this.props.routeParams} />
								</div>
							</div>
						</div>
						<div className="navbar-spacer">
						</div>
						{this.props.content}
					</div>
					<div id="footer" className="sticky-footer">
						<div className="footer-container container">
						</div>
					</div>
				</div>
			);
		}
	}
}

export const PrivateLayoutContainer = withTracker(function(props) {
	


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

})(PrivateLayout);
export class PrivateLayoutLeftMenu extends Component {
	constructor () {
		super();
		
	}

	componentWillMount() {
		
	}

	componentWillUnmount() {
		
	}

	componentDidMount() {
		
	}

	

	

	render() {
		return (
			<ul id="menu-items" className="nav navbar-nav">
				<li id="menu-item-simple" className={menuItemClass('home_private')}>
					<a href={pathFor('home_private', {})}>
						<span className="item-title">
							Home
						</span>
					</a>
				</li>
				<li id="menu-item-simple" className={menuItemClass('invoices')}>
					<a href={pathFor('invoices', {})}>
						<span className="item-title">
							Invoices
						</span>
					</a>
				</li>
				<li id="menu-item-simple" className={menuItemClass('classrooms')}>
					<a href={pathFor('classrooms', {})}>
						<span className="item-title">
							Classrooms
						</span>
					</a>
				</li>
			</ul>
		);
	}
}
export class PrivateLayoutRightMenu extends Component {
	constructor () {
		super();
		
	}

	componentWillMount() {
		
	}

	componentWillUnmount() {
		
	}

	componentDidMount() {
		
	}

	

	

	render() {
		return (
			<ul id="menu-items" className="nav navbar-nav navbar-right">
				<li id="menu-item-dropdown" className="dropdown ">
					<a href="#" className="dropdown-toggle" data-toggle="dropdown">
						<span className="item-title">
							{userEmail()}
						</span>
						<b className="caret">
						</b>
					</a>
					<ul id="menu-items" className="dropdown-menu">
						<li className={menuItemClass('user_settings')}>
							<a href={pathFor('user_settings', {})}>
								<span className="item-title">
									Settings
								</span>
							</a>
						</li>
						<li className={menuItemClass('logout')}>
							<a href={pathFor('logout', {})}>
								<span className="item-title">
									Logout
								</span>
							</a>
						</li>
					</ul>
				</li>
			</ul>
		);
	}
}

