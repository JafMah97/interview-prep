<div dir="rtl">

# 02: نظام DNS

## 🎯 أهداف الدرس

بنهاية الدرس رح تقدر:

- تشرح ليش منحتاج DNS وكيف الدومين مبني (Root, TLD, Domain, Subdomain)
- تحكي **رحلة الـ DNS Resolution** خطوة بخطوة، من المتصفح لحد الـ Authoritative Server
- تعرف أهم أنواع السجلات: A, AAAA, CNAME, MX, TXT, NS, SOA, PTR
- تفهم **TTL** والـ Caching، وليش "DNS Propagation" مش متل ما الناس بتفكر
- تعرف كيف DNS بيُستخدم للأداء (GeoDNS, Anycast) وللأمان (DoH, DNSSEC)
- تربط دومين بموقعك على الاستضافة

---

## 1. ليش منحتاج DNS؟

بالدرس الماضي عرفنا إن الأجهزة بتحكي مع بعض بـ **IP addresses**. بس ما حدا بيحفظ `142.250.185.78`، الناس بتحفظ `google.com`.

**DNS (Domain Name System)** هو النظام اللي بيحوّل **الاسم** لـ **IP**.

> 📦 **تشبيه:** DNS متل **دفتر جهات الاتصال** بموبايلك. إنت بتدوّر على "أحمد"، والموبايل بيعرف الرقم. وإذا أحمد غيّر رقمه، بتعدّل الرقم بس واسمه بيضل نفسه.

وهي الفايدة الكبيرة التانية: **الـ IP ممكن يتغيّر بدون ما المستخدم يحس.** Google ممكن تنقل موقعها لسيرفرات جديدة، وإنت بتضل تكتب `google.com`.

---

## 2. هيكل الدومين

الدومين بيتقرا **من اليمين لليسار**، من الأعم للأخص:

</div>

```
          www  .  example  .  com  .
          ───     ───────     ───  ─
           │         │         │   └── Root (usually hidden)
           │         │         └────── TLD (Top-Level Domain)
           │         └──────────────── Second-Level Domain (the name you buy)
           └────────────────────────── Subdomain
```

<div dir="rtl">

- **Root:** النقطة بالآخر. موجودة دايماً بس ما منكتبها. الاسم الكامل مع النقطة اسمه **FQDN** (Fully Qualified Domain Name)
- **TLD:** متل `.com` و `.org` و `.dev`، أو دول متل `.sy` و `.de`
- **الدومين نفسه:** متل `example`، وهو اللي بتشتريه من **Registrar** متل Namecheap أو Cloudflare
- **Subdomain:** متل `www` أو `api` أو `blog`. إنت بتعملهن ببلاش وبالعدد اللي بدك ياه

> 💡 كل جزء بين نقطتين اسمه **label**. والـ label أقصى طوله **63** حرف، والاسم كله أقصى طوله **253** حرف. رح تحتاج هالأرقام بالتمرين!

### الدومينات العربية؟ 🤔

DNS بيقبل بس حروف إنجليزية وأرقام و `-`. فكيف في دومينات عربية؟

عن طريق **Punycode**: الدومين العربي بيتحوّل لنص إنجليزي بيبلّش بـ `xn--`:

</div>

```
مثال.إختبار   →   xn--mgbh0fb.xn--kgbechtv
```

<div dir="rtl">

المتصفح بيعرضلك العربي، بس تحت الطاولة بيبعت الـ `xn--`.

> 🔥 **mid-level (أمان):** هالشي بيفتح باب لهجوم اسمه **Homograph Attack**: حدا بيسجّل دومين بحرف من لغة تانية بيشبه الحرف الإنجليزي، متل `а` الروسية بدل `a`. الدومين بيطلع بالعين `apple.com` بس هو موقع تاني! لهيك المتصفحات أحياناً بتعرض الـ `xn--` بدل الاسم إذا شكّت فيه.

