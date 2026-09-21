import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const baseURL = process.env.PORTFOLIO_URL || 'http://127.0.0.1:3000';
const out = '.impeccable/review';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
const report = { baseURL, checks: [], errors: [], screenshots: [], metrics: {}, accessibility: {} };
const check = (name, passed, detail) => report.checks.push({ name, passed: Boolean(passed), detail });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function instrument(context) {
  await context.addInitScript(() => {
    window.__portfolioQA = { contexts: 0, active: 0, maxActive: 0, lost: 0 };
    const original = HTMLCanvasElement.prototype.getContext;
    const observed = new WeakSet();
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      const result = original.call(this, type, ...args);
      if (result && /webgl/.test(type) && !observed.has(result)) {
        observed.add(result);
        const qa = window.__portfolioQA;
        qa.contexts += 1; qa.active += 1; qa.maxActive = Math.max(qa.maxActive, qa.active);
        this.addEventListener('webglcontextlost', () => { qa.active -= 1; qa.lost += 1; });
      }
      return result;
    };
  });
}

async function inspectLayout(page, name) {
  const layout = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    headings: [...document.querySelectorAll('h1,h2,h3')].map(el => ({ tag: el.tagName, text: el.textContent })),
    main: document.querySelectorAll('main').length,
    canvases: document.querySelectorAll('canvas').length,
    webgl: document.documentElement.dataset.webgl,
    motion: document.documentElement.dataset.motion,
    qa: window.__portfolioQA,
    canvas: [...document.querySelectorAll('canvas')].map(el => ({ width: el.width, height: el.height, data: {...el.dataset} })),
  }));
  report.metrics[name] = layout;
  check(`${name}: no horizontal overflow`, layout.scrollWidth <= layout.width + 1, layout.scrollWidth);
  check(`${name}: one main and h1`, layout.main === 1 && layout.headings.filter(h => h.tag === 'H1').length === 1);
  check(`${name}: one simultaneous WebGL context maximum`, layout.qa.maxActive <= 1, layout.qa);
  return layout;
}

async function shot(page, name, fullPage = false) {
  const path = `${out}/${name}.png`;
  await page.screenshot({ path, fullPage, animations: 'disabled' });
  report.screenshots.push(path);
}

async function moveTo(page, id, fraction = 0) {
  await page.evaluate(({ id, fraction }) => {
    const section = document.getElementById(id);
    const top = section.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top + Math.max(0, section.offsetHeight - innerHeight) * fraction - 76, behavior: 'instant' });
  }, { id, fraction });
  await pause(950);
}

try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
  await instrument(desktop);
  const page = await desktop.newPage();
  page.on('pageerror', error => report.errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await pause(1800);
  await inspectLayout(page, 'desktop');
  check('SSR story order', (await page.locator('main > section').evaluateAll(nodes => nodes.map(n => n.id).join(','))) === 'top,flagship,work,community,contact');
  check('one email destination', (await page.locator('a[href^="mailto:"]').evaluateAll(nodes => [...new Set(nodes.map(n => n.getAttribute('href')))] )).join(',') === 'mailto:hello@tanveersingh.dev');
  check('project credit intact', await page.locator('a[href="https://www.linkedin.com/in/rxshri99"]').count() === 1);
  await shot(page, 'desktop');
  await shot(page, 'desktop-full', true);
  for (const [name, id, fraction] of [['verification-start','flagship',.1],['verification-compare','flagship',.5],['verification-resolve','flagship',.95],['work','work',0],['community','community',0],['contact','contact',0]]) {
    await moveTo(page, id, fraction);
    await shot(page, name);
    report.metrics[name] = await page.evaluate(() => ({ phase: document.querySelector('#flagship')?.dataset.verificationPhase, canvas: [...document.querySelectorAll('canvas')].map(c => ({...c.dataset})), root: {...document.documentElement.dataset} }));
  }
  await moveTo(page,'contact',.8);
  const settledStart=await page.locator('canvas').evaluateAll(nodes=>nodes.map(node=>Number(node.dataset.frames||0)));
  await pause(900);
  const settledEnd=await page.locator('canvas').evaluateAll(nodes=>nodes.map(node=>Number(node.dataset.frames||0)));
  check('settled scene stops its render loop',settledStart.length===1&&settledEnd[0]-settledStart[0]<=2,{settledStart,settledEnd});
  await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
  await pause(800);
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  report.accessibility.desktop = axe.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => ({target:n.target,summary:n.failureSummary})) }));
  check('desktop axe WCAG A/AA', axe.violations.length === 0, axe.violations.length);
  await page.keyboard.press('Tab');
  check('skip link first focus', await page.evaluate(() => document.activeElement?.getAttribute('href') === '#main'));
  await page.keyboard.press('Enter');
  check('skip moves focus into main', await page.evaluate(() => document.activeElement?.id === 'main'));
  const motionButton = page.getByRole('button', {name: /motion|animation/i}).first();
  check('motion control present', await motionButton.count() > 0);
  if (await motionButton.count()) {
    await motionButton.click(); await pause(500);
    check('manual pause removes WebGL', await page.locator('canvas').count() === 0);
    await page.reload({waitUntil:'networkidle'});
    check('manual preference persists', await page.locator('canvas').count() === 0);
  }
  const mobile = await browser.newContext({ viewport: {width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true, reducedMotion:'reduce' });
  await instrument(mobile);
  const phone = await mobile.newPage();
  phone.on('pageerror',error=>report.errors.push(String(error)));
  await phone.goto(baseURL,{waitUntil:'networkidle'});
  await phone.evaluate(()=>document.fonts.ready);
  const small=await inspectLayout(phone,'mobile-reduced');
  check('reduced motion creates no context', small.qa.contexts===0 && small.canvases===0);
  check('reduced narrative compact', await phone.locator('#flagship').evaluate(el=>el.offsetHeight) < 2300);
  await shot(phone,'mobile');
  await shot(phone,'mobile-full',true);
  const phoneAxe=await new AxeBuilder({page:phone}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  report.accessibility.mobile=phoneAxe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
  check('mobile axe WCAG A/AA',phoneAxe.violations.length===0,phoneAxe.violations.length);
  await phone.goto(`${baseURL}/legacylift`,{waitUntil:'networkidle'});
  await inspectLayout(phone,'case-mobile');
  await shot(phone,'case-mobile',true);
  check('case study source facts', await phone.getByText('A real program.',{exact:false}).count()>0);
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:960}});
  const staticPage=await noJS.newPage();
  await staticPage.goto(baseURL,{waitUntil:'networkidle'});
  check('no-JS core content visible', await staticPage.locator('h1').isVisible() && await staticPage.locator('#contact a[href^="mailto:"]').isVisible());
  await shot(staticPage,'no-js');
  const missing=await page.request.get(`${baseURL}/this-page-does-not-exist`);
  check('unknown route 404',missing.status()===404,missing.status());
  for (const route of ['/robots.txt','/sitemap.xml','/opengraph-image','/legacylift/opengraph-image']) {
    const response=await page.request.get(`${baseURL}${route}`);
    check(`${route} resolves`,response.ok(),response.status());
  }
} catch (error) {
  report.errors.push(String(error));
} finally {
  await browser.close();
  check('no browser errors',report.errors.length===0,report.errors);
  await writeFile(`${out}/browser-report.json`,JSON.stringify(report,null,2));
  const failures=report.checks.filter(c=>!c.passed);
  console.log(JSON.stringify({passed:report.checks.length-failures.length,total:report.checks.length,failures,errors:report.errors,screenshots:report.screenshots},null,2));
  if(failures.length)process.exitCode=1;
}
