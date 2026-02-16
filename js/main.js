// Data Storage
        let patients = [];
        let appointments = [];
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();
        let selectedDate = new Date().toISOString().split('T')[0];
        let isLoggedIn = false;
        let selectedDiseases = []; // Selected diseases for current consultation
        let doctorProfile = {
            doctorId: null,
            name: "Dr. Ahmed Mohamed",
            specialty: "Dentistry",
            city: "Cairo",
            phone: "+20 100 000 0000",
            email: "ahmed@clinic.com",
            nationalNumber: null,
            certificate: "MD Cairo University",
            licenseNumber: "MD-12345",
            consultationFee: 500,
            rating: 4.8,
            clinicId: 1,
            clinicName: "Heart Care Clinic",
            clinicPhone: "+20 101 111 1111",
            clinicEmail: "info@clinic.com",
            clinicAddress: "Nasr City",
            clinicLocation: "Nasr City",
            workingDays: null,
            workingHours: null,
            photo: null
        };



        

        // Initialize
        function loadDefaultData() {
            patients = [
                {
                    id: 'P001',
                    name: 'Mohamed Ali Hassan',
                    age: 45,
                    gender: 'Male',
                    phone: '+20 111 111 1111',
                    bloodType: 'A+',
                    allergies: 'Penicillin',
                    chronic: 'Hypertension',
                    lastVisit: '2025-11-10',
                    notes: 'Regular patient',
                    visits: [
                        { date: '2025-11-10', diagnosis: 'High Blood Pressure', prescription: 'Amlodipine 5mg', notes: 'Follow up in 2 weeks' }
                    ]
                },
                {
                    id: 'P002',
                    name: 'Fatima Hassan Mahmoud',
                    age: 32,
                    gender: 'Female',
                    phone: '+20 122 222 2222',
                    bloodType: 'O+',
                    allergies: 'None',
                    chronic: 'None',
                    lastVisit: '2025-11-15',
                    notes: '',
                    visits: [
                        { date: '2025-11-15', diagnosis: 'Sore Throat', prescription: 'Amoxicillin 500mg', notes: 'Rest and warm fluids' }
                    ]
                },
                {
                    id: 'P003',
                    name: 'Khaled Said Ahmed',
                    age: 58,
                    gender: 'Male',
                    phone: '+20 133 333 3333',
                    bloodType: 'B+',
                    allergies: 'Sulfa',
                    chronic: 'Type 2 Diabetes',
                    lastVisit: '2025-11-12',
                    notes: 'Needs regular monitoring',
                    visits: [
                        { date: '2025-11-12', diagnosis: 'Diabetes Follow-up', prescription: 'Metformin 1000mg', notes: 'HbA1c 7.2%' }
                    ]
                }
            ];

            const today = new Date().toISOString().split('T')[0];
            appointments = [
                { id: 1, patientId: 'P001', date: today, time: '09:00', status: 'confirmed', notes: '' },
                { id: 2, patientId: 'P002', date: today, time: '10:00', status: 'confirmed', notes: '' },
                { id: 3, patientId: 'P003', date: today, time: '11:30', status: 'pending', notes: '' }
            ];

            updateAllData();
        }
// Update All Data
        function updateAllData() {
            updateDashboard();
            renderCalendar();
            renderPatientsTable();
            updateProfilePage();
        }

        // Initialize
       window.addEventListener('DOMContentLoaded', function () {

    const token = localStorage.getItem("authToken");

    // لو فيه session محفوظة
    if (token) {
        console.log("🔐 Existing session detected");

        isLoggedIn = true;

        // اخفاء صفحات الدخول
        document.getElementById('loginPage')?.classList.add('hidden');
        document.getElementById('signupPage')?.classList.add('hidden');

        // اظهار التطبيق
        document.getElementById('mainApp')?.classList.remove('hidden');

        // تحميل البيانات
        loadDefaultData();

        // اظهار dashboard
        document.getElementById('dashboardPage')?.classList.remove('hidden');

    } else {
        // لو مفيش token → افتح login عادي
        showLogin();
    }
});


        // Toast Notifications