---

## 3. اللاعبين بقصة DNS

قبل ما نحكي الرحلة، خلينا نتعرف على الشخصيات:

### 🖥️ الـ Stub Resolver (جهازك)
جزء صغير من نظام التشغيل. ما بيعرف يحل الأسماء لحاله، كل اللي بيعمله إنه **بيسأل** الـ Recursive Resolver.

### 🔁 الـ Recursive Resolver
هو "الشغّيل" اللي بيعمل كل التعب: بيلف على السيرفرات لحد ما يلاقي الجواب، وبيخزّنه عنده. أمثلة:
- سيرفر الـ **ISP** تبعك (الافتراضي)
- **Cloudflare** على `1.1.1.1`
- **Google** على `8.8.8.8`
- أو سيرفر الـ **VPN**، متل `10.2.0.1` اللي طلعلك بـ `nslookup`!

### 🌳 الـ Root Servers
رأس الشجرة. في **13 اسم** من `a.root-servers.net` لـ `m.root-servers.net`، بس وراهن **أكتر من 1500 سيرفر** حول العالم بفضل **Anycast** (رح نشرحه بعد شوي). الـ Root ما بيعرف IP أي موقع، بس بيعرف **مين مسؤول عن كل TLD**.

### 🏷️ الـ TLD Servers
مسؤولين عن TLD معيّن. سيرفرات `.com` مثلاً ما بتعرف IP تبع `google.com`، بس بتعرف **مين الـ Authoritative Server** تبعه.

### 📜 الـ Authoritative Server
هو **المصدر الرسمي** للدومين، وهو اللي عنده السجلات الحقيقية. لما تشتري دومين وتحط سجلاته بـ Cloudflare مثلاً، بيصير Cloudflare هو الـ Authoritative تبعك.

---

## 4. رحلة الـ DNS Resolution 🗺️

لما تكتب `www.example.com`، هيك بتمشي القصة:

### أول شي: الكاش (بالترتيب)

قبل ما يطلع أي طلب على الشبكة، كل طبقة بتشيك إذا الجواب عندها:

1. **كاش المتصفح:** Chrome عنده كاش DNS خاص فيه
2. **كاش نظام التشغيل:** Windows بيخزّن كمان. وبيشيك ملف **hosts** (رح نجرّبه بالتمرين)
3. **الراوتر:** بعض الراوترات بتخزّن
4. **الـ Recursive Resolver:** إذا حدا تاني من زبائن نفس الـ ISP سأل عن نفس الدومين من شوي، الجواب جاهز

**بالواقع، أغلب الطلبات بتنحل من الكاش** وما بتوصل للـ Root أبداً.

### إذا ما لقى بالكاش: الرحلة الكاملة

</div>

```
 Browser/OS                Recursive Resolver
     │                            │
     │ 1. www.example.com? ─────> │
     │                            │ 2. www.example.com? ─────> [Root Server]
     │                            │ <──── "Ask .com servers" ──
     │                            │
     │                            │ 3. www.example.com? ─────> [.com TLD Server]
     │                            │ <──── "Ask ns1.example.com" ─
     │                            │
     │                            │ 4. www.example.com? ─────> [Authoritative: ns1.example.com]
     │                            │ <──── "203.0.113.10" ─────
     │                            │
     │ <──── 5. "203.0.113.10" ── │   (and caches it for TTL seconds)
```

<div dir="rtl">

### Recursive و Iterative

لاحظ إنه في نوعين أسئلة بالرسمة:

- **جهازك ← الـ Resolver:** سؤال **Recursive**. يعني "جيبلي الجواب النهائي، ما بدي أعرف كيف"
- **الـ Resolver ← Root و TLD و Authoritative:** أسئلة **Iterative**. كل سيرفر بيقول "أنا ما بعرف، بس روح اسأل فلان"، والـ Resolver بيكمّل لحاله

