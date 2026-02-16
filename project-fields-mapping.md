# Project Fields Mapping

## Login Fields

### HTML Input IDs
- `loginEmail`
- `loginPassword`

### JavaScript Object Properties
- `email`
- `password`

### API Payload
```
POST /api/auth/doctor/login
{
  "email": string,
  "password": string
}
```

### API Response
```
{
  "token": string,
  "access_token": string,
  "data": {
    "doctorId": number
  }
}
```

---

## Register Fields

### HTML Input IDs
- `signupPhoto`
- `signupName`
- `signupEmail`
- `signupPassword`
- `signupPhone`
- `signupGovernorate`
- `signupSpecialty`
- `signupCertificate`
- `signupNationalId`
- `signupLicense`
- `signupClinicName`
- `signupClinicPhone`
- `signupClinicEmail`
- `signupClinicAddress`
- `photoPreview`
- `photoStatus`
- `photoUploadArea`

### JavaScript Object Properties
- `name`
- `email`
- `password`
- `phone`
- `city`
- `specialty`
- `certificate`
- `licenseNumber`
- `nationalId`
- `clinicName`
- `clinicPhone`
- `clinicEmail`
- `clinicLocation`
- `selectedPhotoFile`

### API Payload (FormData)
```
POST /api/auth/doctor/register
FormData {
  "FullName": string,
  "Email": string,
  "Password": string,
  "Phone": string,
  "City": string,
  "SpecialtyName": string,
  "Certificate": string,
  "LicenseNumber": string,
  "NationalNumber": number,
  "ClinicName": string,
  "ClinicPhone": string,
  "ClinicEmail": string,
  "ClinicLocation": string,
  "DoctorImage": File
}
```

### API Response
```
{
  "token": string,
  "access_token": string,
  "photo": string,
  "photoUrl": string,
  "data": {
    "doctorId": number,
    "token": string
  }
}
```

---

## Doctor Profile Fields

### HTML Input IDs
- `editDoctorName`
- `editDoctorPhone`
- `editDoctorEmail`
- `editDoctorCity`
- `editNationalId`
- `editDoctorSpecialty`
- `editProfileCertificate`
- `editProfileLicense`
- `editClinicName`
- `editClinicPhone`
- `editClinicAddress`
- `editClinicEmail`
- `editCurrentPassword`
- `editNewPassword`
- `editConfirmPassword`
- `editWorkingDay_Sat`
- `editWorkingDay_Sun`
- `editWorkingDay_Mon`
- `editWorkingDay_Tue`
- `editWorkingDay_Wed`
- `editWorkingDay_Thu`
- `editWorkingDay_Fri`
- `editWorkingHoursStart`
- `editWorkingHoursEnd`
- `editConsultationFee`
- `profilePhotoInput`
- `profilePhotoPreview`
- `editProfileEducation`
- `doctorName`
- `doctorSpecialty`
- `doctorPhone`
- `doctorEmail`
- `doctorCity`
- `doctorRating`
- `clinicName`
- `clinicAddress`
- `clinicPhone`
- `clinicEmail`
- `profileSpecialty`
- `profileCertificate`
- `profileLicense`
- `profileTotalPatients`
- `profileRating`
- `profileAppointments`
- `profileWorkingDays`
- `profileWorkingHours`
- `profileConsultationFee`
- `statsTotalPatients`
- `statsMonthAppointments`

### JavaScript Object Properties (doctorProfile)
- `doctorId`
- `name`
- `specialty`
- `city`
- `phone`
- `email`
- `nationalNumber`
- `certificate`
- `licenseNumber`
- `consultationFee`
- `rating`
- `clinicId`
- `clinicName`
- `clinicPhone`
- `clinicEmail`
- `clinicAddress`
- `clinicLocation`
- `workingDays`
- `workingHours`
- `photo`
- `specialtyName`
- `specialtyId`
- `averageRating`
- `doctorImage`
- `doctorPrice`

### API Request (GET)
```
GET /api/DoctorProfile/{doctorId}
```

### API Response
```
{
  "doctorId": number,
  "doctorName": string,
  "specialtyName": string,
  "specialtyId": number,
  "certificate": string,
  "doctorCity": string,
  "doctorPhone": string,
  "doctorEmail": string,
  "nationalNumber": number,
  "licenseNumber": string,
  "doctorPrice": number,
  "averageRating": number,
  "doctorImage": string,
  "clinicId": number,
  "clinicName": string,
  "clinicPhone": string,
  "clinicEmail": string,
  "clinicLocation": string,
  "workingDays": array,
  "workingHours": string
}
```

---

## Clinic Fields

### HTML Input IDs
- `editClinicName`
- `editClinicPhone`
- `editClinicAddress`
- `editClinicEmail`
- `clinicName`
- `clinicAddress`
- `clinicPhone`
- `clinicEmail`

### JavaScript Object Properties (from doctorProfile)
- `clinicId`
- `clinicName`
- `clinicPhone`
- `clinicEmail`
- `clinicAddress`
- `clinicLocation`

### Registration API Payload Fields
- `ClinicName`
- `ClinicPhone`
- `ClinicEmail`
- `ClinicLocation`

