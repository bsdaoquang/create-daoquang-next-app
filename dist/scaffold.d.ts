/** @format */
type Ctx = {
    target: string;
    packageName: string;
    useTailwind: boolean;
    locales: string[];
};

/** @format */

declare function renderDir(srcDir: string, destDir: string, ctx: Ctx): Promise<void>;

export { renderDir };
