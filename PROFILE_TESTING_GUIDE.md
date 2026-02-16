# اختبار الربط بين الـ Backend والـ Frontend - دليل عملي

## المرحلة الأولى: اختبار تسجيل الدخول والاستقبال

### الخطوات:

1. **افتح Developer Tools**
   - اضغط `F12` أو `Ctrl+Shift+I`
   - توجه إلى تبويب "Console"

2. **سجّل الدخول بحسابك الطبي**
   - أدخل البريد الإلكتروني والرقم السري
   - اضغط "Sign In"

3. **راقب رسائل Console**
   - ستظهر رسائل مثل:
     ```
     ✅ Full profile data loaded: {doctorId: 1, doctorName: "Dr Ahmed", ...}
     ✅ doctorProfile updated: {name: "Dr Ahmed", specialty: "Cardiology", ...}
     ```

### ما الذي يجب أن تراه:
- ✅ "Full profile data loaded" - تم الحصول على البيانات
- ✅ "doctorProfile updated" - تم تخزين البيانات  
- ✅ "Welcome Dr. [Name]!" - تم تسجيل الدخول بنجاح

---

## المرحلة الثانية: التحقق من البيانات المخزنة

### في Console، اكتب:
```javascript
console.log(doctorProfile);
```

### يجب أن تظهر كائن مثل:
```javascript
{
  doctorId: 1,
  name: "Dr Ahmed",
  specialty: "Cardiology",
  specialtyName: "Cardiology",
  specialtyId: 1,
  certificate: "MD Cairo University",
  city: "Cairo",
  phone: "01000000000",
  email: "ahmed@clinic.com",
  nationalNumber: 12345678901234,
  licenseNumber: "MD-12345",
  consultationFee: 500,
  rating: 4.8,
  averageRating: 4.8,
  photo: null,
  doctorImage: null,
  clinicId: 1,
  clinicName: "Heart Care Clinic",
  clinicPhone: "01011111111",
  clinicEmail: "info@clinic.com",
  clinicLocation: "Nasr City",
  clinicAddress: "Nasr City",
  workingDays: "Sat, Sun, Mon",
  workingHours: "09:00 - 18:00"
}
```

---

## المرحلة الثالثة: التحقق من عرض البيانات في الصفحة

### 1. انقر على زر "Profile" في الـ Navbar

### 2. يجب أن تظهر:

#### في قسم Header (الجزء الأعلى):
```
✓ اسم الطبيب: "Dr Ahmed"
✓ التخصص: "Cardiology"  
✓ التقييم: "4.8/5.0"
```

#### في قسم Clinic Information:
```
✓ Clinic Name: "Heart Care Clinic"
✓ Address: "Nasr City"
✓ Phone: "01011111111"
✓ Email: "info@clinic.com"
```

#### في قسم Doctor Information:
```
✓ Doctor Phone: "01000000000"
✓ Doctor Email: "ahmed@clinic.com"
✓ City: "Cairo"
```

#### في قسم Professional Details:
```
✓ Specialty: "Cardiology"
✓ Certificate: "MD Cairo University"
✓ License Number: "MD-12345"
```

#### في قسم Working Hours:
```
✓ Working Days: "Sat, Sun, Mon"
✓ Working Hours: "09:00 - 18:00"
✓ Consultation Fee: "500 EGP"
```

---

## المرحلة الرابعة: اختبار التعديل

### 1. انقر على زر "Edit Profile"

### 2. يجب أن تُملأ جميع الحقول بالبيانات:
```
✓ Full Name: "Dr Ahmed"
✓ Phone: "01000000000"
✓ Email: "ahmed@clinic.com"
✓ City: "Cairo"
✓ Specialty: "Cardiology"
✓ Certificate: "MD Cairo University"
✓ License Number: "MD-12345"
✓ Clinic Name: "Heart Care Clinic"
✓ Clinic Phone: "01011111111"
✓ Clinic Email: "info@clinic.com"
✓ Clinic Address: "Nasr City"
```

### 3. في Console، اكتب:
```javascript
console.log(document.getElementById('editDoctorName').value);
// يجب أن يظهر: "Dr Ahmed"
```

---

## المرحلة الخامسة: التحقق من معالجة القيم الفارغة

### إذا كانت البيانات تحتوي على null:

```javascript
// مثال على بيانات مع null
{
  doctorName: "Dr Ahmed",
  specialtyName: null,
  workingDays: null,
  doctorImage: null
}
```

### يجب أن تظهر:
```
✓ Specialty: "Not specified"
✓ Working Days: "Not specified"
✓ Photo: emoji 👨‍⚕️
```