### Profile API Response Fields
- `clinicId`
- `clinicName`
- `clinicPhone`
- `clinicEmail`
- `clinicLocation`

---

## Patient Fields

### HTML Input IDs (Add Patient Modal)
- `patientName`
- `patientAge`
- `patientGender`
- `patientPhone`
- `patientCity`
- `patientMarried`
- `patientBloodType`
- `patientResidenceType`
- `patientHypertension`
- `patientDiabetes`
- `patientAnaemia`
- `patientChestPain`
- `patientSodium`
- `patientPlatelets`
- `patientGlucose`
- `patientCreatinine`
- `patientCholesterol`
- `patientBMI`
- `patientRestingBP`
- `patientAllergies`
- `patientNotes`

### HTML Input IDs (Edit Patient Modal)
- `editPatientId`
- `editPatientName`
- `editPatientAge`
- `editPatientGender`
- `editPatientPhone`
- `editPatientCity`
- `editPatientMarried`
- `editPatientBloodType`
- `editPatientResidenceType`
- `editPatientHypertension`
- `editPatientDiabetes`
- `editPatientAnaemia`
- `editPatientChestPain`
- `editPatientSodium`
- `editPatientPlatelets`
- `editPatientGlucose`
- `editPatientCreatinine`
- `editPatientCholesterol`
- `editPatientBMI`
- `editPatientRestingBP`
- `editPatientAllergies`
- `editPatientNotes`

### JavaScript Object Properties (Patient Object)
- `id`
- `name`
- `age`
- `gender`
- `phone`
- `city`
- `married`
- `bloodType`
- `allergies`
- `chronic`
- `lastVisit`
- `notes`
- `visits`
- `medicalHistory`
  - `hypertension`
  - `diabetes`
  - `anaemia`
  - `chestPain`
  - `sodium`
  - `platelets`
- `measurements`
  - `glucose`
  - `creatinine`
  - `cholesterol`
  - `bmi`
  - `restingBP`
  - `residenceType`

### Default Data Structure
```javascript
{
  id: string,
  name: string,
  age: number,
  gender: string,
  phone: string,
  bloodType: string,
  allergies: string,
  chronic: string,
  lastVisit: string,
  notes: string,
  city: string,
  married: string,
  visits: [
    {
      date: string,
      diagnosis: string,
      diagnoses: array,
      prescription: string,
      condition: string,
      notes: string
    }
  ],
  medicalHistory: {
    hypertension: boolean,
    diabetes: boolean,
    anaemia: boolean,
    chestPain: boolean,
    sodium: boolean,
    platelets: boolean
  },
  measurements: {
    glucose: number,
    creatinine: number,
    cholesterol: number,
    bmi: number,
    restingBP: string,
    residenceType: string
  }
}
```

---

## Appointment Fields

### HTML Input IDs (Add Appointment Modal)
- `appointmentPatient`
- `appointmentDate`
- `appointmentTime`
- `appointmentStatus`
- `appointmentNotes`

### HTML Input IDs (Edit Appointment Modal)
- `editAppointmentId`
- `editAppointmentPatientName`
- `editAppointmentDate`
- `editAppointmentTime`
- `editAppointmentStatus`
- `editAppointmentNotes`

### JavaScript Object Properties (Appointment Object)
- `id`
- `patientId`
- `date`
- `time`
- `status`
- `notes`

### Default Data Structure
```javascript
{
  id: number,
  patientId: string,
  date: string,
  time: string,
  status: string,
  notes: string
}
```

---

## Consultation/Diagnosis Fields

### HTML Input IDs
- `consultationAppointmentId`
- `consultationDiagnosisSearch`
- `diseaseAutocomplete`
- `selectedDiseases`
- `consultationPrescription`
- `consultationNotes`
- `consultationCondition`

### JavaScript Object Properties
- `disease`
  - `id`
  - `name`
  - `severity`
- `selectedDiseases` (array)
- `prescription`
- `notes`
- `condition`

### Visit Record Structure
```javascript
{
  date: string,
  diagnosis: string,
  diagnoses: [
    {
      id: string,
      name: string,
      severity: string
    }
  ],
  prescription: string,
  notes: string,
  condition: string
}
```

---

## API Endpoint Structure

### Disease Data Storage (by specialty)
```javascript
diseasesBySpecialty: {
  [specialtyName]: [
    {
      name: string,
      severity: string (mild, acute, chronic)
    }
  ]
}
```

Specialties covered:
- Vaccination
- Dermatology
- Psychiatry
- Pediatrics
- Orthopedics
- General Surgery
- Dentistry
- Obstetrics
- Gynecology
- Fertility
- Plastic Surgery
- Newborn Care

---

## Global State Variables

### Main Data Storage
- `patients` - array of patient objects
- `appointments` - array of appointment objects
- `doctorProfile` - doctor profile object
- `selectedDiseases` - array of selected diseases for current consultation
- `isLoggedIn` - boolean
- `currentMonth` - number
- `currentYear` - number
- `selectedDate` - string
- `selectedPhotoFile` - File object

### Authentication
- `authToken` - stored in localStorage
- Session persistence via token check on page load

