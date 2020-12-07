module.exports = {
	presets: ["module:metro-react-native-babel-preset"],
	plugins: [
		["@babel/plugin-proposal-decorators", { legacy: true }],
		["@babel/plugin-proposal-class-properties", { "loose": false }],
		["module:react-native-dotenv", {
			"moduleName": "@env",
			"path": ".env",
		}],
		[
			"module-resolver",
			{
				root: ["./"],
				extensions: [
					".ios.js",
					".android.js",
					".js",
					".ts",
					".tsx",
					".json",
				],
				alias: {
					"assets": ["./src/assets"],
					"components": ["./src/components"],
					"finddo-api": ["./src/finddo-api"],
					"hooks": ["./src/hooks"],
					"pages": ["./src/pages"],
					"routes": ["./src/routes"],
					"stores": ["./src/stores"],
					"tests": ["./tests"],
					"themes": ["./src/themes"],
					"utils": ["./src/utils"],
				},
			},
		],
	],
};
