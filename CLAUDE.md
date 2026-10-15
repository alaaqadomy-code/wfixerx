# wfixerx.com — WFixer (استرجاع حسابات واتساب المحظورة)

> اقرأ هذا الملف أولاً في أي جلسة. آخر تحديث: 2026-10-15. الردود بالعربية دائماً.

موقع عربي يساعد أصحاب حسابات واتساب المحظورة؛ خدمة مدفوعة بلا ضمان. الجمهور: الخليج أولاً (بدون المغرب وتونس والجزائر). الهدف: المرتبة الأولى في Google والظهور في إجابات الذكاء الاصطناعي.

## الهوية
| البند | القيمة |
|---|---|
| الدومين | https://wfixerx.com |
| الريبو | https://github.com/alaaqadomy-code/wfixerx (فرع main) |
| النشر | Cloudflare Pages، المشروع **wfixerx**، عبر wrangler مباشرة من سطر الأوامر |
| IndexNow Key | `b751903050f94f32ad47312fa5150f8b` (ملف `public/b751903050f94f32ad47312fa5150f8b.txt`) |
| التقنية | Astro + TypeScript، مخرجات في `dist/` |

## طريقة النشر الصحيحة (سطر الأوامر — بلا متصفح)
```powershell
cd "C:\Users\JCC\Desktop\تحكم كلود\wfixerx"
npm run build
$env:CLOUDFLARE_API_TOKEN="<token من wrangler login أو لوحة Cloudflare>"
npx wrangler pages deploy dist --project-name wfixerx --branch=main --commit-dirty=true
```
**تنبيه**: `--branch=main` إلزامي — بدونه يذهب النشر إلى بيئة Preview ولا يُحدّث wfixerx.com.
إن ظهر `fetch failed`: `$env:CLOUDFLARE_API_TOKEN=$null` ثم أعد ضبطه وكرر.
**الفحص إلزامي بعد النشر**: `curl -s -o /dev/null -w "%{http_code}" https://wfixerx.com/` يجب أن يُعيد 200.

## حدود المشروع (لا تداخل)
حساب Cloudflare نفسه يحوي 10 مشاريع أخرى. ارفع فقط إلى `wfixerx`. لا تلمس مشروعاً آخر ولا جلسة أخرى، ولا أوامر عامة على الجهاز.

## قواعد المحتوى (لكل مقال)
1. متوافق مع SEO + AEO + GEO: كلمة مفتاحية في العنوان وH1 والوصف، إجابة مباشرة في أول فقرة، أسئلة شائعة مع FAQPage، BreadcrumbList وArticle schema، روابط داخلية، ذكر السعودية والإمارات والخليج صراحةً. لا وعود بضمان الاسترجاع.
2. جاهز للذكاء الاصطناعي: فقرات قصيرة قابلة للاقتباس، قوائم وجداول (أنواع الحظر، المدد)، حقائق محددة، تحديث تاريخ المقال، إدراج في `llms.txt` إن وُجد.
3. بعد النشر، تلقائياً دون طلب: تأكد أن المقال في sitemap، أرسل عبر IndexNow (انظر أدناه)، واطلب الفهرسة في Search Console عبر Chrome المسجّل (find للـ ref بدل الإحداثيات، انتظر 25 ثانية بين كل طلب)، ثم أبلغ المستخدم.

## IndexNow (أرشفة Bing التلقائية)
المفتاح: `b751903050f94f32ad47312fa5150f8b`
الملف موجود في: `public/b751903050f94f32ad47312fa5150f8b.txt`
للإرسال (بعد كل نشر):
```bash
curl "https://www.bing.com/indexnow?url=https://wfixerx.com/المسار/&key=b751903050f94f32ad47312fa5150f8b"
```
أو لعدة URLs في آنٍ واحد (POST):
```powershell
$body = '{"host":"wfixerx.com","key":"b751903050f94f32ad47312fa5150f8b","urlList":["https://wfixerx.com/url1/","https://wfixerx.com/url2/"]}'
Invoke-WebRequest -Uri "https://api.indexnow.org/indexnow" -Method POST -ContentType "application/json" -Body $body
```

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
