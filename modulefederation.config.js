const { dependencies } = require("./package.json");

module.exports = {
	name: "storage_objects",
	filename: "remoteEntry.js",
	exposes: {
		"./objects": "./src/amazon.jsx",
	},
	remotes: {
		container: "host@/general.js",
	},
	shared: {
		react: {
			singleton: true, // true - load this module once
			strictVersion: true, // only necessary version
			requiredVersion: dependencies.react, // define required module version
		},
		"react-router-dom": {
			singleton: true,
			strictVersion: true,
			requiredVersion: dependencies["react-router-dom"],
		},
		"react-i18next": {
			singleton: true,
			strictVersion: true,
			requiredVersion: dependencies["react-i18next"],
		},
	},
};
