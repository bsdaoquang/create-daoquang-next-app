#!/usr/bin/env node
/** @format */

import('../dist/index.js').catch((err) => {
	console.error(err);
	process.exit(1);
});
