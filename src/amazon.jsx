import Loader from "container/Loader";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { AmazonStore } from "./AppReducer.js";
import Overview from "./Components/overview.js";
import "./App.scss";

const Amazon = ({ store }) => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		store.injectReducer("AmazonStore", AmazonStore);
		setIsLoaded(true);
		window.dispatchEvent(
			new CustomEvent("switchTranslations", {
				detail: "storage2",
			}),
		);
	}, []);

	return isLoaded ? <Overview /> : <Loader />;
};

Amazon.propTypes = {
	store: PropTypes.object,
};

export default Amazon;
