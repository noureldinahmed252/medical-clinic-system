
        function showAddPatientModal() {
            const form = document.getElementById('patientForm');
            if (form) {
                form.reset();
                // Uncheck all checkboxes
                document.querySelectorAll('#patientForm input[type="checkbox"]').forEach(cb => cb.checked = false);
            }
            document.getElementById('addPatientModal').classList.add('active');
        }

        

function savePatient(e) {
            e.preventDefault();
            
            // Get medical history checkboxes
            const medicalHistory = {
                hypertension: document.getElementById('patientHypertension')?.checked || false,
                diabetes: document.getElementById('patientDiabetes')?.checked || false,
                anaemia: document.getElementById('patientAnaemia')?.checked || false,
                chestPain: document.getElementById('patientChestPain')?.checked || false,
                sodium: document.getElementById('patientSodium')?.checked || false,
                platelets: document.getElementById('patientPlatelets')?.checked || false
            };

            // Get medical measurements
            const glucose = document.getElementById('patientGlucose').value ? parseFloat(document.getElementById('patientGlucose').value) : null;
            const creatinine = document.getElementById('patientCreatinine').value ? parseFloat(document.getElementById('patientCreatinine').value) : null;
            const cholesterol = document.getElementById('patientCholesterol').value ? parseFloat(document.getElementById('patientCholesterol').value) : null;
            const bmi = document.getElementById('patientBMI').value ? parseFloat(document.getElementById('patientBMI').value) : null;
            const restingBP = document.getElementById('patientRestingBP').value;
            const residenceType = document.getElementById('patientResidenceType').value;

            const patient = {
                id: 'P' + String(patients.length + 1).padStart(3, '0'),
                name: document.getElementById('patientName').value,
                age: parseInt(document.getElementById('patientAge').value),
                gender: document.getElementById('patientGender').value,
                phone: document.getElementById('patientPhone').value,
                city: document.getElementById('patientCity').value || '',
                married: document.getElementById('patientMarried').value || '',
                bloodType: document.getElementById('patientBloodType').value || '',
                allergies: document.getElementById('patientAllergies').value || 'None',
                chronic: document.getElementById('patientNotes').value || 'None', // Keep for backward compatibility
                lastVisit: new Date().toISOString().split('T')[0],
                notes: document.getElementById('patientNotes').value,
                visits: [],
                medicalHistory: medicalHistory,
                measurements: {
                    glucose: glucose,
                    creatinine: creatinine,
                    cholesterol: cholesterol,
                    bmi: bmi,
                    restingBP: restingBP,
                    residenceType: residenceType
                }
            };
            
            patients.push(patient);
            closeModal('addPatientModal');
            // Fully reset the form
            const form = document.getElementById('patientForm');
            if (form) form.reset();
            // Uncheck all checkboxes
            document.querySelectorAll('#patientForm input[type="checkbox"]').forEach(cb => cb.checked = false);
            showToast(`Patient ${patient.name} added successfully!`, 'success');
            updateAllData();
        }
        // Modal Functions
        function showAddAppointmentModal() {
            updatePatientSelects();
            document.getElementById('appointmentDate').value = selectedDate;
            document.getElementById('addAppointmentModal').classList.add('active');
        }
        
        // Enter key to search
        document.getElementById('patientSearchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchPatients();
        });
        // Delete Patient
        function deletePatient(id) {
            if (confirm('Are you sure you want to delete this patient? All their data will be removed!')) {
                patients = patients.filter(p => p.id !== id);
                appointments = appointments.filter(a => a.patientId !== id);
                showToast('Patient deleted successfully!', 'warning');
                updateAllData();
            }
        }
        // Save Edited Patient
        function saveEditedPatient(e) {
            e.preventDefault();
            
            const patientId = document.getElementById('editPatientId').value;
            const patient = patients.find(p => p.id === patientId);
            if (!patient) return;

            // Update basic information
            patient.name = document.getElementById('editPatientName').value;
            patient.age = parseInt(document.getElementById('editPatientAge').value);
            patient.gender = document.getElementById('editPatientGender').value;
            patient.phone = document.getElementById('editPatientPhone').value;
            patient.city = document.getElementById('editPatientCity').value;
            patient.married = document.getElementById('editPatientMarried').value;
            patient.bloodType = document.getElementById('editPatientBloodType').value;

            // Update medical history
            patient.medicalHistory = {
                hypertension: document.getElementById('editPatientHypertension').checked,
                diabetes: document.getElementById('editPatientDiabetes').checked,
                anaemia: document.getElementById('editPatientAnaemia').checked,
                chestPain: document.getElementById('editPatientChestPain').checked,
                sodium: document.getElementById('editPatientSodium').checked,
                platelets: document.getElementById('editPatientPlatelets').checked
            };

            // Update medical measurements
            const glucose = document.getElementById('editPatientGlucose').value ? parseFloat(document.getElementById('editPatientGlucose').value) : null;
            const creatinine = document.getElementById('editPatientCreatinine').value ? parseFloat(document.getElementById('editPatientCreatinine').value) : null;
            const cholesterol = document.getElementById('editPatientCholesterol').value ? parseFloat(document.getElementById('editPatientCholesterol').value) : null;
            const bmi = document.getElementById('editPatientBMI').value ? parseFloat(document.getElementById('editPatientBMI').value) : null;
            const restingBP = document.getElementById('editPatientRestingBP').value;
            const residenceType = document.getElementById('editPatientResidenceType').value;

            patient.measurements = {
                glucose: glucose,
                creatinine: creatinine,
                cholesterol: cholesterol,
                bmi: bmi,
                restingBP: restingBP,
                residenceType: residenceType
            };

            // Update allergies and notes
            patient.allergies = document.getElementById('editPatientAllergies').value || 'None';
            patient.notes = document.getElementById('editPatientNotes').value;
            patient.chronic = document.getElementById('editPatientNotes').value; // Keep for backward compatibility

            // Close modal and show success message
            closeModal('editPatientModal');
            showToast(`Patient ${patient.name} updated successfully!`, 'success');
            
            // Update display
            updateAllData();
        }

        // Show Patient Details (Full Page)
        function showPatientDetails(id) {
            const patient = patients.find(p => p.id === id);
            if (!patient) return;
            openPatientPage(id);
        }

        // Open patient full page view
        function openPatientPage(id) {
            const patient = patients.find(p => p.id === id);
            if (!patient) return;
            
            document.querySelectorAll('[id$="Page"]').forEach(p => p.classList.add('hidden'));
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            
            const page = document.getElementById('patientDetailsPage');
            if (!page) return;
            page.classList.remove('hidden');
            
            let content = `
                <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color: white; padding: 30px; border-radius: 15px; margin-bottom: 25px;">
                    <div style="display: flex; align-items: center; gap: 25px; margin-bottom: 25px; flex-wrap: wrap;">
                        <div style="width: 80px; height: 80px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                            ${patient.gender === 'Male' ? '👨' : '👩'}
                        </div>
                        <div>
                            <h3 style="font-size: 28px; margin-bottom: 5px;">${patient.name}</h3>
                            <p style="opacity: 0.95;">Patient ID: ${patient.id}</p>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                        <div style="background: rgba(255, 255, 255, 0.2); padding: 15px; border-radius: 12px;">
                            <div style="font-size: 12px; opacity: 0.9;">Age</div>
                            <div style="font-size: 24px; font-weight: 700;">${patient.age} years</div>
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.2); padding: 15px; border-radius: 12px;">
                            <div style="font-size: 12px; opacity: 0.9;">Gender</div>
                            <div style="font-size: 24px; font-weight: 700;">${patient.gender}</div>
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.2); padding: 15px; border-radius: 12px;">
                            <div style="font-size: 12px; opacity: 0.9;">Blood Type</div>
                            <div style="font-size: 24px; font-weight: 700;">${patient.bloodType || '-'}</div>
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.2); padding: 15px; border-radius: 12px;">
                            <div style="font-size: 12px; opacity: 0.9;">Phone</div>
                            <div style="font-size: 16px; font-weight: 700;">${patient.phone}</div>
                        </div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 25px;">
                    <div style="background: #fee2e2; padding: 20px; border-radius: 15px; border: 2px solid #fca5a5;">
                        <h4 style="color: #991b1b; font-weight: 700; margin-bottom: 10px;">❤️ Allergies</h4>
                        <p style="color: #7f1d1d; font-weight: 600;">${patient.allergies || 'None'}</p>
                    </div>
                    ${patient.city || patient.married ? `
                        <div style="background: #dbeafe; padding: 20px; border-radius: 15px; border: 2px solid #93c5fd;">
                            <h4 style="color: #1e40af; font-weight: 700; margin-bottom: 10px;">📍 Personal Info</h4>
                            <p style="color: #1e3a8a; font-weight: 600;"><strong>City:</strong> ${patient.city || '-'}<br><strong>Status:</strong> ${patient.married || '-'}</p>
                        </div>
                    ` : ''}
                </div>
            `;

            // Medical History Section
            if (patient.medicalHistory && Object.values(patient.medicalHistory).some(v => v)) {
                const conditions = [];
                if (patient.medicalHistory.hypertension) conditions.push('🏥 Hypertension');
                if (patient.medicalHistory.diabetes) conditions.push('🍬 Diabetes');
                if (patient.medicalHistory.anaemia) conditions.push('🩸 Anaemia');
                if (patient.medicalHistory.chestPain) conditions.push('💔 Chest Pain');
                if (patient.medicalHistory.sodium) conditions.push('⚗️ Sodium Imbalance');
                if (patient.medicalHistory.platelets) conditions.push('🔴 Platelet Disorder');

                content += `
                    <div style="background: #fee2e2; padding: 20px; border-radius: 15px; border: 2px solid #fca5a5; margin-bottom: 25px;">
                        <h4 style="color: #991b1b; font-weight: 700; margin-bottom: 15px;">⚠️ Medical History</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${conditions.map(c => `<span style="background: #fecaca; color: #991b1b; padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 13px;">${c}</span>`).join('')}
                        </div>
                    </div>
                `;
            }

            // Medical Measurements Section
            if (patient.measurements && Object.values(patient.measurements).some(v => v)) {
                content += `
                    <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 15px; margin-bottom: 25px;">
                        <h4 style="font-weight: 700; margin-bottom: 15px; color: var(--text-primary);">📊 Latest Medical Measurements</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                            ${patient.measurements.glucose ? `<div style="background: var(--bg-primary); padding: 12px; border-radius: 8px;"><strong>Glucose:</strong> ${patient.measurements.glucose} mg/dL</div>` : ''}
                            ${patient.measurements.cholesterol ? `<div style="background: var(--bg-primary); padding: 12px; border-radius: 8px;"><strong>Cholesterol:</strong> ${patient.measurements.cholesterol} mg/dL</div>` : ''}
                            ${patient.measurements.bmi ? `<div style="background: var(--bg-primary); padding: 12px; border-radius: 8px;"><strong>BMI:</strong> ${patient.measurements.bmi}</div>` : ''}
                            ${patient.measurements.restingBP ? `<div style="background: var(--bg-primary); padding: 12px; border-radius: 8px;"><strong>Resting BP:</strong> ${patient.measurements.restingBP}</div>` : ''}
                            ${patient.measurements.creatinine ? `<div style="background: var(--bg-primary); padding: 12px; border-radius: 8px;"><strong>Creatinine:</strong> ${patient.measurements.creatinine} mg/dL</div>` : ''}
                            ${patient.measurements.residenceType ? `<div style="background: var(--bg-primary); padding: 12px; border-radius: 8px;"><strong>Residence:</strong> ${patient.measurements.residenceType}</div>` : ''}
                        </div>
                    </div>
                `;
            }

            // Medical History/Visits Section
            content += `
                ${patient.visits && patient.visits.length > 0 ? `
                    <div style="background: var(--bg-tertiary); padding: 25px; border-radius: 15px;">
                        <h4 style="font-weight: 700; margin-bottom: 20px; color: var(--text-primary); font-size: 20px;">📋 Medical History</h4>
                        ${patient.visits.map((visit, index) => `
                            <div style="background: var(--bg-primary); padding: 18px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid var(--primary);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                                    <strong style="color: var(--text-primary);">${visit.date}</strong>
                                    <span style="background: var(--primary); color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                                        Visit ${patient.visits.length - index}
                                    </span>
                                </div>
                                <div style="color: var(--text-secondary); line-height: 1.8;">
                                    ${visit.diagnoses && visit.diagnoses.length > 0 ? `
                                        <div style="margin-bottom: 8px;">
                                            <strong>Diagnoses:</strong><br>
                                            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">
                                                ${visit.diagnoses.map(d => `
                                                    <span class="disease-badge ${d.severity}" style="font-size: 11px; padding: 4px 8px;">
                                                        ${d.name}
                                                    </span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    ` : `<div><strong>Diagnosis:</strong> ${visit.diagnosis}</div>`}
                                    <div><strong>Prescription:</strong> ${visit.prescription || '-'}</div>
                                    <div><strong>Condition:</strong> ${visit.condition || '-'}</div>
                                    <div><strong>Notes:</strong> ${visit.notes || '-'}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No previous visits</p>'}
            `;
            
            document.getElementById('patientDetailsPageContent').innerHTML = content;
        }
// Patients Table
        function renderPatientsTable() {
            const tbody = document.getElementById('patientsTableBody');
            
            if (patients.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 40px;">
                            <div class="empty-state">
                                <div class="empty-state-icon">👥</div>
                                <div class="empty-state-title">No Patients</div>
                                <p>Add a new patient to get started</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }
            
            tbody.innerHTML = patients.map(p => `
                <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.name}</td>
                    <td>${p.age}</td>
                    <td>${p.phone}</td>
                    <td>${p.lastVisit}</td>
                    <td><span class="badge badge-success">Active</span></td>
                    <td>
                        <button class="action-btn btn-primary" onclick="showPatientDetails('${p.id}')" title="View">
                            👁️
                        </button>
                        <button class="action-btn btn-info" onclick="showEditPatientModal('${p.id}')" title="Edit">
                            ✏️
                        </button>
                        <button class="action-btn btn-danger" onclick="deletePatient('${p.id}')" title="Delete">
                            🗑️
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        // Search Patients
        function searchPatients() {
            const searchTerm = document.getElementById('patientSearchInput').value.toLowerCase();
            const tbody = document.getElementById('patientsTableBody');
            
            const filtered = patients.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.id.toLowerCase().includes(searchTerm) ||
                p.phone.includes(searchTerm)
            );
            
            if (filtered.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                            No results found
                        </td>
                    </tr>
                `;
                return;
            }
            
            tbody.innerHTML = filtered.map(p => `
                <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.name}</td>
                    <td>${p.age}</td>
                    <td>${p.phone}</td>
                    <td>${p.lastVisit}</td>
                    <td><span class="badge badge-success">Active</span></td>
                    <td>
                        <button class="action-btn btn-primary" onclick="showPatientDetails('${p.id}')">👁️</button>
                        <button class="action-btn btn-danger" onclick="deletePatient('${p.id}')">🗑️</button>
                    </td>
                </tr>
            `).join('');
        }

        function clearSearch() {
            document.getElementById('patientSearchInput').value = '';
            renderPatientsTable();
        }
              // Show Edit Patient Modal
        function showEditPatientModal(patientId) {
            const patient = patients.find(p => p.id === patientId);
            if (!patient) return;

            // Store patient ID in hidden input
            document.getElementById('editPatientId').value = patientId;

            // First, uncheck ALL checkboxes in edit form
            document.querySelectorAll('#editPatientForm input[type="checkbox"]').forEach(cb => cb.checked = false);
            
            // First, clear ALL measurement fields
            document.getElementById('editPatientGlucose').value = '';
            document.getElementById('editPatientCreatinine').value = '';
            document.getElementById('editPatientCholesterol').value = '';
            document.getElementById('editPatientBMI').value = '';
            document.getElementById('editPatientRestingBP').value = '';

            // Populate basic fields
            document.getElementById('editPatientName').value = patient.name || '';
            document.getElementById('editPatientAge').value = patient.age || '';
            document.getElementById('editPatientGender').value = patient.gender || '';
            document.getElementById('editPatientPhone').value = patient.phone || '';
            document.getElementById('editPatientCity').value = patient.city || '';
            document.getElementById('editPatientMarried').value = patient.married || '';
            document.getElementById('editPatientBloodType').value = patient.bloodType || '';
            document.getElementById('editPatientResidenceType').value = patient.measurements?.residenceType || '';

            // Populate medical history checkboxes
            if (patient.medicalHistory) {
                document.getElementById('editPatientHypertension').checked = patient.medicalHistory.hypertension || false;
                document.getElementById('editPatientDiabetes').checked = patient.medicalHistory.diabetes || false;
                document.getElementById('editPatientAnaemia').checked = patient.medicalHistory.anaemia || false;
                document.getElementById('editPatientChestPain').checked = patient.medicalHistory.chestPain || false;
                document.getElementById('editPatientSodium').checked = patient.medicalHistory.sodium || false;
                document.getElementById('editPatientPlatelets').checked = patient.medicalHistory.platelets || false;
            }

            // Now populate medical measurements
            if (patient.measurements) {
                document.getElementById('editPatientGlucose').value = patient.measurements.glucose || '';
                document.getElementById('editPatientCreatinine').value = patient.measurements.creatinine || '';
                document.getElementById('editPatientCholesterol').value = patient.measurements.cholesterol || '';
                document.getElementById('editPatientBMI').value = patient.measurements.bmi || '';
                document.getElementById('editPatientRestingBP').value = patient.measurements.restingBP || '';
            }

            // Populate allergies and notes
            document.getElementById('editPatientAllergies').value = patient.allergies || '';
            document.getElementById('editPatientNotes').value = patient.notes || '';

            // Open modal
            openModal('editPatientModal');
        }
