module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true
	},
	globals: {
		layui: true,
		layer: true,
		jQuery: true
	},
	extends: 'eslint:recommended',
	rules: {
		indent: ['error', 4],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		'no-var': 'error',
		'prettier/prettier': 'error'
	},
	plugins: ['prettier']
}
