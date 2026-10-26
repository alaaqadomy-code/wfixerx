#!/usr/bin/env node
// يتحقق أن كل سؤال وجواب في مخطط FAQPage موجود حرفياً في النص المرئي داخل <main>
// الاستخدام: node scripts/verify-faq.mjs [--live]
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));
const LIVE = process.argv.includes('--live');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

// تطبيع: فك كيانات HTML، توحيد المسافات والمحارف العربية المتشابهة
function norm(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/[​-‏‪-‮﻿­]/g, '') // محارف تحكم غير مرئية
    .replace(/[ً-ْٰ]/g, '')                     // تشكيل
    .replace(/ـ/g, '')                                     // تطويل
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[“”«»]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function visibleText(html) {
  let m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let body = m ? m[1] : html;
  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ');
  return norm(body);
}

function jsonLdBlocks(html) {
  const out = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try { out.push(JSON.parse(m[1])); } catch (e) { out.push({ __parseError: e.message }); }
  }
  return out;
}

function collectFaq(node, acc = []) {
  if (!node || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { node.forEach((n) => collectFaq(n, acc)); return acc; }
  const t = node['@type'];
  const types = Array.isArray(t) ? t : [t];
  if (types.includes('FAQPage')) {
    const items = Array.isArray(node.mainEntity) ? node.mainEntity : node.mainEntity ? [node.mainEntity] : [];
    for (const q of items) {
      const a = q.acceptedAnswer || {};
      acc.push({ q: q.name || '', a: typeof a.text === 'string' ? a.text : '' });
    }
  }
  for (const k of Object.keys(node)) if (k !== '@type') collectFaq(node[k], acc);
  return acc;
}

// جواب المخطط قد يحتوي HTML (مثل <ol><li>)؛ نحوله إلى نص قبل المطابقة
function schemaTextToPlain(s) {
  return norm(String(s).replace(/<[^>]+>/g, ' '));
}

async function livePages() {
  const sm = await fetch('https://wfixerx.com/sitemap-0.xml').then((r) => r.text());
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const pages = [];
  for (const u of urls) {
    const r = await fetch(encodeURI(decodeURI(u)), { headers: { 'user-agent': 'wfixerx-verify/1' } });
    pages.push({ label: decodeURI(u), html: await r.text(), status: r.status });
  }
  return pages;
}

const pages = LIVE
  ? await livePages()
  : walk(DIST).map((p) => ({ label: '/' + relative(DIST, p).replace(/\\/g, '/'), html: readFileSync(p, 'utf8'), status: 200 }));

let totalFaq = 0, bad = 0;
const badByPage = new Map();

for (const page of pages) {
  if (page.status !== 200) { console.log(`!! ${page.label} -> HTTP ${page.status}`); bad++; continue; }
  const vis = visibleText(page.html);
  const faq = jsonLdBlocks(page.html).flatMap((b) => collectFaq(b));
  totalFaq += faq.length;
  for (const { q, a } of faq) {
    const nq = schemaTextToPlain(q), na = schemaTextToPlain(a);
    const qOk = nq && vis.includes(nq);
    const aOk = na && vis.includes(na);
    if (!qOk || !aOk) {
      bad++;
      if (!badByPage.has(page.label)) badByPage.set(page.label, []);
      badByPage.get(page.label).push({ q: nq, missQ: !qOk, missA: !aOk, a: na });
    }
  }
}

for (const [label, items] of badByPage) {
  console.log(`\n### ${label}  (${items.length} بنداً غير مطابق)`);
  for (const it of items) {
    console.log(`  - س: ${it.q.slice(0, 90)}`);
    console.log(`    ${it.missQ ? 'السؤال غير موجود في النص المرئي' : 'السؤال موجود'} | ${it.missA ? 'الجواب غير مطابق' : 'الجواب مطابق'}`);
    if (it.missA) console.log(`    ج(مخطط): ${it.a.slice(0, 160)}`);
  }
}

console.log(`\n==== النتيجة (${LIVE ? 'حي' : 'dist'}) ====`);
console.log(`صفحات: ${pages.length} | بنود FAQ: ${totalFaq} | غير مطابق: ${bad} | صفحات مصابة: ${badByPage.size}`);
process.exit(bad === 0 ? 0 : 1);
