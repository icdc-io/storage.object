import Loader from "container/Loader";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AmazonStore } from "./AppReducer.js";
import Overview from "./Components/overview.js";
import "./App.scss";

const Amazon = ({ store }) => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		store.injectReducer("AmazonStore", AmazonStore);
		setIsLoaded(true);
	}, []);

	return isLoaded ? <Overview /> : <Loader />;
};

Amazon.propTypes = {
	store: PropTypes.object,
};

export default Amazon;
