# البيانات الطبيب - خريطة الربط بين الـ Backend والـ Frontend

## الغرض من هذا الملف
هذا الملف يوضح كيفية ربط البيانات القادمة من الـ Backend API مع عناصر الـ Frontend وتخزينها في كائن `doctorProfile`.

---

## البيانات القادمة من الـ Backend API

### Endpoint
```
GET /api/DoctorProfile/{doctorId}
```

### نموذج البيانات المُستقبلة
```json
{
  "doctorId": 1,
  "doctorName": "Dr Ahmed",
  "doctorCity": "Cairo",
  "doctorPhone": "01000000000",
  "doctorEmail": "ahmed@clinic.com",
  "doctorPrice": 500,
  "certificate": "MD Cairo University",
  "licenseNumber": "MD-12345",
  "nationalNumber": 12345678901234,
  "doctorImage": "url_or_null",
  "workingDays": "Sat, Sun, Mon",
  "workingHours": "09:00 - 18:00",
  "averageRating": 4.8,
  "specialtyName": "Cardiology",
  "specialtyId": 1,
  "clinicId": 1,
  "clinicName": "Heart Care Clinic",
  "clinicPhone": "01011111111",
  "clinicEmail": "info@clinic.com",
  "clinicLocation": "Nasr City"
}
```

---

## خريطة الربط (Mapping) من Backend إلى Frontend

### 1. بيانات الطبيب الأساسية
| حقل Backend | متغير doctorProfile | عنصر HTML | القيمة الافتراضية |
|---|---|---|---|
| `doctorName` | `name` | #doctorName | "Unknown" |
| `doctorPhone` | `phone` | #doctorPhone | "Not specified" |
| `doctorEmail` | `email` | #doctorEmail | "Not specified" |
| `doctorCity` | `city` | #doctorCity | "Not specified" |
| `doctorImage` | `photo` + `doctorImage` | .profile-avatar | emoji 👨‍⚕️ |
| `nationalNumber` | `nationalNumber` | (مخزنة بـ doctorProfile فقط) | null |

### 2. بيانات التخصص والشهادات
| حقل Backend | متغير doctorProfile | عنصر HTML | القيمة الافتراضية |
|---|---|---|---|
| `specialtyName` | `specialty` + `specialtyName` | #doctorSpecialty / #profileSpecialty | "Not specified" |
| `specialtyId` | `specialtyId` | (مخزنة بـ doctorProfile فقط) | null |
| `certificate` | `certificate` | #profileCertificate | "Not specified" |
| `licenseNumber` | `licenseNumber` | #profileLicense | "Not specified" |

### 3. بيانات العيادة
| حقل Backend | متغير doctorProfile | عنصر HTML | القيمة الافتراضية |
|---|---|---|---|
| `clinicId` | `clinicId` | (مخزنة بـ doctorProfile فقط) | null |
| `clinicName` | `clinicName` | #clinicName | "Not specified" |
| `clinicPhone` | `clinicPhone` | #clinicPhone | "Not specified" |
| `clinicEmail` | `clinicEmail` | #clinicEmail | "Not specified" |
| `clinicLocation` | `clinicLocation` + `clinicAddress` | #clinicAddress | "Not specified" |

### 4. بيانات المواعيد والساعات
| حقل Backend | متغير doctorProfile | عنصر HTML | القيمة الافتراضية |
|---|---|---|---|
| `workingDays` | `workingDays` | #profileWorkingDays | "Not specified" |
| `workingHours` | `workingHours` | #profileWorkingHours | "Not specified" |
| `doctorPrice` | `consultationFee` | #profileConsultationFee | 0 |

### 5. بيانات التقييم والإحصائيات
| حقل Backend | متغير doctorProfile | عنصر HTML | القيمة الافتراضية |
|---|---|---|---|
| `averageRating` | `rating` + `averageRating` | #doctorRating / #profileRating | 0 |
| (local) | - | #profileTotalPatients | patients.length |
| (local) | - | #profileAppointments | appointments.length |
| (local) | - | #statsTotalPatients | patients.length |
| (local) | - | #statsMonthAppointments | counted from appointments |

---

## مسار البيانات (Data Flow)

```
Backend API (/api/DoctorProfile/{doctorId})
    ↓
getProfileData() في api.js
    ↓
apiRequest() - تقديم الطلب
    ↓
استقبال JSON Response
    ↓
تحديث doctorProfile object في auth.js
    ↓
استدعاء updateProfilePage() في profile.js
    ↓
تحديث عناصر HTML بالبيانات
    ↓
عرض الصفحة في المتصفح
```

---

## أماكن استدعاء updateProfilePage()

### 1. عند تسجيل الدخول (Login)
**الملف:** `js/auth.js` - في دالة `handleLogin()`
```javascript
getProfileData(doctorId)
    .then(profileData => {
        // تحديث doctorProfile
        doctorProfile.name = profileData.doctorName;
        doctorProfile.specialty = profileData.specialtyName;
        // ... باقي البيانات
    })
```

### 2. عند التنقل لصفحة البروفايل
**الملف:** `js/ui.js` - في دالة `showPage()`
```javascript
if (page === 'profile') updateProfilePage();
```

