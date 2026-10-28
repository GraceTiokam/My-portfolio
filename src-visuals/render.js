const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const dir = path.resolve(process.argv[2]);
  for (const [src, out] of [['nf-concept.html','nf-concept.jpg'],['cameroon-cover.html','cm-cover.jpg']]) {
    await p.goto('file://' + dir + '/src-visuals/' + src); await p.waitForTimeout(800);
    if (src === 'cameroon-cover.html') {
      /* the source page is 1600x1900: scale it to fit the 16:10 cover, centred on the cream background */
      await p.addStyleTag({ content: 'html{background:#fdf4e3;overflow:hidden}body{zoom:.52;margin:0 auto;overflow:visible!important}' });
      await p.waitForTimeout(300);
    }
    await p.screenshot({ path: dir + '/assets/img/' + out, type: 'jpeg', quality: 86 });
  }
  await b.close();
})();
