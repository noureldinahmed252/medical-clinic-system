
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
            
            document.getElementById('editCurrentPassword').value = '';
            document.getElementById('editNewPassword').value = '';
            document.getElementById('editConfirmPassword').value = '';
            
            // Set profile photo preview - load from API if available
            const profilePhotoPreview = document.getElementById('profilePhotoPreview');
            const fileInput = document.getElementById('profilePhotoInput');
            
            // Reset file input
            if (fileInput) {
                fileInput.value = '';
            }
            
            // Load current photo from API
            if (doctorProfile.doctorId && profilePhotoPreview) {
                console.log("📸 Loading current profile photo from API...");
                getDoctorImage(doctorProfile.doctorId)
                    .then(imageUrl => {
                        console.log("✅ Current photo loaded for preview:", imageUrl);
                        profilePhotoPreview.style.backgroundImage = `url(${imageUrl})`;
                        profilePhotoPreview.style.backgroundSize = 'cover';
                        profilePhotoPreview.style.backgroundPosition = 'center';
                        profilePhotoPreview.textContent = '';
                    })
                    .catch(error => {
                        console.warn("⚠️ Could not load current photo:", error);
                        // Show emoji if no photo
                        profilePhotoPreview.style.backgroundImage = 'none';
                        profilePhotoPreview.textContent = '👨‍⚕️';
                    });
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
                    // Don't store DataURL in doctorProfile - it will be uploaded separately to API
                    console.log("📸 Photo preview loaded, ready to upload");
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
            
            // ===== FETCH CLINICS FROM API =====
            console.log("📡 Fetching clinics from API...");
            getMyClinics()
                .then(apiClinics => {
                    console.log("✅ Clinics from API:", apiClinics);
                    
                    // Convert API format to local format
                    doctorClinics = apiClinics.map(clinic => ({
                        name: clinic.clinicName,
                        phone: clinic.clinicPhone,
                        address: clinic.location,
                        email: clinic.clinicEmail,
                        startTime: clinic.workStartTime,
                        endTime: clinic.workEndTime,
                        consultationFee: clinic.doctorPrice,
                        consultationDuration: clinic.slotDurationMinutes,
                        workingDays: clinic.workingDays
                            ? clinic.workingDays.split(',').map(day => day.trim())
                            : [],
                        clinicId: clinic.clinicId  // Store server ID
                    }));
                    
                    console.log("🔄 Converted clinics to local format:", doctorClinics);
                    renderClinics();
                })
                .catch(error => {
                    console.error("⚠️ Failed to fetch clinics from API:", error);
                    doctorClinics = [];  // Empty array if API fails
                    renderClinics();
                });
            
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
            console.log("🖼️ doctorProfile.doctorId:", doctorProfile.doctorId);
            
            if (profileAvatar && doctorProfile.doctorId) {
                // Fetch image from API using GET /api/DoctorProfile/{doctorId}/image
                console.log("📸 Fetching profile image from API...");
                getDoctorImage(doctorProfile.doctorId)
                    .then(imageUrl => {
                        console.log("✅ Profile image loaded from API:", imageUrl);
                        profileAvatar.style.backgroundImage = `url(${imageUrl})`;
                        profileAvatar.style.backgroundSize = 'cover';
                        profileAvatar.style.backgroundPosition = 'center';
                        profileAvatar.textContent = '';
                        
                        // Update doctorProfile.photo for modal preview
                        doctorProfile.photo = imageUrl;
                        doctorProfile.doctorImage = imageUrl;
                    })
                    .catch(error => {
                        console.warn("⚠️ Could not load profile image:", error);
                        // Keep default doctor emoji
                        profileAvatar.textContent = '👨‍⚕️';
                    });
            } else if (profileAvatar && !doctorProfile.doctorId) {
                console.warn("⚠️ No doctorId available for image fetch");
                profileAvatar.textContent = '👨‍⚕️';
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
            
            // ===== MONTHLY STATS =====
            document.getElementById('statsTotalPatients').textContent = patients.length || "0";
            
            const thisMonth = new Date().toISOString().substr(0, 7);
            const monthAppointments = appointments.filter(a => a.date && a.date.startsWith(thisMonth));
            document.getElementById('statsMonthAppointments').textContent = monthAppointments.length || "0";
            
            console.log("✅ Profile page updated successfully");
            
            // Render clinics is called from getMyClinics() promise chain above
            // No need to call it again here
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
                // Create object with exact API field names
                const profileData = {
                    doctorName: document.getElementById('editDoctorName').value,
                    doctorPhone: document.getElementById('editDoctorPhone').value,
                    doctorEmail: document.getElementById('editDoctorEmail').value,
                    doctorCity: document.getElementById('editDoctorCity').value,
                    currentPassword: currentPassword,
                    newPassword: newPassword || currentPassword
                };
                
                console.log("📋 Profile data prepared for API:", profileData);
                
                // Send to API directly as the field mapping
                const updateResponse = await apiRequest(`/api/DoctorProfile/${doctorProfile.doctorId}`, "PUT", profileData);
                console.log("✅ Profile updated response:", updateResponse);
                
                // Update local doctorProfile with new values
                doctorProfile.name = document.getElementById('editDoctorName').value;
                doctorProfile.phone = document.getElementById('editDoctorPhone').value;
                doctorProfile.email = document.getElementById('editDoctorEmail').value;
                doctorProfile.city = document.getElementById('editDoctorCity').value;
                doctorProfile.certificate = document.getElementById('editProfileCertificate').value;
                
                console.log("✅ Local doctorProfile updated");
                
                // ===== UPLOAD PROFILE IMAGE IF SELECTED =====
                const profilePhotoInput = document.getElementById('profilePhotoInput');
                if (profilePhotoInput && profilePhotoInput.files && profilePhotoInput.files[0]) {
                    console.log("📸 Profile image selected, uploading to API...");
                    try {
                        const imageFile = profilePhotoInput.files[0];
                        const imageResponse = await uploadDoctorProfileImage(doctorProfile.doctorId, imageFile);
                        console.log("✅ Image uploaded successfully:", imageResponse);
                        
                        // Clear the file input after successful upload
                        profilePhotoInput.value = '';
                        
                        // Refresh image from API to ensure latest version is displayed
                        getDoctorImage(doctorProfile.doctorId)
                            .then(imageUrl => {
                                doctorProfile.photo = imageUrl;
                                doctorProfile.doctorImage = imageUrl;
                                console.log("🖼️ doctorProfile.photo renewed from API:", imageUrl);
                            })
                            .catch(err => console.warn("⚠️ Could not refresh image:", err));
                    } catch (imageError) {
                        console.error("⚠️ Image upload failed (profile data saved):", imageError);
                        showToast('⚠️ Profile updated but image upload failed', 'warning', String(imageError?.message || 'Try uploading image again'));
                    }
                }
                
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
        // ===== CLINICS MANAGEMENT =====
        
        function showAddClinicModal() {
            console.log("📝 Opening add clinic modal");
            
            // Check if already at max clinics
            if (doctorClinics.length >= 3) {
                showToast('⚠️ You can only have a maximum of 3 clinics', 'warning');
                return;
            }
            
            // Reset form
            document.getElementById('clinicForm').reset();
            document.getElementById('clinicEditIndex').value = '-1';
            document.getElementById('clinicModalTitle').textContent = '➕ Add New Clinic';
            document.getElementById('deleteClinicBtn').style.display = 'none';
            document.getElementById('clinicSubmitBtn').textContent = 'Add Clinic';
            
            // Uncheck all working days
            document.querySelectorAll('.clinicWorkingDay').forEach(cb => cb.checked = false);
            
            // Set default times
            document.getElementById('clinicStartTime').value = '09:00';
            document.getElementById('clinicEndTime').value = '18:00';
            
            openModal('clinicModal');
        }

        function showEditClinicModal(index) {
            console.log("📝 Opening edit clinic modal for index:", index);
            
            const clinic = doctorClinics[index];
            if (!clinic) {
                showToast('❌ Clinic not found', 'error');
                return;
            }
            
            // Fill form with clinic data
            document.getElementById('clinicName').value = clinic.name || '';
            document.getElementById('clinicPhone').value = clinic.phone || '';
            document.getElementById('clinicAddress').value = clinic.address || '';
            document.getElementById('clinicEmail').value = clinic.email || '';
            document.getElementById('clinicStartTime').value = clinic.startTime || '09:00';
            document.getElementById('clinicEndTime').value = clinic.endTime || '18:00';
            document.getElementById('clinicConsultationFee').value = clinic.consultationFee || '';
            document.getElementById('clinicConsultationDuration').value = clinic.consultationDuration || '30';
            document.getElementById('clinicEditIndex').value = index;
            
            // Check working days
            const workingDaysArray = Array.isArray(clinic.workingDays) 
                ? clinic.workingDays 
                : clinic.workingDays?.split(',').map(d => d.trim()) || [];
            
            document.querySelectorAll('.clinicWorkingDay').forEach(cb => {
                cb.checked = workingDaysArray.includes(cb.getAttribute('data-day'));
            });
            
            // Update modal title and buttons
            document.getElementById('clinicModalTitle').textContent = '✏️ Edit Clinic';
            document.getElementById('deleteClinicBtn').style.display = 'block';
            document.getElementById('clinicSubmitBtn').textContent = 'Save Changes';
            
            openModal('clinicModal');
        }

        function saveClinic(e) {
            e.preventDefault();
            console.log("💾 Saving clinic...");
            
            // ===== AUTHENTICATION CHECK =====
            const token = localStorage.getItem("authToken");
            if (!token) {
                showToast('❌ Please login first to add clinic', 'error');
                console.error("❌ No authentication token found");
                return;
            }
            
            const editIndex = parseInt(document.getElementById('clinicEditIndex').value);
            const isEditing = editIndex >= 0;
            
            // Get form values
            const name = document.getElementById('clinicName').value.trim();
            const phone = document.getElementById('clinicPhone').value.trim();
            const address = document.getElementById('clinicAddress').value.trim();
            const email = document.getElementById('clinicEmail').value.trim();
            const startTime = document.getElementById('clinicStartTime').value;
            const endTime = document.getElementById('clinicEndTime').value;
            const fee = parseInt(document.getElementById('clinicConsultationFee').value) || 0;
            const duration = parseInt(document.getElementById('clinicConsultationDuration').value) || 30;
            
            // Validate
            if (!name || !phone || !address || !startTime || !endTime || !fee) {
                showToast('❌ Please fill all required fields', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email)) {
                showToast('❌ Invalid email address', 'error');
                return;
            }
            
            // Validate end time is after start time
            if (endTime <= startTime) {
                showToast('❌ End time must be after start time', 'error');
                return;
            }
            
            // Get working days
            const workingDays = Array.from(document.querySelectorAll('.clinicWorkingDay:checked'))
                .map(cb => cb.getAttribute('data-day'));
            
            if (workingDays.length === 0) {
                showToast('❌ Please select at least one working day', 'error');
                return;
            }
            
            // Check for time conflicts with other clinics
            // IMPORTANT: Only prevent conflict if there's an overlap in BOTH time AND days
            for (let i = 0; i < doctorClinics.length; i++) {
                if (isEditing && i === editIndex) continue; // Skip current clinic if editing
                
                const otherClinic = doctorClinics[i];
                
                // Convert other clinic's workingDays to array if it's a string
                const otherDays = Array.isArray(otherClinic.workingDays) 
                    ? otherClinic.workingDays 
                    : (otherClinic.workingDays?.split(',').map(d => d.trim()) || []);
                
                // Check if any working day overlaps between this clinic and the other clinic
                const sharedDays = workingDays.filter(day => otherDays.includes(day));
                
                // Only check time conflict if there are shared days
                if (sharedDays.length > 0) {
                    const currentStart = parseInt(startTime.replace(':', ''));
                    const currentEnd = parseInt(endTime.replace(':', ''));
                    const otherStart = parseInt(otherClinic.startTime.replace(':', ''));
                    const otherEnd = parseInt(otherClinic.endTime.replace(':', ''));
                    
                    // Check if there's any time overlap
                    if (!(currentEnd <= otherStart || currentStart >= otherEnd)) {
                        showToast(`⚠️ You cannot work the same hours (${startTime}-${endTime}) on ${sharedDays.join(', ')} as in "${otherClinic.name}" clinic`, 'warning');
                        return;
                    }
                }
            }
            
            // Check max clinics (only if adding new)
            if (!isEditing && doctorClinics.length >= 3) {
                showToast('❌ Maximum 3 clinics allowed', 'error');
                return;
            }
            
            // Create clinic object with API format
            const clinicData = {
                clinicName: name,
                clinicPhone: phone,
                clinicEmail: email,
                location: address,
                workingDays: workingDays.join(','),  // Send as string: "Saturday,Sunday,Monday,..."
                workStartTime: startTime,
                workEndTime: endTime,
                doctorPrice: fee,
                slotDurationMinutes: duration
            };
            
            console.log("📝 Clinic data prepared for API:", clinicData);
            
            // Get submit button
            const submitBtn = document.getElementById('clinicSubmitBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '⏳ Saving...';
            }
            
            // Save or update
            if (isEditing) {
                // For editing existing clinic
                const clinic = doctorClinics[editIndex];
                
                if (clinic.clinicId) {
                    // If clinic has server ID, update on server
                    console.log("📤 Sending clinic update to API with ID:", clinic.clinicId);
                    
                    updateClinic(clinic.clinicId, clinicData)
                        .then(response => {
                            console.log("✅ Clinic updated on server:", response);
                            
                            // Update local array
                            doctorClinics[editIndex] = {
                                name,
                                phone,
                                address,
                                email,
                                startTime,
                                endTime,
                                consultationFee: fee,
                                consultationDuration: duration,
                                workingDays,
                                clinicId: clinic.clinicId  // Preserve server ID
                            };
                            
                            console.log("✅ Clinic updated at index:", editIndex);
                            showToast('✅ Clinic updated successfully!', 'success');
                            
                            if (submitBtn) {
                                submitBtn.disabled = false;
                                submitBtn.innerHTML = 'Save Changes';
                            }
                            
                            closeModal('clinicModal');
                            updateProfilePage();
                            renderClinics();
                        })
                        .catch(error => {
                            console.error("❌ Failed to update clinic:", error);
                            showToast(`❌ Failed to update clinic: ${error.message}`, 'error');
                            
                            if (submitBtn) {
                                submitBtn.disabled = false;
                                submitBtn.innerHTML = 'Save Changes';
                            }
                        });
                } else {
                    // If no server ID, just update locally
                    doctorClinics[editIndex] = {
                        name,
                        phone,
                        address,
                        email,
                        startTime,
                        endTime,
                        consultationFee: fee,
                        consultationDuration: duration,
                        workingDays,
                        clinicId: clinic.clinicId  // Keep as undefined if not set
                    };
                    console.log("✅ Clinic updated at index:", editIndex);
                    showToast('✅ Clinic updated successfully!', 'success');
                    
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = 'Save Changes';
                    }
                    
                    closeModal('clinicModal');
                    updateProfilePage();
                }
            } else {
                // For new clinic, send to API
                createClinic(clinicData)
                    .then(response => {
                        console.log("✅ Clinic created on server:", response);
                        
                        // Add to local array with all data
                        const newClinic = {
                            name,
                            phone,
                            address,
                            email,
                            startTime,
                            endTime,
                            consultationFee: fee,
                            consultationDuration: duration,
                            workingDays,
                            clinicId: response.clinicId  // Store server ID
                        };
                        
                        doctorClinics.push(newClinic);
                        console.log("✅ Clinic added to local array");
                        
                        showToast('✅ Clinic added successfully!', 'success');
                        
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = 'Add Clinic';
                        }
                        
                        closeModal('clinicModal');
                        updateProfilePage();
                        renderClinics();
                    })
                    .catch(error => {
                        console.error("❌ Failed to create clinic:", error);
                        showToast(`❌ Failed to add clinic: ${error.message}`, 'error');
                        
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = 'Add Clinic';
                        }
                    });
            }
        }

        function deleteSelectedClinic() {
            const editIndex = parseInt(document.getElementById('clinicEditIndex').value);
            
            if (editIndex < 0) {
                showToast('❌ No clinic selected', 'error');
                return;
            }
            
            const clinic = doctorClinics[editIndex];
            if (!clinic) {
                showToast('❌ Clinic not found', 'error');
                return;
            }
            
            if (confirm('🗑️ Are you sure you want to delete this clinic?')) {
                // Check if clinic has a server ID
                if (clinic.clinicId) {
                    // Delete from server
                    deleteClinic(clinic.clinicId)
                        .then(response => {
                            console.log("✅ Clinic deleted from server:", response);
                            
                            // Delete from local array
                            doctorClinics.splice(editIndex, 1);
                            console.log("✅ Clinic removed from local array");
                            
                            showToast('✅ Clinic deleted successfully!', 'success');
                            closeModal('clinicModal');
                            updateProfilePage();
                        })
                        .catch(error => {
                            console.error("❌ Failed to delete clinic from server:", error);
                            showToast(`❌ Failed to delete clinic: ${error.message}`, 'error');
                        });
                } else {
                    // If no server ID, just delete locally (for clinics added but not saved to server yet)
                    doctorClinics.splice(editIndex, 1);
                    console.log("✅ Clinic deleted from index:", editIndex);
                    showToast('✅ Clinic deleted successfully!', 'success');
                    closeModal('clinicModal');
                    renderClinics();
                }
            }
        }

        function renderClinics() {
            console.log("🎨 Rendering clinics...", doctorClinics);
            
            const container = document.getElementById('clinicsContainer');
            const addClinicBtn = document.getElementById('addClinicBtn');
            
            if (!container) {
                console.error("❌ Clinics container not found");
                return;
            }
            
            // Update Add Clinic button state
            if (addClinicBtn) {
                if (doctorClinics.length >= 3) {
                    addClinicBtn.disabled = true;
                    addClinicBtn.style.opacity = '0.5';
                    addClinicBtn.title = 'Maximum 3 clinics allowed';
                } else {
                    addClinicBtn.disabled = false;
                    addClinicBtn.style.opacity = '1';
                    addClinicBtn.title = '';
                }
            }
            
            // Clear container
            container.innerHTML = '';
            
            if (doctorClinics.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1; padding: 20px;">No clinics added yet. Click "Add New Clinic" to get started.</p>';
                return;
            }
            
            // Render each clinic as info-card style
            doctorClinics.forEach((clinic, index) => {
                const clinicCard = document.createElement('div');
                clinicCard.className = 'info-card';
                clinicCard.style.position = 'relative';
                
                const editBtn = `<button class="btn btn-primary btn-sm" onclick="showEditClinicModal(${index})" style="margin-top: 12px; width: 100%;">✏️ Edit Clinic</button>`;
                
                clinicCard.innerHTML = `
                    <h3 class="info-card-title">
                        <span>🏥</span>
                        ${clinic.name}
                    </h3>
                    <div class="info-item">
                        <div class="info-icon">📍</div>
                        <div class="info-details">
                            <div class="info-label">Address</div>
                            <div class="info-value">${clinic.address}</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">📞</div>
                        <div class="info-details">
                            <div class="info-label">Phone</div>
                            <div class="info-value">${clinic.phone}</div>
                        </div>
                    </div>
                    ${clinic.email ? `
                    <div class="info-item">
                        <div class="info-icon">📧</div>
                        <div class="info-details">
                            <div class="info-label">Email</div>
                            <div class="info-value">${clinic.email}</div>
                        </div>
                    </div>
                    ` : ''}
                    <div class="info-item">
                        <div class="info-icon">📅</div>
                        <div class="info-details">
                            <div class="info-label">Working Days</div>
                            <div class="info-value">${Array.isArray(clinic.workingDays) ? clinic.workingDays.join(', ') : clinic.workingDays}</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">🕐</div>
                        <div class="info-details">
                            <div class="info-label">Working Hours</div>
                            <div class="info-value">${clinic.startTime} - ${clinic.endTime}</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">💰</div>
                        <div class="info-details">
                            <div class="info-label">Consultation Fee</div>
                            <div class="info-value">${clinic.consultationFee} EGP</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">⏱️</div>
                        <div class="info-details">
                            <div class="info-label">Consultation Duration</div>
                            <div class="info-value">${clinic.consultationDuration} minutes</div>
                        </div>
                    </div>
                    ${editBtn}
                `;
                container.appendChild(clinicCard);
            });
            
            console.log("✅ Clinics rendered");
        }