### اختبر في Console:
```javascript
console.log(document.getElementById('doctorSpecialty').textContent);
// يجب أن يظهر: "Not specified"
```

---

## المرحلة السادسة: رسائل Debugging

### راقب Console لهذه الرسائل:

#### عند تسجيل الدخول:
```
🔐 Attempting login...
✅ Login response: {...}
📋 Fetching doctor profile for ID: 1
✅ Profile data retrieved: {...}
✅ Full profile data loaded: {...}
✅ doctorProfile updated: {...}
```

#### عند التنقل لصفحة البروفايل:
```
🔄 Updating profile page with data: {...}
✅ Profile page updated successfully
```

#### عند التعديل:
```
✓ جميع الحقول ستُملأ بالبيانات
✓ الصورة ستظهر في Preview
```

---

## قائمة التحقق النهائية

### ✅ البيانات الأساسية
- [ ] اسم الطبيب يظهر بشكل صحيح
- [ ] البريد الإلكتروني يظهر بشكل صحيح
- [ ] رقم الهاتف يظهر بشكل صحيح
- [ ] المدينة تظهر بشكل صحيح

### ✅ بيانات التخصص والشهادات
- [ ] التخصص يظهر بشكل صحيح
- [ ] الشهادة تظهر بشكل صحيح
- [ ] رقم الرخصة يظهر بشكل صحيح

### ✅ بيانات العيادة
- [ ] اسم العيادة يظهر بشكل صحيح
- [ ] عنوان العيادة يظهر بشكل صحيح
- [ ] رقم هاتف العيادة يظهر بشكل صحيح
- [ ] بريد العيادة يظهر بشكل صحيح

### ✅ بيانات المواعيد
- [ ] أيام العمل تظهر بشكل صحيح
- [ ] ساعات العمل تظهر بشكل صحيح
- [ ] رسوم المشورة تظهر بشكل صحيح

### ✅ التقييم والإحصائيات
- [ ] التقييم يظهر بشكل صحيح
- [ ] عدد المرضى يظهر بشكل صحيح
- [ ] عدد المواعيد يظهر بشكل صحيح

### ✅ معالجة القيم الفارغة
- [ ] عند وجود null، تظهر "Not specified"
- [ ] عند عدم وجود صورة، تظهر emoji

---

## الأخطاء الشائعة وحلولها

### مشكلة: "TypeError: Cannot read property 'doctorName'"
**الحل:**
```javascript
// قبل:
doctorProfile.name = profileData.doctorName;

// بعد: (مع معالجة null)
doctorProfile.name = profileData.doctorName || "Unknown";
```

### مشكلة: البيانات لا تظهر في صفحة البروفايل
**الحل:**
1. تأكد من استدعاء `updateProfilePage()` بعد تحديث `doctorProfile`
2. تأكد من أن عناصر HTML لها نفس الـ ID المتوقعة
3. افحص Console للأخطاء

### مشكلة: صفحة البروفايل لا تحدّث عند التنقل إليها
**الحل:**
```javascript
// في ui.js:
if (page === 'profile') updateProfilePage(); // تأكد من وجود هذا
```

### مشكلة: حقول Modal التعديل فارغة
**الحل:**
```javascript
// في profile.js:
function showEditProfileModal() {
    document.getElementById('editDoctorName').value = doctorProfile.name || '';
    // ... باقي الحقول
}
```

---

## نصائح للتطوير

### 1. استخدم Debugger
```javascript
// ضع نقطة توقف في Console:
debugger; // اضغط F10 للمتابعة خطوة بخطوة
console.log('Current doctorProfile:', doctorProfile);
```

### 2. تتبع مسار البيانات
```javascript
// في api.js:
console.log('📥 Response from Backend:', response);

// في auth.js:
console.log('📦 Storing in doctorProfile:', doctorProfile);

// في profile.js:
console.log('📤 Displaying on page:', document.getElementById('doctorName').textContent);
```

### 3. اختبر معالجة الأخطاء
```javascript
// تأكد من أن الأخطاء تُعرض بشكل واضح:
.catch(error => {
    console.error('❌ Error:', error);
    showToast('Error loading profile', 'error');
});
```

---

## الخلاصة

عند اتباع هذه الخطوات، يجب أن تضمن:
✅ البيانات تُستقبل بشكل صحيح من الـ Backend
✅ البيانات تُخزن بشكل صحيح في `doctorProfile`
✅ البيانات تُعرض بشكل صحيح في صفحة الملف الشخصي
✅ معالجة القيم الفارغة تعمل بشكل صحيح
✅ التعديلات تعرض البيانات الحالية
