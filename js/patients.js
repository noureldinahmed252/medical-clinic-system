
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
                anaemia: document.getElementById('patientAnaemia')?.checked || false
            };

            // Get patient data
            const age = parseInt(document.getElementById('patientAge').value);
            const gender = document.getElementById('patientGender').value;
            const phone = document.getElementById('patientPhone').value;
            const city = document.getElementById('patientCity').value || '';
            const married = document.getElementById('patientMarried').value === 'true' || false;
            const bloodtype = document.getElementById('patientBloodtype').value || '';
            const height = document.getElementById('patientHeight').value ? parseFloat(document.getElementById('patientHeight').value) : null;
            const weight = document.getElementById('patientWeight').value ? parseFloat(document.getElementById('patientWeight').value) : null;

            const patient = {
                id: 'P' + String(patients.length + 1).padStart(3, '0'),
                name: `Patient_${phone}`, // Generate name from phone
                patientAge: age,
                patientGender: gender,
                patientPhone: phone,
                patientCity: city,
                patientMarried: married,
                patientBloodtype: bloodtype,
                patientHeight: height,
                patientWeight: weight,
                patientHypertension: medicalHistory.hypertension,
                patientDiabetes: medicalHistory.diabetes,
                patientAnaemia: medicalHistory.anaemia,
                lastVisit: new Date().toISOString().split('T')[0],
                visits: [],
                medicalHistory: medicalHistory
            };
            
            patients.push(patient);
            closeModal('addPatientModal');
            // Fully reset the form
            const form = document.getElementById('patientForm');
            if (form) form.reset();
            // Uncheck all checkboxes
            document.querySelectorAll('#patientForm input[type="checkbox"]').forEach(cb => cb.checked = false);
            showToast(`Patient added successfully!`, 'success');
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
                const deleteId = String(id);
                patients = patients.filter(p => String(p.id) !== deleteId);
                appointments = appointments.filter(a => String(a.patientId) !== deleteId);
                showToast('Patient deleted successfully!', 'warning');
                updateAllData();
            }
        }
        // Save Edited Patient
        function saveEditedPatient(e) {
            e.preventDefault();
            
            const patientId = String(document.getElementById('editPatientId').value);
            const patient = patients.find(p => String(p.id) === patientId);
            if (!patient) return;

            // Update basic information
            patient.patientAge = parseInt(document.getElementById('editPatientAge').value);
            patient.patientGender = document.getElementById('editPatientGender').value;
            patient.patientPhone = document.getElementById('editPatientPhone').value;
            patient.patientCity = document.getElementById('editPatientCity').value;
            patient.patientMarried = document.getElementById('editPatientMarried').value === 'true' || false;
            patient.patientBloodtype = document.getElementById('editPatientBloodtype').value;
            
            // Update height and weight from API data
            const heightField = document.getElementById('editPatientHeight');
            const weightField = document.getElementById('editPatientWeight');
            if (heightField && heightField.value) patient.patientHeight = parseFloat(heightField.value);
            if (weightField && weightField.value) patient.patientWeight = parseFloat(weightField.value);

            // Update medical history
            patient.medicalHistory = {
                hypertension: document.getElementById('editPatientHypertension').checked,
                diabetes: document.getElementById('editPatientDiabetes').checked,
                anaemia: document.getElementById('editPatientAnaemia').checked
            };
            
            patient.patientHypertension = patient.medicalHistory.hypertension;
            patient.patientDiabetes = patient.medicalHistory.diabetes;
            patient.patientAnaemia = patient.medicalHistory.anaemia;

            // Close modal and show success message
            closeModal('editPatientModal');
            showToast(`Patient ${patient.name} updated successfully!`, 'success');
            
            // Update display
            updateAllData();
        }

        // Show Patient Details (Full Page)
        function showPatientDetails(id) {
            const patient = patients.find(p => String(p.id) === String(id));
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
                        <h4 style="color: #991b1b; font-weight: 700; margin-bottom: 10px;">📏 Physical Measurements</h4>
                        <p style="color: #7f1d1d; font-weight: 600;">
                            <strong>Height:</strong> ${patient.height ? patient.height + ' cm' : '-'}<br>
                            <strong>Weight:</strong> ${patient.weight ? patient.weight + ' kg' : '-'}
                        </p>
                    </div>
                    <div style="background: #dbeafe; padding: 20px; border-radius: 15px; border: 2px solid #93c5fd;">
                        <h4 style="color: #1e40af; font-weight: 700; margin-bottom: 10px;">💍 Personal Info</h4>
                        <p style="color: #1e3a8a; font-weight: 600;">
                            <strong>City:</strong> ${patient.city || '-'}<br>
                            <strong>Status:</strong> ${patient.married ? (typeof patient.married === 'string' ? patient.married : 'Married') : 'Single'}
                        </p>
                    </div>
                </div>
            `;

            // Health Conditions Section
            content += `
                <div style="background: #fef3c7; padding: 20px; border-radius: 15px; border: 2px solid #fcd34d; margin-bottom: 25px;">
                    <h4 style="color: #92400e; font-weight: 700; margin-bottom: 15px;">⚕️ Health Conditions</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; color: #92400e; font-weight: 600;">
                            <input type="checkbox" ${patient.medicalHistory?.hypertension ? 'checked' : ''} disabled style="width: 18px; height: 18px; cursor: pointer;">
                            <span>🏥 Hypertension</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; color: #92400e; font-weight: 600;">
                            <input type="checkbox" ${patient.medicalHistory?.diabetes ? 'checked' : ''} disabled style="width: 18px; height: 18px; cursor: pointer;">
                            <span>🍬 Diabetes</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; color: #92400e; font-weight: 600;">
                            <input type="checkbox" ${patient.medicalHistory?.anaemia ? 'checked' : ''} disabled style="width: 18px; height: 18px; cursor: pointer;">
                            <span>🩸 Anaemia</span>
                        </label>
                    </div>
                </div>
            `;

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
                
                <footer style="text-align: center; padding: 30px 20px; color: var(--text-secondary); border-top: 1px solid var(--border-color); margin-top: 40px;">
                    <p>© 2025 Clinic Management System - All Rights Reserved</p>
                </footer>
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
                String(p.id).toLowerCase().includes(searchTerm) ||
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
            const patient = patients.find(p => String(p.id) === String(patientId));
            if (!patient) {
                console.error("Patient not found:", patientId);
                return;
            }

            // Store patient ID in hidden input
            document.getElementById('editPatientId').value = patientId;

            // First, uncheck ALL checkboxes in edit form
            document.querySelectorAll('#editPatientForm input[type="checkbox"]').forEach(cb => cb.checked = false);
            
            // Clear ALL measurement fields safely
            const fieldsToClear = [
                'editPatientGlucose', 'editPatientCreatinine', 'editPatientCholesterol',
                'editPatientBMI', 'editPatientRestingBP', 'editPatientHeight', 'editPatientWeight'
            ];
            fieldsToClear.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) field.value = '';
            });

            // Populate basic fields
            const basicFields = {
                'editPatientName': 'name',
                'editPatientAge': 'age',
                'editPatientGender': 'gender',
                'editPatientPhone': 'phone',
                'editPatientCity': 'city',
                'editPatientMarried': 'married',
                'editPatientBloodType': 'bloodType',
                'editPatientHeight': 'height',
                'editPatientWeight': 'weight'
            };

            Object.keys(basicFields).forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = patient[basicFields[fieldId]] || '';
                }
            });

            // Populate medical history checkboxes
            if (patient.medicalHistory) {
                const historyFields = {
                    'editPatientHypertension': 'hypertension',
                    'editPatientDiabetes': 'diabetes',
                    'editPatientAnaemia': 'anaemia',
                    'editPatientChestPain': 'chestPain',
                    'editPatientSodium': 'sodium',
                    'editPatientPlatelets': 'platelets'
                };

                Object.keys(historyFields).forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field) {
                        field.checked = patient.medicalHistory[historyFields[fieldId]] || false;
                    }
                });
            }

            // Now populate medical measurements (only if they exist)
            if (patient.measurements) {
                const measurementFields = {
                    'editPatientGlucose': 'glucose',
                    'editPatientCreatinine': 'creatinine',
                    'editPatientCholesterol': 'cholesterol',
                    'editPatientBMI': 'bmi',
                    'editPatientRestingBP': 'restingBP'
                };

                Object.keys(measurementFields).forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field && patient.measurements[measurementFields[fieldId]]) {
                        field.value = patient.measurements[measurementFields[fieldId]];
                    }
                });
            }

            // Populate allergies and notes
            const allergy = document.getElementById('editPatientAllergies');
            const notes = document.getElementById('editPatientNotes');
            const residence = document.getElementById('editPatientResidenceType');
            
            if (allergy) allergy.value = patient.allergies || '';
            if (notes) notes.value = patient.notes || '';
            if (residence) residence.value = patient.measurements?.residenceType || '';

            // Open modal
            openModal('editPatientModal');
        }
