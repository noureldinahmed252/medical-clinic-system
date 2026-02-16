
        
        // Start Consultation: accept appointment and open consultation page
        function startConsultation(id) {
            const apt = appointments.find(a => a.id === id);
            if (!apt) return;
            apt.status = 'confirmed';
            showToast('Appointment accepted. Opening consultation...', 'info');
            openConsultation(id);
            updateAllData();
        }

          // Close autocomplete when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#consultationDiagnosisSearch') && !e.target.closest('#diseaseAutocomplete')) {
                document.getElementById('diseaseAutocomplete').style.display = 'none';
            }
        });
        function openConsultation(appointmentId) {
            const apt = appointments.find(a => a.id === appointmentId);
            if (!apt) return;
            const patient = patients.find(p => p.id === apt.patientId) || { name: 'Unknown', visits: [] };

            // Hide other pages and nav active states
            document.querySelectorAll('[id$="Page"]').forEach(p => p.classList.add('hidden'));
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

            // Show consultation page
            const page = document.getElementById('consultationPage');
            if (!page) return;
            page.classList.remove('hidden');

            // Populate header and appointment info
            document.getElementById('consultationPatientName').textContent = patient.name;
            document.getElementById('consultationAppointmentInfo').textContent = `${apt.date} • ${apt.time} • ID: ${apt.patientId}`;
            document.getElementById('consultationAppointmentId').value = appointmentId;

            // Build comprehensive patient summary
            let summaryHTML = `
                <div class="info-card">
                    <div class="info-item">
                        <div class="info-icon">🧾</div>
                        <div class="info-details">
                            <div class="info-label">Age</div>
                            <div class="info-value">${patient.age || '-'}</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">⚧</div>
                        <div class="info-details">
                            <div class="info-label">Gender</div>
                            <div class="info-value">${patient.gender || '-'}</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">📞</div>
                        <div class="info-details">
                            <div class="info-label">Phone</div>
                            <div class="info-value">${patient.phone || '-' }</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">🏘️</div>
                        <div class="info-details">
                            <div class="info-label">City</div>
                            <div class="info-value">${patient.city || '-'}</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">🩸</div>
                        <div class="info-details">
                            <div class="info-label">Blood Type</div>
                            <div class="info-value">${patient.bloodType || '-'}</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">⚕️</div>
                        <div class="info-details">
                            <div class="info-label">Allergies</div>
                            <div class="info-value">${patient.allergies || 'None'}</div>
                        </div>
                    </div>
                </div>
            `;

            // Add medical history if available
            if (patient.medicalHistory) {
                const activeConditions = Object.entries(patient.medicalHistory)
                    .filter(([_, value]) => value === true)
                    .map(([key, _]) => {
                        const labels = {
                            hypertension: 'Hypertension',
                            diabetes: 'Diabetes',
                            anaemia: 'Anaemia',
                            chestPain: 'Chest Pain',
                            sodium: 'Sodium Imbalance',
                            platelets: 'Platelet Disorder'
                        };
                        return labels[key] || key;
                    });

                if (activeConditions.length > 0) {
                    summaryHTML += `
                        <div style="margin-top:12px;padding:12px;background:rgba(220, 38, 38, 0.1);border-left:4px solid #dc2626;border-radius:6px;">
                            <strong style="color:#dc2626;">⚠️ Medical History</strong>
                            <div style="font-size:13px;color:var(--text-primary);margin-top:6px;">
                                ${activeConditions.join(', ')}
                            </div>
                        </div>
                    `;
                }
            }

            // Add measurements if available
            if (patient.measurements) {
                const measurements = patient.measurements;
                let measurementsHTML = '<div style="margin-top:12px;padding:12px;background:var(--bg-secondary);border-radius:6px;"><strong>📊 Latest Measurements</strong><div style="margin-top:8px;font-size:13px;display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
                
                if (measurements.glucose) measurementsHTML += `<div>Glucose: <strong>${measurements.glucose} mg/dL</strong></div>`;
                if (measurements.cholesterol) measurementsHTML += `<div>Cholesterol: <strong>${measurements.cholesterol} mg/dL</strong></div>`;
                if (measurements.bmi) measurementsHTML += `<div>BMI: <strong>${measurements.bmi}</strong></div>`;
                if (measurements.restingBP) measurementsHTML += `<div>BP: <strong>${measurements.restingBP}</strong></div>`;
                if (measurements.creatinine) measurementsHTML += `<div>Creatinine: <strong>${measurements.creatinine} mg/dL</strong></div>`;
                if (measurements.residenceType) measurementsHTML += `<div>Residence: <strong>${measurements.residenceType}</strong></div>`;

                measurementsHTML += '</div></div>';
                summaryHTML += measurementsHTML;
            }

            document.getElementById('consultationPatientSummary').innerHTML = summaryHTML;

            // Render previous visits
            const visitsContainer = document.getElementById('consultationVisits');
            if (!patient.visits || patient.visits.length === 0) {
                visitsContainer.innerHTML = '<p style="color:var(--text-secondary);padding:12px;">No previous visits</p>';
            } else {
                visitsContainer.innerHTML = patient.visits.map(v => `
                    <div style="background: var(--bg-primary); padding: 12px; border-radius: 10px; margin-bottom:10px; border-left:4px solid var(--primary);">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                            <strong>${v.date}</strong>
                            <span style="font-size:12px;color:var(--text-secondary);background:var(--bg-tertiary);padding:4px 8px;border-radius:4px;">${v.condition || '-'}</span>
                        </div>
                        <div style="margin-bottom:8px;">
                            ${v.diagnoses && v.diagnoses.length > 0 ? `
                                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                                    ${v.diagnoses.map(d => `
                                        <span class="disease-badge ${d.severity}" style="font-size:11px;padding:4px 8px;">
                                            ${d.name}
                                        </span>
                                    `).join('')}
                                </div>
                            ` : `<strong>Diagnosis:</strong> ${v.diagnosis || '-'}`}
                        </div>
                        <div style="color:var(--text-secondary);font-size:13px;">
                            <div><strong>Prescription:</strong> ${v.prescription || '-'}</div>
                            <div><strong>Notes:</strong> ${v.notes || '-'}</div>
                        </div>
                    </div>
                `).join('');
            }

            // Clear form inputs and selected diseases
            selectedDiseases = [];
            document.getElementById('consultationDiagnosisSearch').value = '';
            document.getElementById('selectedDiseases').innerHTML = '';
            document.getElementById('diseaseAutocomplete').style.display = 'none';
            document.getElementById('consultationPrescription').value = '';
            document.getElementById('consultationNotes').value = '';
            document.getElementById('consultationCondition').value = 'stable';
        }
