 // Auth Functions
        
        // Helper to show dashboard and main UI
        function showMainUI() {
            console.log("🎨 Showing main UI...");
            // Hide all pages
            document.querySelectorAll('[id$="Page"]').forEach(p => {
                if (p) p.classList.add('hidden');
            });
            
            // Show main app and dashboard
            const mainApp = document.getElementById('mainApp');
            if (mainApp) mainApp.classList.remove('hidden');
            
            // Show dashboard
            const dashboardPage = document.getElementById('dashboardPage');
            if (dashboardPage) dashboardPage.classList.remove('hidden');
            
            // Set active nav button
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            const navBtns = document.querySelectorAll('.nav-btn');
            if (navBtns && navBtns[0]) {
                navBtns[0].classList.add('active');
            }
            
            console.log("✅ Main UI shown");
        }
        
        function showLogin() {
            document.getElementById('loginPage').classList.remove('hidden');
            document.getElementById('signupPage').classList.add('hidden');
            document.getElementById('mainApp').classList.add('hidden');
        }

        function showSignup() {
            document.getElementById('loginPage').classList.add('hidden');
            document.getElementById('signupPage').classList.remove('hidden');
            document.getElementById('mainApp').classList.add('hidden');
        }

        function handleSignup(e) {
            e.preventDefault();
            handleDoctorSignup();
        }

        function handleLogin(e) {
            if (e) e.preventDefault(); // Extra protection

            try {
                const emailInput = document.getElementById('loginEmail');
                const passwordInput = document.getElementById('loginPassword');
                
                if (!emailInput || !passwordInput) {
                    console.error("❌ Login form inputs not found");
                    showToast('❌ Form error', 'error');
                    return;
                }

                const email = emailInput.value?.trim();
                const password = passwordInput.value?.trim();

                // Validate inputs
                if (!email || !password) {
                    showToast('❌ Please enter email and password', 'error');
                    return;
                }

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showToast('❌ Invalid email address', 'error');
                    return;
                }

                // Get button safely
                const loginBtn = document.querySelector('#loginForm button[type="submit"]');
                if (!loginBtn) {
                    console.error("❌ Login button not found");
                    return;
                }

                // Disable button during request
                loginBtn.disabled = true;
                loginBtn.textContent = '⏳ Verifying...';

                // Call API with error boundary
                apiLogin(email, password)
                    .then(response => {
                        console.log("✅ Login response:", response);
                        
                        // Extract doctorId from response - check all possible paths
                        const doctorId = response.data?.doctor?.id || response.data?.doctorId || response.doctorId || 1;
                        console.log("🎯 Extracted doctorId from login:", doctorId);
                        doctorProfile.doctorId = doctorId;
                        
                        // 💾 Save doctorId to localStorage for session persistence
                        localStorage.setItem("doctorId", doctorId);
                        console.log("💾 Saved doctorId to localStorage:", doctorId);

                        isLoggedIn = true;

                        // Hide all pages first safely
                        const allPages = document.querySelectorAll('[id$="Page"]');
                        allPages.forEach(p => {
                            if (p) p.classList.add('hidden');
                        });
                        
                        // Show main app
                        const mainApp = document.getElementById('mainApp');
                        const loginPage = document.getElementById('loginPage');
                        if (mainApp) mainApp.classList.remove('hidden');
                        if (loginPage) loginPage.classList.add('hidden');
                        
                        loadDefaultData();
                        
                        // Verify we have a valid doctor ID
                        console.log("🔐 Doctor ID for profile fetch:", doctorId);
                        if (!doctorId || doctorId < 1) {
                            console.error("❌ Invalid doctor ID:", doctorId);
                            showToast('Warning: Could not load profile', 'warning');
                        }
                        
                        // Fetch full profile data from API
                        getProfileData(doctorId)
                            .then(profileData => {
                                console.log("✅ Full profile data loaded:", profileData);
                                console.log("📌 ProfileData ID:", profileData?.doctorId);
                                
                                // Validate we got real data
                                if (!profileData || !profileData.doctorId) {
                                    console.error("❌ API returned invalid profile data - no doctorId");
                                    throw new Error("Invalid profile data from server");
                                }
                                
                                // Check if this is default data (same as ID=1 which we don't want)
                                if (doctorId !== 1 && profileData.doctorId === 1) {
                                    console.error("❌ API returned ID=1 data instead of ID=" + doctorId);
                                    throw new Error("API returned wrong user data");
                                }
                                
                                console.log("✅ Valid profile data received for ID:", profileData.doctorId);
                                
                                // Update doctorProfile with API data - mapping all fields correctly
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
                                doctorProfile.photo = profileData.doctorImage || null;
                                doctorProfile.doctorImage = profileData.doctorImage;
                                
                                console.log("🖼️ Photo from API:", profileData.doctorImage);
                                
                                // Clinic Information
                                doctorProfile.clinicId = profileData.clinicId;
                                doctorProfile.clinicName = profileData.clinicName || "Not specified";
                                doctorProfile.clinicPhone = profileData.clinicPhone || "Not specified";
                                doctorProfile.clinicEmail = profileData.clinicEmail || "Not specified";
                                doctorProfile.clinicAddress = profileData.clinicLocation || "Not specified";                        
                                // Working Details
                                doctorProfile.workingDays = profileData.workingDays;
                                doctorProfile.workingHours = profileData.workingHours;
                                
                                console.log("✅ doctorProfile updated:", doctorProfile);
                                console.log("📸 Photo in updated doctorProfile:", doctorProfile.photo);
                                
                                // ===== FETCH APPOINTMENTS FROM API =====
                                console.log("📡 Loading appointments from API...");
                                getDoctorAppointments()
                                    .then(apiAppointments => {
                                        console.log("✅ Appointments from API:", apiAppointments);
                                        
                                        // Convert API format to local format
                                        appointments = apiAppointments.map((apt, index) => {
                                            // Find or create patient based on patientName
                                            let patient = patients.find(p => p.name.toLowerCase() === apt.patientName.toLowerCase());
                                            
                                            if (!patient) {
                                                // Create a new patient if not found
                                                patient = {
                                                    id: `API_P${apt.appointmentId}`,
                                                    name: apt.patientName,
                                                    age: 0,
                                                    gender: 'Unknown',
                                                    phone: '',
                                                    bloodType: 'Unknown',
                                                    allergies: 'None',
                                                    chronic: 'None',
                                                    lastVisit: apt.appointmentDate,
                                                    notes: `Patient from appointment ID: ${apt.appointmentId}`,
                                                    visits: []
                                                };
                                                patients.push(patient);
                                                console.log("✨ New patient created:", patient);
                                            }
                                            
                                            // Convert time format: "01:00 AM" → "01:00"
                                            const timeFormatted = apt.appointmentTime.replace(' AM', '').replace(' PM', '');
                                            
                                            return {
                                                id: apt.appointmentId,
                                                patientId: patient.id,
                                                patientName: apt.patientName,
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
                                        
                                        // Now update all UI with real data
                                        updateAllData();
                                    })
                                    .catch(error => {
                                        console.error("⚠️ Failed to fetch appointments from API:", error);
                                        // Update UI with profile data only if appointments fail
                                        updateAllData();
                                    });

                                
                                // Show dashboard
                                const dashboardPage = document.getElementById('dashboardPage');
                                if (dashboardPage) dashboardPage.classList.remove('hidden');
                                
                                const navBtns = document.querySelectorAll('.nav-btn');
                                if (navBtns && navBtns[0]) {
                                    navBtns[0].classList.add('active');
                                }
                                
                                // Clear form
                                const loginForm = document.getElementById('loginForm');
                                if (loginForm) loginForm.reset();
                                
                                showToast(`🎉 Welcome Dr. ${doctorProfile.name}!`, 'success', 'Profile loaded successfully');
                            })
                            .catch(profileError => {
                                console.error("⚠️ Could not load full profile, using basic data:", profileError);
                                // Continue even if profile fetch fails
                                // Update all UI with basic data
                                updateAllData();

                                
                                const dashboardPage = document.getElementById('dashboardPage');
                                if (dashboardPage) dashboardPage.classList.remove('hidden');
                                
                                const navBtns = document.querySelectorAll('.nav-btn');
                                if (navBtns && navBtns[0]) {
                                    navBtns[0].classList.add('active');
                                }
                                
                                const loginForm = document.getElementById('loginForm');
                                if (loginForm) loginForm.reset();
                                
                                showToast(`🎉 Welcome Dr. ${doctorProfile.name}!`, 'success', 'Login successful - Profile loading...');
                            });
                    })
                    .catch(error => {
                        console.error("❌ Login error:", error);
                        // SAFE error display - guaranteed no file paths
                        const safeMessage = String(error?.message || 'Login error occurred').substring(0, 100);
                        showToast(`❌ ${safeMessage}`, 'error', 'Login failed');
                    })
                    .finally(() => {
                        // Re-enable button safely
                        if (loginBtn) {
                            loginBtn.disabled = false;
                            loginBtn.textContent = 'Sign In';
                        }
                    });

            } catch(err) {
                // Catch any unexpected errors
                console.error("🔴 LOGIN CRITICAL ERROR:", err);
                showToast('❌ Unexpected login error', 'error');
                
                // Ensure button is re-enabled
                const loginBtn = document.querySelector('#loginForm button[type="submit"]');
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Sign In';
                }
            }
        }

 async function handleDoctorSignup(e) {
    // Prevent form from submitting normally
    if (e) e.preventDefault();
    
    // Get all form values from HTML
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const city = document.getElementById('signupGovernorate').value.trim();
    const specialty = document.getElementById('signupSpecialty').value.trim();
    const certificate = document.getElementById('signupCertificate').value.trim();
    const licenseNumber = document.getElementById('signupLicense').value.trim();
    const nationalId = document.getElementById('signupNationalId').value.trim();

    // Validate required fields
    if (!name || !email || !password || !specialty || !certificate || !licenseNumber || !nationalId) {
        showToast('❌ Please fill all required fields', 'error');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('❌ Invalid email address', 'error');
        return;
    }

    // Validate password length
    if (password.length < 6) {
        showToast('❌ Password must be at least 6 characters', 'error');
        return;
    }

    // Get button for UI feedback
    const signupBtn = document.querySelector('#signupForm button[type="submit"]');

    try {
        // Create form data with exact API field names
        const formData = {
            FullName: name,
            Email: email,
            Password: password,
            Phone: phone,
            City: city,
            SpecialtyName: specialty,
            Certificate: certificate,
            LicenseNumber: licenseNumber,
            NationalNumber: parseInt(nationalId) || 0
        };

        console.log("📋 Registration data prepared:", formData);

        // Disable button during request
        if (signupBtn) {
            signupBtn.disabled = true;
            signupBtn.innerHTML = '⏳ Creating account...';
        }

        // Send registration to API using basic signup (no photo/clinic)
        const registrationResponse = await apiSignup(formData);
        console.log("✅ Registration response received:", registrationResponse);

        // Check for explicit error fields
        if (registrationResponse.error) {
            throw new Error(registrationResponse.error);
        }
        if (registrationResponse.message && registrationResponse.message.toLowerCase().includes('error')) {
            throw new Error(registrationResponse.message);
        }

        // Show success message
        showToast(`🎉 Account created successfully!`, 'success', 'Logging you in...');

        // Extract doctor ID from registration response
        let doctorId = registrationResponse.data?.doctor?.id 
            || registrationResponse.data?.doctorId 
            || registrationResponse.doctorId 
            || registrationResponse.data?.id 
            || registrationResponse.id 
            || registrationResponse.userId
            || registrationResponse.data?.data?.doctorId
            || registrationResponse.data?.data?.id
            || registrationResponse.result?.doctorId
            || registrationResponse.result?.id;
        
        console.log("🎯 Extracted doctorId:", doctorId);
        
        if (!doctorId) {
            console.error("⚠️ WARNING: Doctor ID is missing! Response:", registrationResponse);
            showToast('⚠️ Doctor ID not received from server', 'warning');
            doctorId = null;
        }
        
        if (doctorId === 1) {
            console.warn("⚠️ WARNING: Doctor ID defaulting to 1!");
        }

        // Update local doctorProfile with registration data
        doctorProfile = {
            doctorId: doctorId,
            name: name,
            specialty: specialty,
            certificate: certificate,
            email: email,
            phone: phone,
            nationalNumber: nationalId,
            licenseNumber: licenseNumber,
            city: city,
            rating: 0,
            specialtyId: null,
            workingDays: null,
            workingHours: null,
            consultationFee: 500,
            photo: null,
            doctorImage: null
        };

        console.log("👤 Local doctorProfile created:", doctorProfile);
        
        console.log("🔐 Attempting auto-login with registered email...");
        
        // Automatically log in with registered credentials
        const loginResponse = await apiLogin(email, password);
        console.log("✅ Auto-login response:", loginResponse);

        // Extract token - check multiple paths
        const token = loginResponse.token || loginResponse.access_token || loginResponse.data?.token;
        
        if (token) {
            localStorage.setItem('authToken', token);
            console.log("🔑 Token stored in authToken after login");
        } else {
            console.warn("⚠️ No token in login response, checking localStorage");
            const storedToken = localStorage.getItem('authToken');
            console.log("📌 Stored token exists:", !!storedToken);
        }

        isLoggedIn = true;

        // Hide all pages first
        const allPages = document.querySelectorAll('[id$="Page"]');
        allPages.forEach(p => {
            if (p) p.classList.add('hidden');
        });
        
        // Show main app
        const mainApp = document.getElementById('mainApp');
        const signupPage = document.getElementById('signupPage');
        if (mainApp) mainApp.classList.remove('hidden');
        if (signupPage) signupPage.classList.add('hidden');
        
        loadDefaultData();
        
        // Update Profile Page with local data first
        updateProfilePage();
        
        // Show dashboard immediately with local data FIRST
        const dashboardPage = document.getElementById('dashboardPage');
        if (dashboardPage) dashboardPage.classList.remove('hidden');
        
        const navBtns = document.querySelectorAll('.nav-btn');
        if (navBtns && navBtns[0]) {
            navBtns[0].classList.add('active');
        }
        
        // Clear form
        document.getElementById('signupForm').reset();
        
        showToast(`🎉 Welcome Dr. ${doctorProfile.name}!`, 'success', 'Registration complete');

        // Fetch full profile data from API in background (do NOT block dashboard)
        console.log("📡 Fetching full profile data for new doctorId:", doctorId);
        
        if (!doctorId || doctorId < 1) {
            console.error("❌ Invalid doctor ID after registration:", doctorId);
            console.warn("⚠️ Skipping profile fetch - will use local data");
            return;
        }
        
        getProfileData(doctorId)
            .then(profileData => {
                console.log("✅ Full profile data loaded after registration:", profileData);
                
                // Validate we got real data
                if (!profileData || !profileData.doctorId) {
                    console.error("❌ API returned invalid profile data - no doctorId");
                    throw new Error("Invalid profile data");
                }
                
                // Check if this is default data for ID=1
                if (doctorId !== 1 && profileData.doctorId === 1) {
                    console.error("❌ API returned ID=1 data instead of ID=" + doctorId);
                    throw new Error("API returned wrong user data - got ID=1 instead");
                }
                
                console.log("✅ Valid profile data received for ID:", profileData.doctorId);
                
                // Update doctorProfile with API data
                doctorProfile.doctorId = profileData.doctorId;
                doctorProfile.name = profileData.doctorName || name;
                doctorProfile.specialty = profileData.specialtyName || specialty;
                doctorProfile.specialtyName = profileData.specialtyName || specialty;
                doctorProfile.specialtyId = profileData.specialtyId;
                doctorProfile.certificate = profileData.certificate || certificate;
                doctorProfile.city = profileData.doctorCity || city;
                doctorProfile.phone = profileData.doctorPhone || phone;
                doctorProfile.email = profileData.doctorEmail || email;
                doctorProfile.nationalNumber = profileData.nationalNumber || nationalId;
                doctorProfile.licenseNumber = profileData.licenseNumber || licenseNumber;
                doctorProfile.consultationFee = profileData.doctorPrice || 500;
                doctorProfile.rating = profileData.averageRating || 0;
                doctorProfile.averageRating = profileData.averageRating || 0;
                doctorProfile.photo = profileData.doctorImage || null;
                doctorProfile.doctorImage = profileData.doctorImage;
                
                // Working Details
                doctorProfile.workingDays = profileData.workingDays;
                doctorProfile.workingHours = profileData.workingHours;
                
                console.log("✅ doctorProfile updated with API data:", doctorProfile);
                
                // ===== FETCH APPOINTMENTS FROM API =====
                console.log("📡 Loading appointments from API...");
                getDoctorAppointments()
                    .then(apiAppointments => {
                        console.log("✅ Appointments from API:", apiAppointments);
                        
                        // Convert API format to local format
                        appointments = apiAppointments.map((apt, index) => {
                            // Find or create patient based on patientName
                            let patient = patients.find(p => p.name.toLowerCase() === apt.patientName.toLowerCase());
                            
                            if (!patient) {
                                // Create a new patient if not found
                                patient = {
                                    id: `API_P${apt.appointmentId}`,
                                    name: apt.patientName,
                                    age: 0,
                                    gender: 'Unknown',
                                    phone: '',
                                    bloodType: 'Unknown',
                                    allergies: 'None',
                                    chronic: 'None',
                                    lastVisit: apt.appointmentDate,
                                    notes: `Patient from appointment ID: ${apt.appointmentId}`,
                                    visits: []
                                };
                                patients.push(patient);
                                console.log("✨ New patient created:", patient);
                            }
                            
                            // Convert time format: "01:00 AM" → "01:00"
                            const timeFormatted = apt.appointmentTime.replace(' AM', '').replace(' PM', '');
                            
                            return {
                                id: apt.appointmentId,
                                patientId: patient.id,
                                patientName: apt.patientName,
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
                        updateProfilePage();
                    });

            })
            .catch(profileError => {
                console.warn("⚠️ Could not load profile from server, using local data:", profileError.message);
                console.log("📌 Local doctorProfile being used:", doctorProfile);
            });

    } catch (error) {
        console.error("❌❌❌ SIGNUP ERROR CAUGHT ❌❌❌");
        console.error("Error message:", error?.message);
        console.error("Full error object:", error);
        console.error("Stack trace:", error?.stack);
        
        // Extract safe error message
        const errorMsg = String(error?.message || error || 'Registration failed').substring(0, 150);
        showToast(`❌ ${errorMsg}`, 'error', 'Registration failed');
        
        // Make sure button is re-enabled in catch block too
        if (signupBtn) {
            signupBtn.disabled = false;
            signupBtn.innerHTML = 'Create Account';
        }

    } finally {
        // Re-enable button
        if (signupBtn) {
            signupBtn.disabled = false;
            signupBtn.innerHTML = 'Create Account';
        }
    }
}

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                try {
                    // Call logout API if needed
                    apiLogout();
                    
                    // 🗑️ Clear session data from localStorage
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("doctorId");
                    console.log("🗑️ Session data cleared");
                    
                    isLoggedIn = false;
                    
                    // Hide all modals
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.classList.remove('active');
                    });
                    
                    // Hide all pages
                    document.querySelectorAll('[id$="Page"]').forEach(p => p.classList.add('hidden'));
                    
                    // Hide main app and show login
                    document.getElementById('mainApp').classList.add('hidden');
                    document.getElementById('loginPage').classList.remove('hidden');
                    
                    // Clear forms
                    document.getElementById('loginForm')?.reset();
                    document.getElementById('signupForm')?.reset();
                    
                    // Reset nav active state
                    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                    
                    showToast('👋 Logged out successfully', 'info');
                } catch (error) {
                    console.error("Logout error:", error);
                    // Still logout even if API fails
                    isLoggedIn = false;
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("doctorId");
                    document.getElementById('mainApp').classList.add('hidden');
                    document.getElementById('loginPage').classList.remove('hidden');
                }
            }
        }
