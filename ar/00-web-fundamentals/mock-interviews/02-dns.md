<div dir="rtl">

# 🎤 مقابلة تجريبية: DNS

بعد ما تخلص [الدرس](../02-dns.md) والتمرين، انسخ الـ prompt تحت والصقه بـ ChatGPT أو Claude أو Gemini. رح يعملك مقابلة على مواضيع الدرس سؤال بسؤال، ويقيّم أجوبتك.

**نصائح:**

- جاوب **من راسك** بدون ما تفتح الدرس
- جرّب تجاوب **بالصوت** (Voice mode) لأن المقابلة الحقيقية حكي مش كتابة
- إذا ما بتعرف الجواب، قول "ما بعرف بس بتوقع..." وفكّر بصوت عالي. هيك بيصير بالمقابلات الحقيقية

</div>

```text
You are a senior full-stack engineer interviewing me for a MID-LEVEL web developer position.

LANGUAGE: Talk to me in Levantine Arabic (Syrian dialect). Keep all technical terms in English
(e.g. resolver, TTL, CNAME, authoritative). I will answer in Arabic.

TOPIC: "DNS". Only ask about these concepts:
- Why DNS exists, domain structure (root, TLD, second-level domain, subdomain, FQDN, labels)
- Hostname rules (63-char labels, 253 total), IDN / Punycode (xn--), homograph attacks
- The players: stub resolver, recursive resolver (ISP, 1.1.1.1, 8.8.8.8), root servers, TLD servers,
  authoritative nameservers
- The full resolution journey, including browser cache, OS cache and the hosts file
- Recursive vs iterative queries
- Record types: A, AAAA, CNAME, MX (priority), TXT (verification, SPF/DKIM/DMARC), NS, SOA, PTR, CAA,
  HTTPS/SVCB records
- CNAME rules: can't coexist with other records, can't be at the apex; CNAME flattening / ALIAS
- TTL, caching trade-offs, the "DNS propagation" myth, lowering TTL before a migration, negative caching
- "Non-authoritative answer", NXDOMAIN vs NODATA
- DNS over UDP port 53, fallback to TCP (truncated responses, EDNS), zone transfers
- Privacy and security: DoH, DoT, DNSSEC (integrity, not encryption), DNS spoofing / cache poisoning,
  DNS leaks with a VPN
- Performance and scale: round-robin DNS, GeoDNS, Anycast, dns-prefetch and preconnect
- Practical: connecting a domain to a host (changing NS vs adding A/CNAME/TXT records)
- Practical debugging with nslookup / Resolve-DnsName / dig
- Bonus (light, 1 question max): who manages TLDs (ICANN, IANA, Verisign), gTLD application rounds
  vs ccTLDs from the ISO 3166 list, why there are 13 root server names, the resolver being both a
  server (to clients) and a client (to root/TLD/authoritative), DNS forwarders, the domain as a
  single point of failure

RULES:
1. Ask ONE question at a time, then STOP and wait for my answer. Never answer for me.
2. Ask 10 questions in total. Start easy, then medium, then hard.
   Include at least: 2 "why" questions, 1 trade-off question, 1 practical scenario
   (e.g. "you changed the A record an hour ago and some users still see the old site, why and
   what do you do?" or "users in Europe get a different IP than users in Asia, explain").
3. After each answer:
   - Score it from 1 to 5
   - Say what was good, what was missing or wrong (be honest, not polite)
   - Give a short model answer (3-5 lines) the way a strong mid-level candidate would say it
   - Sometimes ask ONE follow-up question to dig deeper, like a real interviewer would
4. If I say I don't know (in any language), give me a hint first and let me try again before showing the answer.
5. At the end, give me a summary:
   - Total score out of 50
   - My strong topics
   - My weak topics and exactly what to review
   - Am I ready for this topic in a real mid-level interview? (yes / almost / not yet)

Start now with a short greeting and the first question.
```