// Handle disease search with autocomplete
        function handleDiseaseSearch(searchTerm) {
            const specialty = doctorProfile.specialty;
            const container = document.getElementById('diseaseAutocomplete');

            if (!searchTerm.trim()) {
                container.style.display = 'none';
                return;
            }

            const results = searchDiseases(searchTerm, specialty);
            
            if (results.length === 0) {
                container.innerHTML = '<div style="padding:12px;color:var(--text-secondary);">No diseases found</div>';
                container.style.display = 'block';
                return;
            }

            container.innerHTML = results.map(disease => `
                <div class="disease-autocomplete-item" onclick="addSelectedDisease(${JSON.stringify(disease).replace(/"/g, '&quot;')})">
                    <span>${disease.name}</span>
                    <span class="disease-severity ${disease.severity}">${disease.severity}</span>
                </div>
            `).join('');
            container.style.display = 'block';
        }
            // Add disease to selected list
        function addSelectedDisease(disease) {
            // Ensure disease is an object
            if (typeof disease === 'string') {
                try {
                    disease = JSON.parse(disease);
                } catch (e) {
                    console.error('Failed to parse disease:', e);
                    return;
                }
            }

            // Check if disease already selected
            if (selectedDiseases.find(d => d.id === disease.id)) {
                showToast('Disease already selected', 'warning');
                return;
            }

            selectedDiseases.push(disease);
            
            // Clear search input and autocomplete
            document.getElementById('consultationDiagnosisSearch').value = '';
            document.getElementById('diseaseAutocomplete').style.display = 'none';
            
            // Update UI display
            renderSelectedDiseases();
        }

        // Remove disease from selected list
        function removeSelectedDisease(diseaseId) {
            selectedDiseases = selectedDiseases.filter(d => d.id !== diseaseId);
            renderSelectedDiseases();
        }

        // Render selected diseases as badges
        function renderSelectedDiseases() {
            const container = document.getElementById('selectedDiseases');
            
            if (selectedDiseases.length === 0) {
                container.innerHTML = '';
                return;
            }

            container.innerHTML = selectedDiseases.map(disease => `
                <div class="disease-badge ${disease.severity}">
                    <span>${disease.name}</span>
                    <button type="button" class="disease-badge-close" onclick="removeSelectedDisease('${disease.id}')">×</button>
                </div>
            `).join('');
        }
     function saveConsultation(e) {
            e.preventDefault();
            
            // Validate that at least one disease is selected
            if (selectedDiseases.length === 0) {
                showToast('Please select at least one disease', 'error');
                return;
            }

            const appointmentId = parseInt(document.getElementById('consultationAppointmentId').value);
            const apt = appointments.find(a => a.id === appointmentId);
            if (!apt) return;

            const patient = patients.find(p => p.id === apt.patientId);
            if (!patient) return;

            const visit = {
                date: new Date().toISOString().split('T')[0],
                diagnosis: selectedDiseases.map(d => d.name).join(', '),
                diagnoses: selectedDiseases, // Store full disease objects
                prescription: document.getElementById('consultationPrescription').value,
                notes: document.getElementById('consultationNotes').value,
                condition: document.getElementById('consultationCondition').value
            };

            patient.visits = patient.visits || [];
            patient.visits.unshift(visit);
            patient.lastVisit = visit.date;

            // mark appointment confirmed (completed)
            apt.status = 'confirmed';

            showToast('Consultation saved successfully!', 'success');
            updateAllData();
            // Close consultation modal/page and go to dashboard
            document.querySelector('[id$="ConsultationPage"]') && document.querySelector('[id$="ConsultationPage"]').classList.add('hidden');
            showPage('dashboard');
        }
