import js from '@eslint/js';
import globals from 'globals';
import tsEslint from '@typescript-eslint/parser';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
	js.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		ignores: ['eslint.config.js', 'webpack.config.ts', 'dist', 'node_modules'],
		languageOptions: {
			parser: tsEslint,
			globals: {
				...globals.browser,
				...globals.es2020,
				...globals.node,
			},
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
			},
		},
		plugins: {
			'typescript-eslint': tsEslintPlugin,
			prettier: prettierPlugin,
		},
		rules: {
			...eslintConfigPrettier.rules,
			'prettier/prettier': 'error',
			'no-magic-numbers': [
				'error',
				{
					ignore: [0, 1, -1, 2, -2],
					ignoreDefaultValues: true,
					ignoreArrayIndexes: true,
				},
			],
			curly: ['error', 'all'],
			quotes: ['error', 'single', { allowTemplateLiterals: true }],
			semi: ['error', 'always'],
		},
	},
];
