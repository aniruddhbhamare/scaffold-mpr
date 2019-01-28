import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker, createContainer } from "meteor/react-meteor-data";
import {pathFor, menuItemClass} from "/imports/modules/client/router_utils";
import {Loading} from "/imports/ui/pages/loading/loading.jsx";
import {mergeObjects} from "/imports/modules/both/object_utils";


export class HomePublicPage extends Component {
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
				<div>
					<div className="page-container container" id="content">
						<div className="row" id="title_row">
							<div className="col-md-12">
							</div>
						</div>
						<HomePublicPageHomeJumbotron data={this.props.data} routeParams={this.props.routeParams} />
					</div>
				</div>
			);
		}
	}
}

export const HomePublicPageContainer = withTracker(function(props) {



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

})(HomePublicPage);

export class HomePublicPageHomeJumbotron extends Component {
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
			<div className="jumbotron ">
				<div id="content" className="container">
					<h1 id="component-title">
						<span id="component-title-icon" className="">
						</span>
						Example application
					</h1>
					<p id="jumbotron-text">
						<b>This <a href="https://www.meteor.com" target="_blank">Meteor</a> application is made with <a href="http://www.meteorkitchen.com" target="_blank">meteor-kitchen</a> without manual coding.</b><br />It shows how to work with DataViews, Forms with dates and lookup fields, master-detail relations etc.<br />Source code (input file for generator) is <a href="https://github.com/perak/kitchen-examples/tree/master/example-invoices" target="_blank">here</a>.
					</p>
					<p id="jumbotron-button">
						<a href={pathFor('login')} className="btn btn-primary btn-lg" role="button">
							Continue &raquo;
						</a>
					</p>
				</div>
			</div>
		);
	}
}