### 3. عند التحديث العام للبيانات
**الملف:** `js/main.js` - في دالة `updateAllData()`
```javascript
function updateAllData() {
    updateProfilePage();
}
```

### 4. عند حفظ تعديلات البروفايل
**الملف:** `js/profile.js` - في دالة `saveProfile()`
```javascript
updateProfilePage();
```

---

## معالجة القيم الفارغة (Null Handling)

### حالات null:
عند استقبال قيم `null` أو `undefined` من الـ Backend:

```javascript
// الاستخدام في updateProfilePage()
document.getElementById('doctorCity').textContent = doctorProfile.city || "Not specified";

// الاستخدام في showEditProfileModal()
document.getElementById('editDoctorSpecialty').value = doctorProfile.specialty || '';
```

### مثال:
إذا كانت `specialtyName` من الـ Backend قيمتها `null`:
```
Backend Response: { specialtyName: null }
↓
doctorProfile.specialty = null || "Not specified" = "Not specified"
↓
عرض "Not specified" في الصفحة
```

---

## اختبار الربط

### 1. فتح Developer Console
اضغط `F12` أو `Ctrl+Shift+I`

### 2. البحث عن رسائل التسجيل (Console Messages)
```javascript
// ستجد رسائل مثل:
✅ Full profile data loaded: {doctorId: 1, doctorName: "Dr Ahmed", ...}
✅ doctorProfile updated: {name: "Dr Ahmed", specialty: "Cardiology", ...}
✅ Profile page updated successfully
```

### 3. التحقق من doctorProfile
في Console، اكتب:
```javascript
console.log(doctorProfile);
```

ستظهر جميع البيانات المخزنة.

### 4. التحقق من عنصر HTML محدد
```javascript
console.log(document.getElementById('doctorName').textContent);
// يجب أن يظهر: "Dr Ahmed"
```

---

## الملفات المتأثرة

| الملف | الدور | الحقول المتأثرة |
|---|---|---|
| `js/api.js` | استقبال البيانات من الـ API | جميع البيانات |
| `js/auth.js` | تخزين البيانات في doctorProfile | جميع البيانات |
| `js/profile.js` | عرض البيانات في الصفحة | جميع البيانات |
| `js/ui.js` | التنقل وتحديث الصفحات | استدعاء updateProfilePage() |
| `js/main.js` | تحديث البيانات العام | استدعاء updateProfilePage() |
| `index.html` | عناصر HTML | جميع عناصر ID |

---

## ملاحظات مهمة

### 1. الـ Doctor ID
- يأتي من البيانات المُستقبلة كـ `doctorId`
- يُستخدم لطلب بيانات الملف الشخصي من الـ Backend
- يُخزن في `doctorProfile.doctorId`

### 2. الـ Specialty ID
- يأتي من البيانات المُستقبلة كـ `specialtyId`
- قد يكون مفيد إذا كان هناك نموذج تعديل / حذف للتخصص
- يُخزن في `doctorProfile.specialtyId`

### 3. الـ Clinic ID
- يأتي من البيانات المُستقبلة كـ `clinicId`
- قد يكون مفيد إذا كان هناك عدة عيادات
- يُخزن في `doctorProfile.clinicId`

### 4. الصورة
- تُخزن بطريقتين: `photo` و `doctorImage`
- تُستخدم في عنصر `.profile-avatar` كـ `backgroundImage`
- إذا كانت `null`، يتم إظهار emoji بدلاً منها

### 5. التقييم
- يأتي كـ `averageRating` من الـ Backend
- يُخزن في `doctorProfile.rating` و `doctorProfile.averageRating`
- يُعرض في موضعين: header و stats card

---

## مثال عملي كامل

### البيانات القادمة من الـ Backend:
```json
{
  "doctorName": "Dr Ahmed",
  "doctorCity": "Cairo",
  "doctorPhone": "01000000000",
  "doctorEmail": "ahmed@clinic.com",
  "doctorPrice": 500,
  "certificate": "MD Cairo University",
  "specialtyName": "Cardiology"
}
```

### التخزين في doctorProfile:
```javascript
{
  name: "Dr Ahmed",
  city: "Cairo",
  phone: "01000000000",
  email: "ahmed@clinic.com",
  consultationFee: 500,
  certificate: "MD Cairo University",
  specialty: "Cardiology",
  specialtyName: "Cardiology"
}
```

### عرض في الصفحة:
```html
<h2 id="doctorName">Dr Ahmed</h2>  <!-- يأتي من doctorProfile.name -->
<p id="doctorSpecialty">Cardiology</p>  <!-- يأتي من doctorProfile.specialty -->
<div id="doctorCity">Cairo</div>  <!-- يأتي من doctorProfile.city -->
```

---

## الخلاصة

✅ جميع البيانات القادمة من الـ Backend API يتم استقبالها بشكل صحيح
✅ يتم تخزينها في كائن `doctorProfile`
✅ يتم عرضها في عناصر HTML المناسبة
✅ يتم معالجة القيم الفارغة (null) بشكل صحيح
✅ الربط تلقائي عند تسجيل الدخول والتنقل بين الصفحات