> 📦 **تشبيه:** إنت بتسأل موظف الاستقبال (Recursive) عن مكتب أحمد. الموظف بيروح يسأل: البناية ← الطابق ← القسم ← المكتب (Iterative)، وبيرجعلك بالجواب النهائي.

---

## 5. أنواع السجلات (Record Types)

كل دومين إله **سجلات** (Records)، وكل سجل إله نوع:

</div>

```
Type    Purpose                                   Example value
──────  ────────────────────────────────────────  ──────────────────────────────
A       Name → IPv4 address                       203.0.113.10
AAAA    Name → IPv6 address                       2001:db8::10
CNAME   Name → another name (alias)               www.github.com → github.com
MX      Mail server for the domain (+ priority)   10 mail.example.com
TXT     Free text: verification, SPF, DKIM        "v=spf1 include:_spf.google.com ~all"
NS      Which servers are authoritative           ns1.google.com
SOA     Zone info: primary server, serial, TTLs   ns1.google.com ...
PTR     IP → name (reverse lookup)                8.8.8.8 → dns.google
CAA     Which CAs may issue SSL certificates      0 issue "letsencrypt.org"
HTTPS   Connection hints: HTTP/3 support, ALPN    alpn="h3,h2"
```

<div dir="rtl">

### شرح أهمهم

**سجلات A و AAAA:** الأساس. لاحظ إن دومين واحد ممكن يكون إله **أكتر من A record**، وهيك بيتوزّع الحمل بين كذا سيرفر.

**سجل CNAME:** "روح اسأل عن هاد الاسم بداله". مثلاً `www.github.com` هو CNAME لـ `github.com`. مفيد لما بدك أكتر من اسم يأشّروا على نفس المكان، وبتغيّر الـ IP بمكان واحد بس.

> ⚠️ **قاعدتين مهمين للـ CNAME:**
> 1. **ما بينفع يكون CNAME مع أي سجل تاني على نفس الاسم.** يعني إذا `www` هو CNAME، ما فيك تحطله كمان MX أو TXT
> 2. **ما بينفع تحط CNAME على الدومين الأساسي** (اسمه **apex** أو root domain، متل `example.com` بدون `www`)، لأن الـ apex لازم يكون عليه سجلات NS و SOA. لهيك في شركات متل Cloudflare عاملين حل اسمه **CNAME Flattening** أو **ALIAS record**

**سجل MX:** وين لازم ينبعت الإيميل. الرقم هو **الأولوية**، والرقم **الأصغر هو الأول**. لما شغّلت `Resolve-DnsName gmail.com -Type MX`، طلع إن Gmail عنده 5 سيرفرات، والأساسي إله أولوية **5**.

**سجل TXT:** نص حر، بس استخدامه الأشهر:
- **إثبات ملكية الدومين:** Google أو GitHub بيقلولك "حط هالنص بـ TXT لنتأكد إن الدومين إلك"
- **حماية الإيميل:** SPF و DKIM و DMARC، بيمنعوا حدا يبعت إيميلات مزوّرة باسم دومينك

**سجل PTR:** العكس، من **IP لاسم**. بيُستخدم للـ Reverse DNS.

> 🤓 **تذكر `Server: UnKnown` اللي طلعتلك بـ `nslookup` مبارح؟** الـ `nslookup` بيحاول يعرف اسم سيرفر الـ DNS عن طريق PTR. وعنوان `10.2.0.1` تبع الـ VPN **ما إله سجل PTR**، فطلع `UnKnown`. جرّبنا وتأكدنا: `DNS name does not exist` 😄

**سجل HTTPS:** سجل جديد بيقلّك قبل ما تتصل إذا السيرفر بيدعم HTTP/3. هاد هو `HTTPSRR` اللي شفته بـ `curl --version`! بيوفّر على المتصفح إنه يستنى الـ `alt-svc` header.

---

## 6. TTL والـ Caching

