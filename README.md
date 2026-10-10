<div dir="rtl">

# 🎯 التحضير لمقابلات Full-Stack Web Developer

خطة تحضير كاملة لمقابلات **Mid-Level**، من أساسيات الويب لحد System Design.
كل قسم فيه دروس، وكل درس فيه شرح وتمرين، وبنهاية كل قسم في أسئلة مقابلة.

> 🇸🇦 النسخة العربية: مجلد [`ar/`](./ar)
> 🇬🇧 النسخة الإنجليزية: مجلد `en/` (لاحقاً)

---

## 📚 طريقة الدراسة

لكل درس:

1. **📖 اقرأ الشرح** بملف الدرس `.md`
2. **🏋️ حل التمرين** بملف `exercises/*.js`
3. **🧪 شغّل الاختبارات** لتتأكد من حلك
4. **✅ قارن حلك** مع الحل بمجلد `solutions/`، وما تفتحه قبل ما تحاول بجد!
5. **❓ جاوب أسئلة التحقق** بآخر الدرس

وبنهاية كل قسم: **ملف أسئلة مقابلة** (سهل، متوسط، صعب).

> المصطلحات التقنية بتضل بالإنجليزي (closure، event loop...) لأنها هيك بتنحكى بالمقابلات.

</div>

### 🧪 Running the tests

```bash
# كل الاختبارات
npm test

# اختبار تمرين واحد
node --test ar/00-web-fundamentals/exercises/01-ip-and-ports.test.js

# وضع المراقبة: بيعيد التشغيل كل ما تحفظ
node --test --watch ar/00-web-fundamentals/exercises/01-ip-and-ports.test.js
```

<div dir="rtl">

> بتحتاج Node.js نسخة 20 أو أحدث. ما في أي مكتبات لازم تنزّلها، الاختبارات بتستخدم `node:test` المدمج.

---

## 🗺️ خريطة الطريق

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

> 💡 **عن DSA:** القسم 07 جاي بعد JavaScript لأن كل الحلول بـ JS. بس من أول ما تخلص قسم JS، حل مسألة LeetCode وحدة يومياً بالتوازي مع باقي الأقسام. الاستمرارية أهم من الكمية.

</div>
