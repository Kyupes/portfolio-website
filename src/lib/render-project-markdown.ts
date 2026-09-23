import { satteri } from '@astrojs/markdown-satteri';

const renderer = satteri().createRenderer({});

export async function renderProjectMarkdown(markdown: string): Promise<string> {
  return (await (await renderer).render(markdown)).code;
}
