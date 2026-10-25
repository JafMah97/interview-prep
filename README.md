<div dir="rtl">

# 🎯 التحضير لمقابلات Full-Stack Web Developer

خطة تحضير كاملة لمقابلات **Mid-Level**، من أساسيات الويب لحد System Design.
كل قسم فيه دروس، وكل درس فيه شرح وتمرين، وبنهاية كل قسم في أسئلة مقابلة.

> 🇸🇦 النسخة العربية: مجلد [`ar/`](./ar)
> 🇬🇧 النسخة الإنجليزية: مجلد `en/` (لاحقاً)

---

## 📚 طريقة الدراسة

لكل درس:

1. **📖 اقرأ الشرح** بملف الدرس
2. **🏋️ حل التمرين** بمجلد `exercises/`
3. **🧪 شغّل الاختبارات** لتتأكد من حلك
4. **✅ قارن حلك** مع الحل بمجلد `solutions/`، وما تفتحه قبل ما تحاول بجد!
5. **❓ جاوب أسئلة التحقق** بآخر الدرس
6. **🎤 اعمل مقابلة تجريبية** مع ChatGPT أو أي AI، بالـ prompt الموجود بمجلد `mock-interviews/`

وبنهاية كل قسم: **ملف أسئلة مقابلة** (سهل، متوسط، صعب).

> المصطلحات التقنية بتضل بالإنجليزي (closure، event loop...) لأنها هيك بتنحكى بالمقابلات.

</div>

### 🧪 Running the tests

```bash
# Run all tests
npm test

# Run one exercise
node --test ar/00-web-fundamentals/exercises/01-ip-and-ports.test.js

# Watch mode: re-runs on every save
node --test --watch ar/00-web-fundamentals/exercises/01-ip-and-ports.test.js
```

<div dir="rtl">

> بتحتاج Node.js نسخة 20 أو أحدث. ما في أي مكتبات لازم تنزّلها، الاختبارات بتستخدم `node:test` المدمج.

---

## 🗺️ خريطة الطريق

> 📋 عناوين كل الدروس بالتفصيل بملف [CURRICULUM.md](./CURRICULUM.md)

| # | القسم | الحالة |
|---|-------|--------|
| 00 | [أساسيات الويب: Web Fundamentals](./ar/00-web-fundamentals) | 🟡 قيد الدراسة |
| 01 | CS Fundamentals | ⬜ |
| 02 | Git & GitHub | ⬜ |
| 03 | HTML | ⬜ |
| 04 | CSS (+ Tailwind) | ⬜ |
| 05 | JavaScript | ⬜ |
| 06 | DOM & Browser APIs | ⬜ |
| 07 | Data Structures & Algorithms (+ LeetCode) | ⬜ |
| 08 | TypeScript | ⬜ |
| 09 | React (+ State Management) | ⬜ |
| 10 | Next.js | ⬜ |
| 11 | Node.js & Express | ⬜ |
| 12 | Databases & SQL | ⬜ |
| 13 | APIs & Authentication | ⬜ |
| 14 | Web Security | ⬜ |
| 15 | Performance & Accessibility | ⬜ |
| 16 | Testing | ⬜ |
| 17 | System Design | ⬜ |
| 18 | Behavioral Questions | ⬜ |
| 🏁 | Mock Interview شامل | ⬜ |

**دليل الحالة:** ⬜ ما بلشت · 🟡 قيد الدراسة · ✅ خلصت

> 💡 **عن DSA:** القسم 07 جاي بعد JavaScript لأن كل الحلول بـ JS. بس مسائل LeetCode Easy بتبلّش من الأسبوع الأول، كل خميس مع المراجعة. الاستمرارية أهم من الكمية.

---

## 📄 الرخصة

- **الشرح** (ملفات Markdown): رخصة [CC BY 4.0](./LICENSE-CONTENT.md). فيك تستخدمه وتعدّل عليه بشرط تذكر المصدر
- **الكود** (ملفات JavaScript): رخصة [MIT](./LICENSE)

</div>
