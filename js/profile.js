
        function showEditProfileModal() {
            console.log("📝 Opening edit profile modal with data:", doctorProfile);
            
            document.getElementById('editDoctorName').value = doctorProfile.name || '';
            document.getElementById('editDoctorPhone').value = doctorProfile.phone || '';
            document.getElementById('editDoctorEmail').value = doctorProfile.email || '';
            document.getElementById('editDoctorCity').value = doctorProfile.city || '';
            document.getElementById('editNationalId').value = doctorProfile.nationalNumber || '';
            
            // Use specialty or specialtyName
            const specialtyValue = doctorProfile.specialty || doctorProfile.specialtyName || '';
            document.getElementById('editDoctorSpecialty').value = specialtyValue;
            
            document.getElementById('editProfileCertificate').value = doctorProfile.certificate || '';
            document.getElementById('editProfileLicense').value = doctorProfile.licenseNumber || '';
            
            document.getElementById('editClinicName').value = doctorProfile.clinicName || '';
            document.getElementById('editClinicPhone').value = doctorProfile.clinicPhone || '';
            document.getElementById('editClinicAddress').value = doctorProfile.clinicLocation || doctorProfile.clinicAddress || '';
            document.getElementById('editClinicEmail').value = doctorProfile.clinicEmail || '';
            
            document.getElementById('editCurrentPassword').value = '';
            document.getElementById('editNewPassword').value = '';
            document.getElementById('editConfirmPassword').value = '';
            
            // Uncheck all working days first
            document.querySelectorAll('.editWorkingDay').forEach(cb => cb.checked = false);
            
            // Check the selected working days
            if (doctorProfile.workingDays && doctorProfile.workingDays !== 'Not specified' && doctorProfile.workingDays !== null) {
                const daysArray = Array.isArray(doctorProfile.workingDays) 
                    ? doctorProfile.workingDays 
                    : doctorProfile.workingDays.split(', ');
                const daysMap = {
                    'Sat': 'editWorkingDay_Sat',
                    'Sun': 'editWorkingDay_Sun',
                    'Mon': 'editWorkingDay_Mon',
                    'Tue': 'editWorkingDay_Tue',
                    'Wed': 'editWorkingDay_Wed',
                    'Thu': 'editWorkingDay_Thu',
                    'Fri': 'editWorkingDay_Fri'
                };
                daysArray.forEach(day => {
                    const checkboxId = daysMap[day.trim()];
                    if (checkboxId && document.getElementById(checkboxId)) {
                        document.getElementById(checkboxId).checked = true;
                    }
                });
            }
            
            // Set working hours time inputs
            if (doctorProfile.workingHours && doctorProfile.workingHours !== 'Not specified' && doctorProfile.workingHours !== null) {
                const timeParts = doctorProfile.workingHours.split(' - ');
                if (timeParts.length === 2) {
                    const startTimeEl = document.getElementById('editWorkingHoursStart');
                    const endTimeEl = document.getElementById('editWorkingHoursEnd');
                    if (startTimeEl) startTimeEl.value = timeParts[0].trim();
                    if (endTimeEl) endTimeEl.value = timeParts[1].trim();
                }
            } else {
                document.getElementById('editWorkingHoursStart').value = '09:00';
                document.getElementById('editWorkingHoursEnd').value = '18:00';
            }
            
            // Set consultation fee - use either consultationFee or doctorPrice
            const consultationFeeEl = document.getElementById('editConsultationFee');
            if (consultationFeeEl) {
                consultationFeeEl.value = doctorProfile.consultationFee || doctorProfile.doctorPrice || '';
            }
            
            // Set profile photo preview if exists
            if (doctorProfile.photo || doctorProfile.doctorImage) {
                const photoUrl = doctorProfile.photo || doctorProfile.doctorImage;
                document.getElementById('profilePhotoPreview').style.backgroundImage = `url(${photoUrl})`;
            }
            
            openModal('editProfileModal');
        }

        
        function previewProfilePhoto() {
            const fileInput = document.getElementById('profilePhotoInput');
            const preview = document.getElementById('profilePhotoPreview');
            
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.style.backgroundImage = `url(${e.target.result})`;
                    preview.style.backgroundSize = 'cover';
                    preview.style.backgroundPosition = 'center';
                    preview.textContent = '';
                    doctorProfile.photo = e.target.result;
                };
                reader.readAsDataURL(fileInput.files[0]);
            }
        }

        
        // Update Profile Page
        function updateProfilePage() {
            console.log("🔄 Updating profile page with data:", doctorProfile);
            console.log("📌 doctorProfile.doctorId:", doctorProfile.doctorId);
            console.log("📌 doctorProfile.name:", doctorProfile.name);
            console.log("📌 doctorProfile.email:", doctorProfile.email);
            console.log("📌 doctorProfile.clinicName:", doctorProfile.clinicName);
            
            // ===== BASIC INFO =====
            const name = doctorProfile.name || "Unknown";
            const specialty = doctorProfile.specialty || (doctorProfile.specialtyName ? doctorProfile.specialtyName : "Not specified");
            const rating = doctorProfile.rating || doctorProfile.averageRating || "0";
            
            console.log("📍 Displaying name:", name);
            console.log("📍 Displaying specialty:", specialty);
            
            document.getElementById('doctorName').textContent = name;
            document.getElementById('doctorSpecialty').textContent = specialty;
            document.getElementById('doctorRating').textContent = rating;
            
            // Update profile avatar with photo if available
            const profileAvatar = document.querySelector('.profile-avatar');
            console.log("🖼️ Profile avatar element:", profileAvatar);
            console.log("🖼️ doctorProfile.photo:", doctorProfile.photo);
            console.log("🖼️ doctorProfile.doctorImage:", doctorProfile.doctorImage);
            
            if (profileAvatar) {
                if (doctorProfile.photo) {
                    console.log("✅ Setting photo from doctorProfile.photo");
                    profileAvatar.style.backgroundImage = `url(${doctorProfile.photo})`;
                    profileAvatar.style.backgroundSize = 'cover';
                    profileAvatar.style.backgroundPosition = 'center';
                    profileAvatar.textContent = '';
                } else if (doctorProfile.doctorImage) {
                    console.log("✅ Setting photo from doctorProfile.doctorImage");
                    profileAvatar.style.backgroundImage = `url(${doctorProfile.doctorImage})`;
                    profileAvatar.style.backgroundSize = 'cover';
                    profileAvatar.style.backgroundPosition = 'center';
                    profileAvatar.textContent = '';
                } else {
                    console.log("❌ No photo available");
                }
            }
            
            // ===== DOCTOR INFORMATION SECTION =====
            document.getElementById('doctorPhone').textContent = doctorProfile.phone || "Not specified";
            document.getElementById('doctorEmail').textContent = doctorProfile.email || "Not specified";
            document.getElementById('doctorCity').textContent = doctorProfile.city || "Not specified";
            
            // ===== CLINIC INFORMATION SECTION =====
            document.getElementById('clinicName').textContent = doctorProfile.clinicName || "Not specified";
            document.getElementById('clinicAddress').textContent = doctorProfile.clinicLocation || doctorProfile.clinicAddress || "Not specified";
            document.getElementById('clinicPhone').textContent = doctorProfile.clinicPhone || "Not specified";
            document.getElementById('clinicEmail').textContent = doctorProfile.clinicEmail || "Not specified";
            
            // ===== PROFESSIONAL DETAILS SECTION =====
            document.getElementById('profileSpecialty').textContent = specialty;
            document.getElementById('profileCertificate').textContent = doctorProfile.certificate || "Not specified";
            document.getElementById('profileLicense').textContent = doctorProfile.licenseNumber || "Not specified";
            
            // ===== STATISTICS SECTION =====
            document.getElementById('profileTotalPatients').textContent = patients.length || "0";
            document.getElementById('profileRating').textContent = rating;
            document.getElementById('profileAppointments').textContent = appointments.length || "0";
            
            // ===== WORKING HOURS SECTION =====
            let workingDaysDisplay = doctorProfile.workingDays || 'Not specified';
            if (Array.isArray(doctorProfile.workingDays)) {
                workingDaysDisplay = doctorProfile.workingDays.join(', ');
            }
            document.getElementById('profileWorkingDays').textContent = workingDaysDisplay;
            
            let workingHoursDisplay = doctorProfile.workingHours || 'Not specified';
            document.getElementById('profileWorkingHours').textContent = workingHoursDisplay;
            
            // ===== CONSULTATION FEE =====
            const consultationFee = doctorProfile.consultationFee || doctorProfile.doctorPrice || 0;
            document.getElementById('profileConsultationFee').textContent = consultationFee ? `${consultationFee} EGP` : 'Not specified';
            
            // ===== MONTHLY STATS =====
            document.getElementById('statsTotalPatients').textContent = patients.length || "0";
            
            const thisMonth = new Date().toISOString().substr(0, 7);
            const monthAppointments = appointments.filter(a => a.date && a.date.startsWith(thisMonth));
            document.getElementById('statsMonthAppointments').textContent = monthAppointments.length || "0";
            
            console.log("✅ Profile page updated successfully");
        }

        // Save Profile
        async function saveProfile(e) {
            e.preventDefault();
            
            console.log("💾 Starting profile save...");
            console.log("👤 doctorProfile.doctorId:", doctorProfile.doctorId);
            
            // Validate we have a doctor ID
            if (!doctorProfile.doctorId) {
                showToast('❌ Error: Doctor ID not found', 'error');
                console.error("❌ Cannot save profile without doctorId");
                return;
            }
            
            const newPassword = document.getElementById('editNewPassword').value;
            const confirmPassword = document.getElementById('editConfirmPassword').value;
            const currentPassword = document.getElementById('editCurrentPassword').value;

            // NOTE: Backend REQUIRES CurrentPassword and NewPassword for ANY profile update
            // So we need to ask for current password at minimum
            if (!currentPassword) {
                showToast('⚠️ Please enter your current password to update profile', 'error');
                document.getElementById('editCurrentPassword').focus();
                return;
            }

            // Validate password change if new password is entered
            if (newPassword || confirmPassword) {
                if (newPassword !== confirmPassword) {
                    showToast('❌ New passwords do not match', 'error');
                    return;
                }
                if (newPassword.length < 6) {
                    showToast('❌ New password must be at least 6 characters', 'error');
                    return;
                }
            } else {
                // If no new password provided, we'll send the same password (no actual change)
                console.log("ℹ️ No new password provided - keeping current password");
            }

            // Get button for UI feedback
            const saveBtn = document.querySelector('#editProfileModal button[type="submit"]');
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = '⏳ Saving...';
            }

            try {
                // Create FormData with exact API field names
                const formData = new FormData();
                
                // Personal Information
                formData.append('DoctorName', document.getElementById('editDoctorName').value);
                formData.append('DoctorPhone', document.getElementById('editDoctorPhone').value);
                formData.append('DoctorEmail', document.getElementById('editDoctorEmail').value);
                formData.append('DoctorCity', document.getElementById('editDoctorCity').value);
                
                // Professional Details
                formData.append('Certificate', document.getElementById('editProfileCertificate').value);
                formData.append('DoctorPrice', document.getElementById('editConsultationFee').value || 0);
                
                // Specialty (SpecialtyId if we have it, otherwise use the value)
                const specialtyEl = document.getElementById('editDoctorSpecialty');
                if (specialtyEl && doctorProfile.specialtyId) {
                    formData.append('SpecialtyId', doctorProfile.specialtyId);
                }
                
                // Clinic Information
                formData.append('ClinicName', document.getElementById('editClinicName').value);
                formData.append('ClinicPhone', document.getElementById('editClinicPhone').value);
                formData.append('ClinicEmail', document.getElementById('editClinicEmail').value);
                formData.append('ClinicLocation', document.getElementById('editClinicAddress').value);
                
                // Working Hours/Days
                const startTimeEl = document.getElementById('editWorkingHoursStart');
                const endTimeEl = document.getElementById('editWorkingHoursEnd');
                if (startTimeEl && endTimeEl && startTimeEl.value && endTimeEl.value) {
                    formData.append('WorkingHours', `${startTimeEl.value} - ${endTimeEl.value}`);
                }
                
                // Working Days
                const daysMap = {
                    'Sat': 'editWorkingDay_Sat',
                    'Sun': 'editWorkingDay_Sun',
                    'Mon': 'editWorkingDay_Mon',
                    'Tue': 'editWorkingDay_Tue',
                    'Wed': 'editWorkingDay_Wed',
                    'Thu': 'editWorkingDay_Thu',
                    'Fri': 'editWorkingDay_Fri'
                };
                const selectedDays = Object.entries(daysMap)
                    .filter(([_, id]) => document.getElementById(id) && document.getElementById(id).checked)
                    .map(([day]) => day);
                if (selectedDays.length > 0) {
                    formData.append('WorkingDays', selectedDays.join(', '));
                }
                
                // Password fields - REQUIRED by Backend
                // Backend requires both CurrentPassword and NewPassword for any profile update
                formData.append('CurrentPassword', currentPassword);
                
                // If user provided new password, send it; otherwise send current password (no change)
                const passwordToSend = newPassword || currentPassword;
                formData.append('NewPassword', passwordToSend);
                
                console.log("📋 FormData prepared for API");
                console.log("🔐 Password fields: CurrentPassword=[present], NewPassword=[present]");
                
                // Send to API
                const updateResponse = await apiUpdateProfile(doctorProfile.doctorId, formData);
                console.log("✅ Profile updated response:", updateResponse);
                
                // Update local doctorProfile with new values
                doctorProfile.name = document.getElementById('editDoctorName').value;
                doctorProfile.phone = document.getElementById('editDoctorPhone').value;
                doctorProfile.email = document.getElementById('editDoctorEmail').value;
                doctorProfile.city = document.getElementById('editDoctorCity').value;
                doctorProfile.certificate = document.getElementById('editProfileCertificate').value;
                doctorProfile.consultationFee = parseInt(document.getElementById('editConsultationFee').value) || 0;
                doctorProfile.clinicName = document.getElementById('editClinicName').value;
                doctorProfile.clinicPhone = document.getElementById('editClinicPhone').value;
                doctorProfile.clinicEmail = document.getElementById('editClinicEmail').value;
                doctorProfile.clinicAddress = document.getElementById('editClinicAddress').value;
                doctorProfile.clinicLocation = document.getElementById('editClinicAddress').value;
                
                if (selectedDays.length > 0) {
                    doctorProfile.workingDays = selectedDays.join(', ');
                }
                
                if (startTimeEl && endTimeEl && startTimeEl.value && endTimeEl.value) {
                    doctorProfile.workingHours = `${startTimeEl.value} - ${endTimeEl.value}`;
                }
                
                console.log("✅ Local doctorProfile updated");
                
                closeModal('editProfileModal');
                showToast('✅ Profile updated successfully!', 'success', 'Changes saved to server');
                updateProfilePage();
                
                // Clear password fields for security
                document.getElementById('editCurrentPassword').value = '';
                document.getElementById('editNewPassword').value = '';
                document.getElementById('editConfirmPassword').value = '';
                
            } catch (error) {
                console.error("❌ Profile save error:", error);
                const safeMessage = String(error?.message || 'Failed to update profile').substring(0, 150);
                showToast(`❌ ${safeMessage}`, 'error', 'Update failed');
            } finally {
                // Re-enable button
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = 'Save Changes';
                }
            }
        }