كل سجل إله **TTL (Time To Live)**: عدد الثواني اللي مسموح فيها لأي حدا يخزّن الجواب.

لما جربنا `Resolve-DnsName example.com`، طلع `TTL 286`. يعني الجواب صالح كمان 286 ثانية، وبعدها لازم يسأل من جديد.

### الموازنة (Trade-off)

- **TTL طويل** (ساعات أو يوم):
  - ✅ طلبات أقل، وتصفّح أسرع
  - ❌ إذا غيّرت الـ IP، الناس رح يضلوا يروحوا على القديم لحد ما يخلص الـ TTL
- **TTL قصير** (دقائق):
  - ✅ التغييرات بتوصل بسرعة
  - ❌ طلبات DNS أكتر وتأخير أكتر

### خرافة "DNS Propagation" 👻

بتسمع الناس بتقول "استنى 48 ساعة لينتشر الـ DNS". بالحقيقة **ما في شي عم ينتشر**. التغيير بيصير **فوراً** على الـ Authoritative Server. بس الـ Resolvers حول العالم عندهم **النسخة القديمة بالكاش**، وعم يستنوا الـ TTL تبعها يخلص.

> 🔥 **mid-level:** إذا بدك تنقل موقعك لسيرفر جديد، **قصّر الـ TTL قبلها بيوم** (مثلاً لـ 300 ثانية)، واستنى الـ TTL القديم يخلص، وبعدين غيّر الـ IP. هيك التغيير بيوصل للكل خلال 5 دقائق. وبعد ما يستقر كل شي رجّع الـ TTL طويل.

### Negative Caching

حتى جواب **"الدومين مش موجود"** بيتخزّن. فإذا عملت سجل جديد بعد ما حدا سأل عنه وما لقاه، ممكن ياخد وقت ليبيّن. مدة هالكاش بتنحدد من سجل **SOA**.

---

## 7. NXDOMAIN و "Non-authoritative answer"

### شو يعني Non-authoritative؟

لما شغّلت `nslookup google.com` طلعلك `Non-authoritative answer`. يعني الجواب جاي من **Resolver** (من الكاش تبعه أو لأنه سأل غيره)، **مش** من الـ Authoritative Server تبع Google مباشرة. وهاد الطبيعي بـ 99% من الحالات.

### NXDOMAIN و NODATA

في نوعين "ما في جواب"، والفرق بيناتهن بينسأل:

- **NXDOMAIN:** الاسم **مش موجود أبداً**. متل لما جربنا `this-does-not-exist-xyz123.com` وطلع `DNS name does not exist`
- **NODATA:** الاسم **موجود**، بس ما إله سجل من **النوع اللي سألت عنه**. مثلاً سألت عن AAAA ودومينك ما عنده IPv6

رح تطبّق هالفرق بالتمرين.

---

## 8. DNS على الشبكة: UDP و TCP و DoH

### UDP على Port 53

DNS بيستخدم **UDP** بشكل أساسي: الطلب صغير ومنبدها سريعة، وما في داعي لـ handshake (تذكر الدرس الماضي!).

**إمتى بيستخدم TCP؟**
- إذا الرد **كبير** وما زبط بـ UDP: السيرفر بيرجّع رد مقطوع وفيه علامة **TC (Truncated)**، والكلاينت بيعيد الطلب بـ TCP
- بنقل الـ Zone كاملة بين السيرفرات (**Zone Transfer**)

> 💡 قديماً كان حد UDP هو 512 bytes. اليوم في إضافة اسمها **EDNS** بتسمح بردود أكبر، والقيمة المنصوح فيها حوالي 1232 bytes.

### المشكلة: DNS العادي مش مشفّر! 🔓

أي حدا على الشبكة (الـ ISP، صاحب الواي فاي بالكافيه...) بيقدر:
- **يشوف** كل المواقع اللي عم تزورها
- **يغيّر** الجواب ويبعتك على موقع مزوّر

