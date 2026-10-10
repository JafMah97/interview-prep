/**
 * ✅ حل تمرين 01: IP Addresses & Ports
 *
 * إذا وصلت لهون قبل ما تحاول، ارجع حاول أول 😄
 */

// ------------------------------------------------------------
// 1) isValidIPv4
// ------------------------------------------------------------
// الفكرة: قسّم على "." وتأكد من كل جزء.
//
// ⚠️ الفخ الكبير: Number() متساهل كتير!
//    Number("1e2")  → 100
//    Number("0x1")  → 1
//    Number(" 1")   → 1
//    Number("")     → 0
// لهيك بنتأكد أول إنه الجزء **أرقام بس** بـ regex: /^\d+$/
export function isValidIPv4(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    if (!/^\d{1,3}$/.test(part)) return false;        // أرقام بس، 1-3 خانات (بيمنع الفاضي كمان)
    if (part.length > 1 && part[0] === '0') return false; // leading zero
    return Number(part) <= 255;
  });
}

// حل بديل: regex واحد (بينفع تعرفه، بس الحل فوق أوضح بالمقابلة)
// const octet = '(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)';
// const ipv4Regex = new RegExp(`^${octet}(\\.${octet}){3}$`);

// ------------------------------------------------------------
// 2) isPrivateIPv4
// ------------------------------------------------------------
export function isPrivateIPv4(ip) {
  if (!isValidIPv4(ip)) return false;

  const [a, b] = ip.split('.').map(Number);

  return (
    a === 10 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

// ------------------------------------------------------------
// 3) getDefaultPort
// ------------------------------------------------------------
const DEFAULT_PORTS = {
  http: 80,
  https: 443,
  ws: 80,
  wss: 443,
  ftp: 21,
  ssh: 22,
};

export function getDefaultPort(protocol) {
  const key = protocol.toLowerCase().replace(/:$/, '');

  // ⚠️ ليش Object.hasOwn وما منكتب DEFAULT_PORTS[key] ?? null بس؟
  // لأن DEFAULT_PORTS["constructor"] بيرجع function من الـ prototype!
  // البديل: Map، أو Object.create(null) بدل {}
  return Object.hasOwn(DEFAULT_PORTS, key) ? DEFAULT_PORTS[key] : null;
}

/**
 * 🧠 دروس من التمرين:
 *  1. Number() و parseInt() متساهلين، تحقق من الشكل بـ regex أول
 *  2. Lookup table (object/Map) أنظف من if/else طويلة
 *  3. انتبه للـ prototype keys لما تستخدم object كـ dictionary
 *  4. فكّر بالـ edge cases: فاضي، سالب، leading zeros، مسافات
 */
