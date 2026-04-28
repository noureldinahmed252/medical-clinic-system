// Data Storage
        let patients = [];
        let appointments = [];
        let doctorClinics = []; // New: clinics array
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
            rating: 4.8,
            clinicId: 1,
            photo: null
        };



        // Initialize
        function loadDefaultData() {
            // Initialize empty arrays for API data
            patients = [];
            appointments = [];
            console.log("✅ Default data structure initialized (ready for API data)");
        }
// Update All Data
        function updateAllData() {
            updateDashboard();
            renderPatientsTable();
            updateProfilePage();
            // DON'T call renderCalendar here - only when showing calendar page
        }

        // Initialize
       window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("authToken");
    const savedDoctorId = localStorage.getItem("doctorId");

    // لو فيه token محفوظ → استرجاع الـ session
    if (token && savedDoctorId) {
        console.log("🔐 Session found - Restoring login");
        
        isLoggedIn = true;
        doctorProfile.doctorId = parseInt(savedDoctorId);

        // اخفاء صفحات الدخول
        document.getElementById('loginPage')?.classList.add('hidden');
        document.getElementById('signupPage')?.classList.add('hidden');

        // اظهار التطبيق
        document.getElementById('mainApp')?.classList.remove('hidden');

        // تحميل البيانات من API
        console.log("📡 Loading profile from API...");
        getProfileData(doctorProfile.doctorId)
            .then(profileData => {
                console.log("✅ Profile data loaded:", profileData);
                
                // Update doctorProfile with API data
                doctorProfile.doctorId = profileData.doctorId;
                doctorProfile.name = profileData.doctorName || profileData.name;
                doctorProfile.specialty = profileData.specialtyName || "Not specified";
                doctorProfile.specialtyName = profileData.specialtyName || "Not specified";
                doctorProfile.specialtyId = profileData.specialtyId;
                doctorProfile.certificate = profileData.certificate || "Not specified";
                doctorProfile.city = profileData.doctorCity || "Not specified";
                doctorProfile.phone = profileData.doctorPhone || "Not specified";
                doctorProfile.email = profileData.doctorEmail || "Not specified";
                doctorProfile.nationalNumber = profileData.nationalNumber;
                doctorProfile.licenseNumber = profileData.licenseNumber || "Not specified";
                doctorProfile.consultationFee = profileData.doctorPrice || 0;
                doctorProfile.rating = profileData.averageRating || 0;
                doctorProfile.averageRating = profileData.averageRating || 0;
                doctorProfile.clinicId = profileData.clinicId;
                doctorProfile.clinicName = profileData.clinicName || "Not specified";
                doctorProfile.clinicPhone = profileData.clinicPhone || "Not specified";
                doctorProfile.clinicEmail = profileData.clinicEmail || "Not specified";
                doctorProfile.clinicAddress = profileData.clinicLocation || "Not specified";
                doctorProfile.workingDays = profileData.workingDays;
                doctorProfile.workingHours = profileData.workingHours;

                console.log("✅ Doctor profile updated");

                // Load default data structure
                loadDefaultData();
                renderClinics();
                
                // ===== FETCH APPOINTMENTS FROM API =====
                console.log("📡 Loading appointments from API...");
                getDoctorAppointments()
                    .then(apiAppointments => {
                        console.log("✅ Appointments from API:", apiAppointments);
                        
                        // Convert API format to local format
                        appointments = apiAppointments.map((apt, index) => {
                            // Use patientName if available, otherwise generate a placeholder
                            const patientName = apt.patientName || `Patient ${apt.appointmentId}`;
                            
                            // Find or create patient based on patientName
                            let patient = patients.find(p => p.name.toLowerCase() === patientName.toLowerCase());
                            
                            if (!patient) {
                                // Create a new patient if not found
                                patient = {
                                    id: `API_P${apt.appointmentId}`,
                                    name: patientName,
                                    age: apt.patientAge || 0,
                                    gender: apt.patientGender || 'Unknown',
                                    phone: apt.patientPhone || '',
                                    city: apt.patientCity || '',
                                    married: apt.patientMarried || false,
                                    bloodType: apt.patientBloodtype || 'Unknown',
                                    height: apt.patientHeight || null,
                                    weight: apt.patientWeight || null,
                                    allergies: 'None',
                                    chronic: 'None',
                                    lastVisit: apt.appointmentDate,
                                    notes: `Patient from appointment ID: ${apt.appointmentId}`,
                                    visits: [],
                                    medicalHistory: {
                                        hypertension: apt.patientHypertension || false,
                                        diabetes: apt.patientDiabetes || false,
                                        anaemia: apt.patientAnaemia || false,
                                        chestPain: false,
                                        sodium: false,
                                        platelets: false
                                    }
                                };
                                patients.push(patient);
                                console.log("✨ New patient created:", patient);
                            }
                            
                            // Convert time format: "01:00 AM" → "01:00"
                            const timeFormatted = apt.appointmentTime.replace(' AM', '').replace(' PM', '');
                            
                            return {
                                id: apt.appointmentId,
                                patientId: patient.id,
                                patientName: patientName,
                                date: apt.appointmentDate,
                                time: timeFormatted,
                                status: apt.status.toLowerCase() === 'pending' ? 'pending' : 'confirmed',
                                notes: '',
                                clinicName: apt.clinicName,
                                durationMinutes: apt.durationMinutes,
                                price: apt.price
                            };
                        });
                        
                        console.log("🔄 Converted appointments to local format:", appointments);
                        updateAllData();
                    })
                    .catch(error => {
                        console.error("⚠️ Failed to fetch appointments from API:", error);
                        updateAllData();
                    });

                
                // Show dashboard
                const dashboardPage = document.getElementById('dashboardPage');
                if (dashboardPage) dashboardPage.classList.remove('hidden');
                
                const navBtns = document.querySelectorAll('.nav-btn');
                if (navBtns && navBtns[0]) {
                    navBtns[0].classList.add('active');
                }
                
                showToast(`🎉 Welcome back Dr. ${doctorProfile.name}!`, 'success');
            })
            .catch(profileError => {
                console.error("⚠️ Could not load profile:", profileError);
                showToast('❌ Session expired. Please login again', 'error');
                
                // Clear invalid session
                localStorage.removeItem("authToken");
                localStorage.removeItem("doctorId");
                
                // Show login
                showLogin();
            });

    } else {
        // لو مفيش token → افتح login
        console.log("👤 No session - Showing login page");
        showLogin();
    }
});


        // Toast Notifications