### الحلول

- **DoH (DNS over HTTPS):** بيبعت طلبات DNS **جوا HTTPS** على port 443. ما حدا بيقدر يميّزها عن الترافيك العادي. Chrome و Firefox و Windows 11 بيدعموه
- **DoT (DNS over TLS):** نفس الفكرة بس على port 853 المخصص
- **DNSSEC:** شي مختلف! ما بيشفّر، بس بيضيف **توقيع رقمي** للسجلات، فبتتأكد إن الجواب **ما حدا غيّره**. يعني بيحمي **الصحة** (Integrity) مش **الخصوصية** (Privacy)

> 🔥 **mid-level:** سؤال فخ: "هل DNSSEC بيشفّر طلبات DNS؟" الجواب **لا**. DNSSEC للتأكد من صحة الجواب، و DoH/DoT للتشفير. ومنستخدمهم مع بعض.

### DNS Leak مع الـ VPN

إذا الـ VPN شغال بس طلبات الـ DNS عم تروح للـ ISP مش للـ VPN، الـ ISP بيضل يعرف كل المواقع اللي بتزورها. هاد اسمه **DNS Leak**. الـ VPN تبعك عامل الصح: الـ DNS رايح على `10.2.0.1` جوا النفق.

---

## 9. DNS للأداء والتوزيع

### ليش `google.com` بيعطي IPs مختلفة؟

تذكر إنه طلعلك `192.178.202.139` مرة و `142.251.211.206` مرة؟ وبالتجربة على `1.1.1.1` طلع **6 عناوين** مرة وحدة! السبب:

- **Round-Robin DNS:** أكتر من A record للاسم، والـ Resolvers بيبدّلوا بالترتيب، فالحمل بيتوزّع
- **GeoDNS:** الـ Authoritative Server بيشوف **من وين جاي الطلب** وبيعطيك IP **أقرب سيرفر إلك**. لهيك مع الـ VPN طلعلك IP مختلف، لأن Google شافتك بمكان سيرفر الـ VPN

### Anycast

فكرة ذكية: **نفس الـ IP** بينعطى لسيرفرات كتير بأماكن مختلفة، والـ routers بتوصّلك **للأقرب**. هيك `1.1.1.1` هو IP واحد، بس فعلياً في مئات السيرفرات وراه حول العالم، ونفس الشي للـ Root Servers.

- **GeoDNS:** أسماء متشابهة، و **IPs مختلفة** حسب مكانك
- **Anycast:** **نفس الـ IP**، والشبكة بتختار السيرفر الأقرب

### تسريع DNS من الـ Frontend

بتقدر تقول للمتصفح يحل DNS **قبل ما يحتاجه**:

</div>

```html
<!-- Resolve DNS early for a domain you'll need soon -->
<link rel="dns-prefetch" href="https://api.example.com">

<!-- Even better: DNS + TCP handshake + TLS, all in advance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
```

<div dir="rtl">

رح نرجع لهدول بقسم الـ Performance.

---

## 10. عملياً: ربط دومين بموقعك 🛠️

هاد شي رح تعمله بالشغل أكيد. لما تشتري دومين وبدك تربطه بـ Vercel أو Netlify أو سيرفرك:

**الطريقة الأولى: تغيير الـ Nameservers**
- بتروح على الـ Registrar وبتغيّر سجلات **NS** لسيرفرات الاستضافة (متل Cloudflare)
- هيك الاستضافة بتصير **Authoritative** وبتدير كل السجلات عنها

**الطريقة التانية: إضافة سجلات بس**
- **للدومين الأساسي** `example.com`: سجل **A** على IP الاستضافة (لأنه ما بينفع CNAME على الـ apex!)
- **للـ www:** سجل **CNAME** على الاسم اللي بتعطيك ياه الاستضافة
- **لإثبات الملكية:** سجل **TXT** إذا طلبوه

