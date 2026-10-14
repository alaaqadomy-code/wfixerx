# wfixerx.com — WFixer (استرجاع حسابات واتساب المحظورة)

> اقرأ هذا الملف أولاً في أي جلسة. آخر تحديث: 2026-10-14. الردود بالعربية دائماً.

موقع عربي يساعد أصحاب حسابات واتساب المحظورة؛ خدمة مدفوعة بلا ضمان. الجمهور: الخليج أولاً (بدون المغرب وتونس والجزائر). الهدف: المرتبة الأولى في Google والظهور في إجابات الذكاء الاصطناعي.

## الهوية
| البند | القيمة |
|---|---|
| الدومين | https://wfixerx.com |
| الريبو | https://github.com/alaaqadomy-code/wfixerx (فرع main) |
| النشر | Cloudflare Pages، المشروع **wfixerx**، رفع ZIP يدوي من اللوحة. **لا يوجد ربط GitHub** (تم التحقق من اللوحة 2026-10-14) |
| التقنية | Astro + TypeScript، مخرجات في `dist/` |

## طريقة النشر الصحيحة
1. `npm run build`.
2. ZIP بـ Node.js بمسارات بشَرطة أمامية وعلم UTF-8 (**ممنوع** PowerShell `Compress-Archive`؛ يكسر كل المسارات الفرعية على Cloudflare). تحقق من المحتوى قبل الرفع.
3. ارفع من لوحة Cloudflare (`/pages/view/wfixerx/deployments/new`) عبر Chrome المسجّل. إن فشل wrangler بـ `fetch failed` فهذا معروف؛ استخدم اللوحة.
4. **الفحص إلزامي**: الرئيسية وصفحة داخلية ومقال وملف CSS تعطي 200.

## حدود المشروع (لا تداخل)
حساب Cloudflare نفسه يحوي 10 مشاريع أخرى. ارفع فقط إلى `wfixerx`. لا تلمس مشروعاً آخر ولا جلسة أخرى، ولا أوامر عامة على الجهاز.

## قواعد المحتوى (لكل مقال)
1. متوافق مع SEO + AEO + GEO: كلمة مفتاحية في العنوان وH1 والوصف، إجابة مباشرة في أول فقرة، أسئلة شائعة مع FAQPage، BreadcrumbList وArticle schema، روابط داخلية، ذكر السعودية والإمارات والخليج صراحةً. لا وعود بضمان الاسترجاع.
2. جاهز للذكاء الاصطناعي: فقرات قصيرة قابلة للاقتباس، قوائم وجداول (أنواع الحظر، المدد)، حقائق محددة، تحديث تاريخ المقال، إدراج في `llms.txt` إن وُجد.
3. بعد النشر، تلقائياً دون طلب: تأكد أن المقال في sitemap، أرسل عبر IndexNow، واطلب الفهرسة في Search Console عبر Chrome المسجّل، ثم أبلغ المستخدم.

## ختام كل مهمة
تقرير قصير: ما تم، ما فُحص، ما تبقى. لا تعلن النجاح قبل الفحص الحي.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## المهارات (استخدمها بدل العمل اليدوي)
- بداية الجلسة: `site-status` · بعد أي نشر أو شكوى: `site-check` · النشر: `site-deploy` · مقال جديد: `site-article` ثم `site-deploy` ثم `site-index` · الختام: `site-report`. الإعداد في `.claude/site.json`؛ لا تعدّله لتجاوز الحماية.
