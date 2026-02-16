# 🔗 Backend Integration Guide

## ✅ ما تم إنجازه

- ✅ تم تحديث `api.js` مع proper error handling
- ✅ تم تحديث `handleLogin()` للاتصال بـ API
- ✅ تم تحديث `handleDoctorSignup()` للاتصال بـ API
- ✅ تم إضافة token management (localStorage)
- ✅ تم إضافة loading states للزرار
- ✅ تم إضافة proper error messages

---

## 🚀 الخطوات التالية

### **1. تأكد من البيانات المطلوبة من الـ Backend**

اطلب من Backend Developer:

```
📋 LOGIN Endpoint:
  - URL: POST /auth/login
  - Request Fields:
    * email (string)
    * password (string)
  - Response Fields:
    * token or access_token
    * data (doctor info)

📋 SIGNUP Endpoint:
  - URL: POST /auth/signup
  - Request Fields: (اكتبها من swagger)
  - Response Fields: (اكتبها من swagger)
```

---

### **2. تحديث `api.js` بناءً على الـ Response**

إذا كان الـ token في response بـ اسم مختلف:

```javascript
// إذا كان 'access_token' بدل 'token'
if (response.access_token) {
    localStorage.setItem("authToken", response.access_token);
}

// إذا كان 'data' يحتوي على معلومات الدكتور
if (response.data) {
    doctorProfile = { ...doctorProfile, ...response.data };
}
```

---

### **3. اختبر Login و Signup**

**خطوات الاختبار:**

1. افتح البرنامج في المتصفح
2. اذهب إلى halaman login
3. أدخل بيانات صحيحة من الـ swagger test
4. افتح Developer Console (F12)
5. تحقق من الـ Network tab:
   - شنو البيانات المرسلة؟
   - شنو الـ Response؟
   - هل فيه errors؟

---

### **4. أشياء قد تحتاج تعديل**

#### **أ) إذا كان الـ Response مختلف:**
```javascript
// مثال: إذا البيانات في nested object
if (response.result?.data) {
    doctorProfile = { ...doctorProfile, ...response.result.data };
}
```

#### **ب) إذا كان الـ endpoint مختلف:**
```javascript
// تحديث في api.js
async function apiLogin(email, password) {
    const response = await apiRequest("/auth/doctor/login", "POST", {
        email: email,
        password: password
    });
    // ...
}
```

#### **ج) إذا كانت الـ field names مختلفة:**
```javascript
// في handleLogin
const response = await apiLogin(email, password);

// عدّل حسب الـ response
if (response.user) {
    doctorProfile.name = response.user.doctor_name;
    doctorProfile.email = response.user.doctor_email;
}
```

---

## 🐛 Debugging Tips

### **إذا الـ request فشل:**

```
1. شغّل DevTools (F12)
2. اذهب إلى Network tab
3. ابحث عن الـ request
4. شوف:
   - Status code (200, 401, 500?)
   - Response body
   - Headers المرسلة
```

### **المشاكل الشائعة:**

| المشكلة | الحل |
|--------|-----|
| 401 Unauthorized | تأكد من email/password صحيح |
| CORS error | أضف headers من Documentation |
| 404 Not Found | تأكد من endpoint صحيح |
| Network error | تأكد من Base URL صحيح |

---

## 📝 ملاحظات مهمة

1. **Token Expiry**: إذا Backend رجع expired token، أضفنا auto logout
2. **Validation**: تأكد من validation على كلا الطرفين
3. **Error Messages**: استخدم messages واضحة للمستخدم

---

## ✔️ Checklist للـ Integration

- [ ] اطلبت Swagger details من Backend
- [ ] تأكدت من endpoint paths
- [ ] تأكدت من request/response structure
- [ ] اختبرت login مع بيانات حقيقية
- [ ] اختبرت signup مع بيانات جديدة
- [ ] تحققت من token storage
- [ ] اختبرت logout
- [ ] اختبرت expired token handling
- [ ] كتبت unit tests للـ API calls

---

## 🎯 الخطوة التالية

بعد ما تربط login و signup بنجاح:
1. ربط Patients endpoints (GET, POST, PUT, DELETE)
2. ربط Appointments endpoints
3. ربط Consultation endpoints
4. إضافة proper validation
5. إضافة loading spinners

**سؤال:** شنو تفاصيل الـ Swagger endpoints؟ بعت لي:

```
1. endpoint paths
2. request structures
3. response structures
```

وأنا كمل التطوير! 🚀
