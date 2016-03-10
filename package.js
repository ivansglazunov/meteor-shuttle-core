Package.describe({
	name: 'ivansglazunov:shuttle-rights',
	version: '0.0.7',
	summary: 'DEPRECATED',
	git: 'https://github.com/ivansglazunov/meteor-shuttle-rights.git',
	documentation: 'README.md'
});

Package.onUse(function(api) {
	api.versionsFrom('1.2.1');

	api.use('ecmascript');
	api.use('mongo');
	api.use('accounts-base');
	
	api.use('stevezhu:lodash@4.3.0');
	api.use('matb33:collection-hooks@0.8.1');
	api.use('ivansglazunov:refs@0.1.0');
	api.use('ivansglazunov:history@0.0.2');
	api.use('ivansglazunov:trees@1.1.9');
	api.use('ivansglazunov:delete@0.2.0');
	api.use('aldeed:collection2@2.8.0');
	
	api.addFiles([
		'shuttle.js',
		'merged.js',
		'merging.js',
		'used.js',
		'unused.js',
		'owning.js'
	]);
	
	api.export('Shuttle');
});