> 💡 القيم الدقيقة بتعطيك ياها الاستضافة بصفحة الإعدادات، لا تنسخ قيم من مقالات قديمة لأنها بتتغيّر.

### ملف hosts

قبل كل شي، نظام التشغيل بيشيك ملف اسمه **hosts**. أي سطر فيه بيتجاوز DNS بالكامل:

</div>

```
# C:\Windows\System32\drivers\etc\hosts
127.0.0.1    myapp.test
```

<div dir="rtl">

بعد هالسطر، `myapp.test` بيروح على جهازك. مفيد بالتطوير، بس كمان بعض الـ malware بتستخدمه لتحوّلك على مواقع مزوّرة.

---

## 📌 الملخص

- **DNS:** بيحوّل الأسماء لـ IPs، فيك تغيّر الـ IP بدون ما المستخدم يحس
- **هيكل الدومين:** Root ← TLD ← Domain ← Subdomain، وبيتقرا من اليمين
- **الحدود:** label أقصاه 63 حرف، والاسم كله 253
- **Punycode:** الدومينات العربية بتتحوّل لـ `xn--`، وانتبه من Homograph Attacks
- **الرحلة:** كاش المتصفح ← كاش النظام و hosts ← Resolver ← Root ← TLD ← Authoritative
- **Recursive:** "جيبلي الجواب النهائي" (جهازك ← Resolver)
- **Iterative:** "روح اسأل فلان" (Resolver ← باقي السيرفرات)
- **السجلات:** A للـ IPv4، AAAA للـ IPv6، CNAME للأسماء البديلة، MX للإيميل، TXT للتحقق، NS للسيرفرات المسؤولة، PTR للعكس
- **CNAME:** ما بيتجمّع مع سجلات تانية، وما بينحط على الـ apex
- **TTL:** مدة الكاش. قصّره قبل أي نقل للسيرفرات
- **Propagation:** ما في انتشار، في كاش عم يخلص
- **NXDOMAIN:** الاسم مش موجود. **NODATA:** الاسم موجود بس ما في سجل من هالنوع
- **النقل:** UDP على 53، و TCP للردود الكبيرة
- **الأمان:** DoH و DoT للتشفير، و DNSSEC للتأكد من الصحة
- **التوزيع:** Round-Robin و GeoDNS و Anycast

---

## 🏋️ التمرين

### الجزء الأول: جرّب بإيدك (PowerShell)

بالـ PowerShell في أمر أحسن من `nslookup` اسمه `Resolve-DnsName`. جرّب هالأوامر:

</div>

```powershell
# 1. A records: notice the TTL, run it again after a few seconds and watch it drop
Resolve-DnsName example.com -Type A

# 2. CNAME: www.github.com is an alias
Resolve-DnsName www.github.com -Type CNAME

# 3. MX: Gmail's mail servers, notice the priorities
Resolve-DnsName gmail.com -Type MX

# 4. NS: who is authoritative for google.com?
Resolve-DnsName google.com -Type NS -DnsOnly

# 5. TXT: domain verifications
Resolve-DnsName google.com -Type TXT -DnsOnly

# 6. PTR: reverse lookup
Resolve-DnsName 8.8.8.8 -Type PTR

# 7. Ask a specific resolver (Cloudflare) instead of your default one
Resolve-DnsName google.com -Server 1.1.1.1 -DnsOnly

# 8. NXDOMAIN
Resolve-DnsName this-does-not-exist-xyz123.com -DnsOnly

# 9. Your OS DNS cache
ipconfig /displaydns

# 10. Look at your hosts file
Get-Content C:\Windows\System32\drivers\etc\hosts
```

<div dir="rtl">

**أسئلة للتفكير:**

