/** @format */

import path from 'node:path';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import type { Ctx } from './types.js';

const BINARY_EXTS = [
	'.png',
	'.jpg',
	'.jpeg',
	'.gif',
	'.webp',
	'.ico',
	'.woff',
	'.woff2',
	'.ttf',
];

export async function renderDir(srcDir: string, destDir: string, ctx: Ctx) {
	const entries = await fs.readdir(srcDir, { withFileTypes: true });
	for (const e of entries) {
		const src = path.join(srcDir, e.name);
		const out = path.join(destDir, e.name.replace(/\.hbs$/, ''));

		if (e.isDirectory()) {
			await fs.mkdirp(out);
			await renderDir(src, out, ctx);
		} else {
			const isBinary = BINARY_EXTS.some((ext) =>
				e.name.toLowerCase().endsWith(ext)
			);
			if (isBinary) {
				await fs.copy(src, out);
			} else {
				const raw = await fs.readFile(src, 'utf8');
				const tpl = Handlebars.compile(raw, { noEscape: true });
				const rendered = tpl(ctx);
				await fs.writeFile(out, rendered, 'utf8');
			}
		}
	}
}
