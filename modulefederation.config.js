import { dependencies } from "./package.json";

export const mfConfig = (envMode) => ({
	name: "storage_objects",
	filename: "remoteEntry.js",
	exposes: {
		"./objects": "./src/amazon.jsx",
	},
	remotes: {
		container:
			envMode === "development"
				? "host@http://localhost:8000/general.js"
				: "host@/general.js",
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
		"@tanstack/react-query": {
			singleton: true,
			strictVersion: true,
			requiredVersion: dependencies["@tanstack/react-query"],
		},
	},
	types: false,
});
