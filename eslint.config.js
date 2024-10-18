import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
	{ extends: [js.configs.recommended, ...tseslint.configs.recommended] },
	{ files: ['**/*.{ts,tsx}'] },
	{ ignores: ['dist', 'node_modules', 'eslint.config.js'] },
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.es2020,
				...globals.node,
			},
		},
	},
	{
		plugins: {
			'typescript-eslint': tseslint.plugin,
			prettier: prettierPlugin,
		},
	},
	{
		rules: {
			...prettierPlugin.configs.recommended.rules,
			...eslintConfigPrettier.rules,
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': 'warn',
			'prettier/prettier': ['error', { endOfLine: 'auto' }],
			'prefer-const': 'error',
			'no-unused-vars': 'error',
			'no-multi-spaces': 'error',
			'no-multiple-empty-lines': ['error', { max: 1 }],
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
	}
);
