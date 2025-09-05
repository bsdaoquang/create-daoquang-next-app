/** @format */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import prompts from 'prompts';
import { execa } from 'execa';
import { cyan, green, red, yellow } from 'kolorist';
import { renderDir } from './scaffold.js';
import type { Ctx } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TPL_DIR = path.resolve(__dirname, '../templates/default');

function detectPM() {
	const ua = process.env.npm_config_user_agent || '';
	if (ua.startsWith('pnpm')) return 'pnpm';
	if (ua.startsWith('yarn')) return 'yarn';
	return 'npm';
}

async function main() {
	const argTarget = process.argv[2]; // my-app

	const res = await prompts(
		[
			{
				type: argTarget ? null : 'text',
				name: 'target',
				message: 'Project name?',
				initial: 'my-app',
			},
			{
				type: 'text',
				name: 'packageName',
				message: 'Package name?',
				initial: (prev, values) =>
					(argTarget || values.target || 'my-app')
						.toString()
						.trim()
						.toLowerCase()
						.replace(/[^a-z0-9-_]/g, '-'),
			},
			{
				type: 'toggle',
				name: 'useTailwind',
				message: 'Include TailwindCSS?',
				initial: true,
				active: 'yes',
				inactive: 'no',
			},
			{
				type: 'text',
				name: 'locales',
				message: 'i18n locales (comma separated)',
				initial: 'vi,en',
			},
		],
		{ onCancel: () => process.exit(1) }
	);

	const ctx: Ctx = {
		target: argTarget || res.target,
		packageName: res.packageName,
		useTailwind: !!res.useTailwind,
		locales: String(res.locales || 'vi,en')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean),
	};

	const dest = path.resolve(process.cwd(), ctx.target);
	if (fs.existsSync(dest) && fs.readdirSync(dest).length) {
		console.log(red(`Directory '${ctx.target}' is not empty.`));
		process.exit(1);
	}
	await fs.mkdirp(dest);

	await renderDir(TPL_DIR, dest, ctx);

	// Nếu muốn, có thể bật/tắt file Tailwind theo ctx.useTailwind
	if (!ctx.useTailwind) {
		// ví dụ: xoá tailwind config & postcss nếu không dùng
		for (const f of ['tailwind.config.ts', 'postcss.config.js']) {
			const p = path.join(dest, f);
			if (await fs.pathExists(p)) await fs.remove(p);
		}
		// và chỉnh sửa globals.css nếu cần — có thể để sau.
	}

	// Git + cài deps
	try {
		await execa('git', ['init'], { cwd: dest, stdio: 'inherit' });
	} catch {}
	const pm = detectPM();
	console.log(yellow(`Installing dependencies with ${pm}…`));
	await execa(pm, ['install'], { cwd: dest, stdio: 'inherit' });

	try {
		await execa('git', ['add', '-A'], { cwd: dest });
		await execa(
			'git',
			['commit', '-m', 'chore: scaffold from create-bee-next-app'],
			{ cwd: dest }
		);
	} catch {}

	console.log(green(`\n✔ Project ready: ${cyan(ctx.target)}\n`));
	console.log(`Run dev:\n  cd ${ctx.target}\n  ${pm} run dev\n`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