- بالأمر 1، شغّله مرتين ورا بعض. ليش الـ TTL **نقص**؟
- بالأمر 3، أي سيرفر إيميل رح يُستخدم أول؟ وليش؟
- بالأمر 7، قارن عدد الـ IPs مع نفس الأمر **بدون** `-Server 1.1.1.1`. ليش في فرق؟
- بالأمر 9، شو لاحظت؟ مين الدومينات اللي جهازك سأل عنها بدون ما تعرف؟

### الجزء التاني: كود 💻

افتح الملف [`exercises/02-dns.js`](./exercises/02-dns.js). فيه 3 مهام:

1. **`isValidHostname(name)`**: بتتأكد إن اسم الدومين صحيح حسب قواعد DNS
2. **`resolve(name, zone)`**: بتحل اسم لـ IPs عن طريق **تتبّع سلسلة الـ CNAME**، وبتفرّق بين NXDOMAIN و NODATA، وبتكتشف الـ **loops**
3. **`DnsCache`**: كلاس كاش بيحترم الـ **TTL**

التفاصيل والأمثلة موجودة بالملف. شغّل الاختبارات:

</div>

```bash
node --test ar/00-web-fundamentals/exercises/02-dns.test.js
```

<div dir="rtl">

> 💡 **نصيحة:** حل المهام **بالترتيب** وشغّل الاختبارات بعد كل وحدة. الاختبارات مقسّمة لـ 3 مجموعات، وكل مجموعة لمهمة.

> 🧠 **المهمة التانية فيها فكرة من DSA:** اكتشاف الـ **cycle**. هي نفس فكرة مسائل LeetCode متل [141. Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/).

بس تخلص، قارن مع الحل: [`solutions/02-dns.js`](./solutions/02-dns.js)

---

## ❓ أسئلة تحقق

<details>
<summary><b>1. شو بيصير لما تكتب <code>www.example.com</code> لحد ما يرجع الـ IP؟</b></summary>

<br>

1. المتصفح بيشيك الكاش تبعه، وبعدين نظام التشغيل (مع ملف hosts)
2. إذا ما لقى، بيبعت سؤال **recursive** للـ Recursive Resolver (تبع الـ ISP أو `1.1.1.1` مثلاً)
3. الـ Resolver بيشيك الكاش تبعه. إذا ما لقى بيسأل **Root Server**، اللي بيدلّه على سيرفرات `.com`
4. سيرفر `.com` بيدلّه على الـ **Authoritative Server** تبع `example.com`
5. الـ Authoritative بيعطيه الجواب (A record)
6. الـ Resolver بيخزّن الجواب حسب الـ **TTL** وبيرجّعه للجهاز

</details>

<details>
<summary><b>2. شو الفرق بين A و CNAME؟ وليش ما بينفع CNAME على الـ apex؟</b></summary>

<br>

- **A:** بيربط الاسم **بـ IP** مباشرة
- **CNAME:** بيربط الاسم **باسم تاني**، والـ resolver بيكمّل يحل الاسم التاني

الـ CNAME ما بيقبل يكون معه أي سجل تاني على نفس الاسم. والـ apex (متل `example.com`) لازم يكون عليه سجلات **NS** و **SOA**، فما بينفع يكون CNAME. الحل: A record عادي، أو ميزات متل **CNAME Flattening / ALIAS** عند بعض مزودي الـ DNS.

</details>

<details>
<summary><b>3. غيّرت الـ IP بسجل A وبعض الناس لسا عم يشوفوا الموقع القديم. ليش؟ وكيف بتتجنب هالشي المرة الجاية؟</b></summary>

<br>

لأن الـ Resolvers والمتصفحات عندهم **الجواب القديم بالكاش**، وما رح يسألوا من جديد لحد ما يخلص الـ **TTL**. يعني ما في شي "عم ينتشر".

للمرة الجاية: **قصّر الـ TTL** (لـ 300 ثانية مثلاً) **قبل** التغيير بفترة أطول من الـ TTL القديم. بعدها غيّر الـ IP، فالتغيير بيوصل للكل بدقائق. وبعد ما يستقر كل شي رجّع الـ TTL طويل.

