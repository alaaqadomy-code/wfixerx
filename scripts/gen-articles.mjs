// مولد مقالات المدونة — يبني ملفات .astro مطابقة لقالب الموجة الحالية من بيانات JS
// الاستخدام: node scripts/gen-articles.mjs scripts/articles-data/batch1.mjs [batch2.mjs ...]
import { writeFileSync, mkdirSync } from "fs";
import { pathToFileURL } from "url";

const WA = `https://wa.me/962795827790?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20WFixerX%20%F0%9F%91%8B%20%D8%AD%D8%B3%D8%A7%D8%A8%D9%8A%20%D9%85%D8%AD%D8%B8%D9%88%D8%B1%20%D9%88%D8%A3%D8%AD%D8%AA%D8%A7%D8%AC%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9%20%7C%20%D9%88%D8%B5%D9%84%D8%AA%20%D9%85%D9%86%20%D9%85%D9%88%D9%82%D8%B9%20wfixerx.com`;
const TG = `https://t.me/+962795827790`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

const liList = (items) => items.map((t) => `      <li class="flex items-start gap-3 bg-[#0a1628] border border-white/8 rounded-xl p-4"><span class="text-[#25D366] mt-0.5 shrink-0">▸</span><span class="text-white/70">${t}</span></li>`).join("\n");
const liOl = (items) => items.map((t, i) => `      <li class="flex items-start gap-3 bg-[#0a1628] border border-white/8 rounded-xl p-4"><span class="text-[#25D366] font-bold shrink-0">${i + 1}.</span><span class="text-white/70">${t}</span></li>`).join("\n");
const tableHtml = (tb) => `    <div class="overflow-x-auto mb-8">
      <table class="w-full text-sm border-collapse">
        <thead><tr class="bg-[#0a1628] border border-white/10">${tb.head.map((h) => `<th class="p-4 text-right text-white font-bold">${h}</th>`).join("")}</tr></thead>
        <tbody>
${tb.rows.map((r, i) => `          <tr class="border border-white/8 bg-[${i % 2 ? "#0d1e30" : "#0a1628"}]">${r.map((c, j) => `<td class="p-4 ${j === 0 ? "text-white font-medium" : "text-white/60"}">${c}</td>`).join("")}</tr>`).join("\n")}
        </tbody>
      </table>
    </div>`;
const cta = () => `    <div class="bg-gradient-to-br from-[#0d2844] to-[#041a0c] rounded-2xl p-6 my-10 border border-[#25D366]/15 text-center">
      <p class="font-semibold text-white mb-2">تحتاج إلى تقييم حالتك؟</p>
      <p class="text-white/50 text-sm mb-4">تواصل معنا وسنشرح لك الخيار المناسب دون طلب كلمة مرور ودون ضمان نتيجة</p>
      <div class="flex flex-wrap justify-center gap-3">
        <a href={WA_LINK} target="_blank" rel="noopener" class="btn-wa">تواصل عبر واتساب</a>
        <a href={TG_LINK} target="_blank" rel="noopener" class="btn-tg">تواصل عبر تلغرام</a>
      </div>
    </div>`;

function sectionHtml(sec) {
  if (sec.cta) return cta();
  let out = `    <h2 class="text-2xl font-bold text-white mt-12 mb-6">${sec.h2}</h2>\n`;
  for (const b of sec.blocks) {
    if (typeof b === "string") out += `    <p class="text-white/70 leading-relaxed mb-5">${b}</p>\n`;
    else if (b.ul) out += `    <ul class="space-y-3 mb-8">\n${liList(b.ul)}\n    </ul>\n`;
    else if (b.ol) out += `    <ol class="space-y-3 mb-8">\n${liOl(b.ol)}\n    </ol>\n`;
    else if (b.table) out += tableHtml(b.table) + "\n";
  }
  return out;
}

function build(a) {
  const url = `https://wfixerx.com/مدونة/${a.slug}/`;
  const schema = JSON.stringify([
    { "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.metaDesc, author: { "@type": "Organization", name: "WFixerX", url: "https://wfixerx.com" }, publisher: { "@type": "Organization", name: "WFixerX", url: "https://wfixerx.com" }, datePublished: a.date, dateModified: a.modified || a.date, inLanguage: "ar", mainEntityOfPage: url, url },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://wfixerx.com/" }, { "@type": "ListItem", position: 2, name: "المدونة", item: "https://wfixerx.com/مدونة/" }, { "@type": "ListItem", position: 3, name: a.crumb, item: url } ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: a.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]);

  return `---
import BaseLayout from '../../layouts/BaseLayout.astro';

const WA_LINK = "${WA}";
const TG_LINK = "${TG}";

const schema = JSON.stringify(${schema});
---

<BaseLayout title="${esc(a.title)}" description="${esc(a.metaDesc)}" schema={schema}>

  <nav class="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2" aria-label="مسار التنقل">
    <ol class="flex items-center gap-2 text-sm text-white/40 flex-wrap">
      <li><a href="/" class="hover:text-[#25D366]">الرئيسية</a></li>
      <li aria-hidden="true">←</li>
      <li><a href="/مدونة/" class="hover:text-[#25D366]">المدونة</a></li>
      <li aria-hidden="true">←</li>
      <li class="text-white/70 font-medium">${a.crumb}</li>
    </ol>
  </nav>

  <header class="bg-gradient-to-b from-[#040b18] to-[#060d1a] py-12 px-4 sm:px-6 border-b border-white/8">
    <div class="max-w-4xl mx-auto">
      <p class="text-xs text-white/40 mb-4">أكتوبر 2026 · وقت القراءة: ${a.readMins} دقائق</p>
      <h1 class="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">${a.title}</h1>
      <p class="text-lg text-white/60 leading-relaxed">${a.intro}</p>
    </div>
  </header>

  <article class="max-w-4xl mx-auto px-4 sm:px-6 py-12">

    <div class="relative rounded-2xl overflow-hidden border border-[#25D366]/20 bg-gradient-to-br from-[#0a1628] to-[#041a0c] p-7 mb-10">
      <p class="text-xs font-semibold text-[#25D366] uppercase tracking-wider mb-3">إجابة مباشرة</p>
      <h2 class="text-xl font-bold text-white mb-3">${a.answer.h2}</h2>
      <p class="text-white/70 leading-relaxed">${a.answer.text}</p>
    </div>

${a.sections.map(sectionHtml).join("\n")}
    <h2 class="text-2xl font-bold text-white mt-12 mb-6">أسئلة شائعة</h2>
    <div class="space-y-3">
${a.faqs.map((f) => `      <details class="bg-[#0a1628] border border-white/8 rounded-xl overflow-hidden">
        <summary class="p-4 font-semibold text-white cursor-pointer hover:bg-white/5 transition-colors">${f.q}</summary>
        <p class="px-4 pb-4 text-white/60 text-sm leading-relaxed">${f.a}</p>
      </details>`).join("\n")}
    </div>

    <div class="mt-12 pt-8 border-t border-white/8">
      <h3 class="text-lg font-bold text-white mb-4">مقالات ذات صلة</h3>
      <div class="grid sm:grid-cols-2 gap-3">
${a.related.map((r) => `        <a href="${r.href}" class="bg-[#0a1628] border border-white/8 rounded-xl p-4 hover:border-[#25D366]/40 transition-colors group"><p class="font-semibold text-white/80 text-sm group-hover:text-[#25D366]">${r.label} ←</p></a>`).join("\n")}
      </div>
    </div>

    <p class="text-white/40 text-xs leading-relaxed mt-10">WFixerX خدمة مستقلة غير تابعة لواتساب أو ميتا، ولا تضمن رفع الحظر؛ القرار النهائي لدى واتساب. آخر تحديث: ${a.modifiedLabel || "15 أكتوبر 2026"}.</p>

  </article>
</BaseLayout>
`;
}

let total = 0;
for (const file of process.argv.slice(2)) {
  const { ARTICLES } = await import(pathToFileURL(file).href);
  for (const a of ARTICLES) {
    a.date = a.date || "2026-10-15";
    const path = `src/pages/مدونة/${a.slug}.astro`;
    writeFileSync(path, build(a), "utf8");
    console.log("✓", path);
    total++;
  }
}
console.log("total:", total);
