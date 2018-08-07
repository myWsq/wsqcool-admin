const pkg = require('./package');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: 'spa',

	/*
  ** Headers of the page
  */
	head: {
		title: pkg.name,
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: pkg.description }
		],
		link: [ { rel: 'icon', type: 'image/png', href: '/favicon.png' } ]
	},

	/*
  ** Customize the progress-bar color
  */
	loading: { color: '#FFFFFF' },

	/*
  ** Global CSS
  */
	css: [
		'@/assets/app.styl',
		'vuetify/src/stylus/main.styl',
		'material-design-icons-iconfont/dist/material-design-icons.css'
	],

	/*
  ** Plugins to load before mounting the App
  */
	plugins: [ '@/plugins/vuetify' ],

	/*
  ** Nuxt.js modules
  */
	modules: [ '@nuxtjs/apollo' ],

	apollo: {
		includeNodeModules: true, // optional, default: false (this includes graphql-tag for node_modules folder)
		// required
		clientConfigs: {
			default: {
				httpEndpoint: 'http://localhost:4000/graphql',
				wsEndpoint: 'ws://localhost:4000/graphql',
				ssr: false
			}
		}
	},
	/*
  ** Build configuration
  */
	router: {
		middleware: 'auth'
	},
	generate: {
		dir: 'docs'
	},
	build: {
		/*
    ** You can extend webpack config here
    */
		extend(config, ctx) {
			if (ctx.isServer) {
				config.externals = [
					nodeExternals({
						whitelist: [ /^vuetify/ ]
					})
				];
			}
		}
	}
};