</details>

<details>
<summary><b>4. ليش DNS بيستخدم UDP؟ وإمتى بيستخدم TCP؟</b></summary>

<br>

**UDP** لأن الطلب والرد صغار وبدنا سرعة. TCP بيحتاج handshake قبل أي بيانات، يعني round trip زيادة على كل طلب.

**TCP** بيُستخدم لما الرد يكون كبير وما يزبط بـ UDP: السيرفر بيرجّع رد مقطوع مع علامة **TC**، والكلاينت بيعيد بـ TCP. وكمان بالـ **Zone Transfer** بين السيرفرات.

</details>

<details>
<summary><b>5. شو الفرق بين DoH و DNSSEC؟</b></summary>

<br>

- **DoH:** بيشفّر طلبات DNS جوا HTTPS. بيحمي **الخصوصية**، يعني ما حدا بيشوف شو عم تسأل
- **DNSSEC:** بيضيف **توقيع رقمي** للسجلات. بيحمي **الصحة**، يعني بتتأكد إن الجواب جاي من صاحب الدومين وما حدا غيّره. بس **ما بيشفّر** شي

بيحلّوا مشكلتين مختلفين وبيشتغلوا مع بعض.

</details>

<details>
<summary><b>6. ليش <code>google.com</code> بيعطي IPs مختلفة لناس مختلفين؟</b></summary>

<br>

- **GeoDNS:** الـ Authoritative Server تبع Google بيشوف من وين جاي الطلب، وبيرد بـ IP **أقرب سيرفر**
- **Round-Robin:** في أكتر من A record، وترتيبهن بيتبدّل، فالحمل بيتوزّع
- **الكاش:** كل Resolver عنده نسخة مختلفة حسب إمتى سأل

كمان Google بيستخدم **Anycast** على بعض العناوين: نفس الـ IP بيوصلك للسيرفر الأقرب.

</details>

<details>
<summary><b>7. شو الفرق بين NXDOMAIN و NODATA؟</b></summary>

<br>

- **NXDOMAIN:** الاسم **مش موجود أبداً** بالـ DNS
- **NODATA:** الاسم **موجود**، بس ما إله سجل من **النوع اللي سألت عنه**. مثلاً سألت عن AAAA ودومينك ما عنده IPv6

الفرق مهم لأن الكلاينت بيتصرّف بشكل مختلف: بـ NODATA ممكن يجرّب نوع تاني (متل A بدل AAAA)، أما بـ NXDOMAIN فالاسم كله غلط.

</details>

<details>
<summary><b>8. ليش لما شغّلت <code>nslookup</code> طلع <code>Server: UnKnown</code>؟</b></summary>

<br>

`nslookup` بيعمل **reverse lookup (PTR)** على IP سيرفر الـ DNS ليعرض اسمه. عنوان `10.2.0.1` (سيرفر DNS تبع الـ VPN) ما إله سجل PTR، فطلع `UnKnown`. ما في أي مشكلة بالـ DNS نفسه.

</details>

---

## 🎤 مقابلة تجريبية

بعد ما تخلص كل شي، جرّب [المقابلة التجريبية](./mock-interviews/02-dns.md) مع ChatGPT أو أي AI تاني.

---

## 📚 مصادر إضافية (اختياري)

- [Cloudflare: What is DNS?](https://www.cloudflare.com/learning/dns/what-is-dns/): شرح ممتاز مع رسومات
- [How DNS Works (كوميك)](https://howdns.works/): قصة مصوّرة ممتعة لكل الرحلة

---

<p align="center">

[⬅️ الدرس السابق](./01-how-the-internet-works.md) · [🏠 الفهرس](./README.md) · **الدرس التالي:** HTTP & HTTPS ➡️

</p>

</div>
