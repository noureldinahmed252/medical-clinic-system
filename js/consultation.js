
        
        // Start Consultation: accept appointment and open consultation page
        function startConsultation(id) {
            const apt = appointments.find(a => String(a.id) === String(id));
            if (!apt) return;
            apt.status = 'confirmed';
            showToast('Appointment accepted. Opening consultation...', 'info');
            openConsultation(id);
            updateAllData();
        }

        // Close autocomplete when clicking outside
        document.addEventListener('click', function(e) {
            // إغلاق autocomplete الأمراض
            if (!e.target.closest('#consultationDiagnosisSearch') && !e.target.closest('#diseaseAutocomplete')) {
                document.getElementById('diseaseAutocomplete').style.display = 'none';
            }
            // إغلاق autocomplete الأدوية
            if (!e.target.closest('#consultationDrugSearch') && !e.target.closest('#drugAutocomplete')) {
                document.getElementById('drugAutocomplete').style.display = 'none';
            }
            // إغلاق autocomplete الأعراض الخطيرة
            if (!e.target.closest('#redFlagSymptomSearch') && !e.target.closest('#redFlagAutocomplete')) {
                document.getElementById('redFlagAutocomplete').style.display = 'none';
            }
        });

        function openConsultation(appointmentId) {
            const apt = appointments.find(a => String(a.id) === String(appointmentId));
            if (!apt) return;
            const patient = patients.find(p => String(p.id) === String(apt.patientId)) || { name: 'Unknown', visits: [] };

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

            // Build comprehensive patient summary - Only from API data
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
                        <div class="info-icon">💍</div>
                        <div class="info-details">
                            <div class="info-label">Status</div>
                            <div class="info-value">${patient.married ? 'Married' : 'Single'}</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">📏</div>
                        <div class="info-details">
                            <div class="info-label">Height</div>
                            <div class="info-value">${patient.height ? patient.height + ' cm' : '-'}</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">⚖️</div>
                        <div class="info-details">
                            <div class="info-label">Weight</div>
                            <div class="info-value">${patient.weight ? patient.weight + ' kg' : '-'}</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">🩸</div>
                        <div class="info-details">
                            <div class="info-label">Blood Type</div>
                            <div class="info-value">${patient.bloodType || '-'}</div>
                        </div>
                    </div>
                </div>
            `;

            // Add medical history from API if available
            if (patient.medicalHistory) {
                const activeConditions = [];
                if (patient.medicalHistory.hypertension) activeConditions.push('🏥 Hypertension');
                if (patient.medicalHistory.diabetes) activeConditions.push('🍬 Diabetes');
                if (patient.medicalHistory.anaemia) activeConditions.push('🩸 Anaemia');

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
            selectedMedications = [];
            selectedRedFlags = [];
            document.getElementById('consultationDiagnosisSearch').value = '';
            document.getElementById('consultationDrugSearch').value = '';
            document.getElementById('redFlagSymptomSearch').value = '';
            document.getElementById('selectedDiseases').innerHTML = '';
            document.getElementById('selectedMedications').innerHTML = '';
            document.getElementById('selectedRedFlags').innerHTML = '';
            document.getElementById('diseaseAutocomplete').style.display = 'none';
            document.getElementById('drugAutocomplete').style.display = 'none';
            document.getElementById('redFlagAutocomplete').style.display = 'none';
            document.getElementById('consultationNotes').value = '';
            document.getElementById('redFlagDescription').value = '';
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
        // Red Flag Symptoms - Search function
        function handleRedFlagSearch(searchTerm) {
            const container = document.getElementById('redFlagAutocomplete');
            
            if (!searchTerm.trim()) {
                container.style.display = 'none';
                return;
            }
            
            const filtered = redFlagSymptoms.filter(symptom => 
                !selectedRedFlags.find(s => s.id === symptom.id) &&
                symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            if (filtered.length === 0) {
                container.innerHTML = '';
                container.style.display = 'none';
                return;
            }
            
            container.innerHTML = filtered.map(symptom => `
                <div class="red-flag-autocomplete-item" onclick="addSelectedRedFlag(${symptom.id}, '${symptom.name.replace(/'/g, "\\'")}', '${symptom.category}')">
                    <strong>${symptom.name}</strong>
                    <span class="red-flag-category">${symptom.category}</span>
                </div>
            `).join('');
            container.style.display = 'block';
        }
        
        // Add Red Flag Symptom
        function addSelectedRedFlag(id, name, category) {
            if (selectedRedFlags.find(s => s.id === id)) {
                showToast('This symptom is already added', 'warning');
                return;
            }
            
            selectedRedFlags.push({ id, name, category });
            document.getElementById('redFlagSymptomSearch').value = '';
            document.getElementById('redFlagAutocomplete').style.display = 'none';
            renderSelectedRedFlags();
        }
        
        // Remove Red Flag Symptom
        function removeSelectedRedFlag(id) {
            selectedRedFlags = selectedRedFlags.filter(s => s.id !== id);
            renderSelectedRedFlags();
        }
        
        // Render Red Flag Symptoms as badges
        function renderSelectedRedFlags() {
            const container = document.getElementById('selectedRedFlags');
            
            if (selectedRedFlags.length === 0) {
                container.innerHTML = '';
                return;
            }
            
            container.innerHTML = selectedRedFlags.map(symptom => `
                <div class="red-flag-badge">
                    <span>⚠️ ${symptom.name}</span>
                    <button type="button" class="red-flag-badge-close" onclick="removeSelectedRedFlag(${symptom.id})">×</button>
                </div>
            `).join('');
        }
        
        // Clear Red Flag data when starting new consultation
        function clearRedFlagData() {
            selectedRedFlags = [];
            document.getElementById('redFlagSymptomSearch').value = '';
            document.getElementById('redFlagDescription').value = '';
            renderSelectedRedFlags();
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

            const appointmentId = String(document.getElementById('consultationAppointmentId').value);
            const apt = appointments.find(a => String(a.id) === appointmentId);
            if (!apt) return;

            const patient = patients.find(p => String(p.id) === String(apt.patientId));
            if (!patient) return;

            // جمع الأدوية المختارة مع كل التفاصيل
            const medications = selectedMedications.map(med => ({
                name: med.name,
                dose: med.dose,
                form: med.form,
                frequency: med.frequency,
                frequencyLabel: frequencyLabels[med.frequency],
                timing: med.timing,
                days: med.days,
                quantity: med.quantity
            }));

            // بناء وصف الأدوية بصيغة نصية مقروءة
            const prescriptionText = medications.length > 0 
                ? medications.map(m => `${m.name} ${m.dose} - ${m.form}, ${frequencyLabels[m.frequency]} ${m.timing} for ${m.days} days`).join('; ')
                : 'No medications prescribed';

            // جمع الأعراض الخطيرة والوصف
            const redFlags = selectedRedFlags.map(symptom => ({
                name: symptom.name,
                category: symptom.category
            }));
            const redFlagsDescription = document.getElementById('redFlagDescription').value;

            const visit = {
                date: new Date().toISOString().split('T')[0],
                diagnosis: selectedDiseases.map(d => d.name).join(', '),
                diagnoses: selectedDiseases,
                medications: medications,
                prescription: prescriptionText,
                redFlags: redFlags,
                redFlagsDescription: redFlagsDescription,
                notes: document.getElementById('consultationNotes').value,
                condition: document.getElementById('consultationCondition').value
            };

            patient.visits = patient.visits || [];
            patient.visits.unshift(visit);
            patient.lastVisit = visit.date;

            // mark appointment confirmed (completed)
            apt.status = 'confirmed';

            const medicationCount = medications.length;
            const redFlagCount = redFlags.length;
            let successMsg = `✅ Consultation saved`;
            if (medicationCount > 0) successMsg += ` with ${medicationCount} medication(s)`;
            if (redFlagCount > 0) successMsg += ` and ${redFlagCount} red flag(s)`;
            successMsg += '!';
            
            showToast(successMsg, 'success');
            updateAllData();
            // Close consultation modal/page and go to dashboard
            document.querySelector('[id$="ConsultationPage"]') && document.querySelector('[id$="ConsultationPage"]').classList.add('hidden');
            showPage('dashboard');
        }

        // ===== DRUG/MEDICATION AUTO-COMPLETE FUNCTIONS =====
        let selectedMedications = [];

        // Frequency mapping: Convert labels to numbers and back
        const frequencyMap = {
            "Once daily": 1,
            "Twice daily": 2,
            "3 times daily": 3,
            "4 times daily": 4,
            "As needed": 0
        };

        const frequencyLabels = ["As needed", "Once daily", "Twice daily", "3 times daily", "4 times daily"];

        // Calculate quantity automatically: frequency × days
        function calculateQuantity(frequencyValue, days) {
            if (frequencyValue === 0) return 1; // "As needed" = 1 unit
            return Math.max(1, frequencyValue * parseInt(days) || 1);
        }

        // Handle drug search with autocomplete
        function handleDrugSearch(searchTerm) {
            const specialty = doctorProfile.specialty || 'Pediatrics';
            const container = document.getElementById('drugAutocomplete');

            if (!searchTerm.trim()) {
                container.style.display = 'none';
                return;
            }

            const drugs = drugsBySpecialty[specialty] || [];
            const searchLower = searchTerm.toLowerCase();
            
            const results = drugs.filter(drug => 
                drug.toLowerCase().includes(searchLower)
            ).slice(0, 10);

            if (results.length === 0) {
                container.innerHTML = '<div style="padding:12px;color:var(--text-secondary);">No drugs found</div>';
                container.style.display = 'block';
                return;
            }

            container.innerHTML = results.map(drug => `
                <div class="drug-autocomplete-item" onclick="addSelectedDrug('${drug.replace(/'/g, "\\'")}')">
                    💊 ${drug}
                </div>
            `).join('');
            container.style.display = 'block';
        }

        // Add drug with initial defaults
        function addSelectedDrug(drugName) {
            if (selectedMedications.find(m => m.name === drugName)) {
                showToast('This medication is already added', 'warning');
                return;
            }

            const frequency = 2; // "Twice daily" as default
            const days = 7;
            const quantity = calculateQuantity(frequency, days);

            selectedMedications.push({
                name: drugName,
                dose: "500 mg",
                form: "Tablet",
                frequency: frequency,
                timing: "After food",
                days: days,
                quantity: quantity,
                expanded: false  // Track expanded/collapsed state
            });

            document.getElementById('consultationDrugSearch').value = '';
            document.getElementById('drugAutocomplete').style.display = 'none';
            renderSelectedMedications();
        }

        // Update any medication field with auto-calculation
        function updateMedicationDetail(drugName, field, value) {
            const med = selectedMedications.find(m => m.name === drugName);
            if (!med) return;

            // Preserve expanded state before updating
            const wasExpanded = med.expanded;
            med[field] = value;

            // Auto-calculate quantity when frequency or days change
            if (field === 'frequency' || field === 'days') {
                med.quantity = calculateQuantity(med.frequency, med.days);
            }

            // Restore expanded state
            med.expanded = wasExpanded;
            renderSelectedMedications();
        }

        // Remove medication from list
        function removeSelectedMedication(drugName) {
            selectedMedications = selectedMedications.filter(m => m.name !== drugName);
            renderSelectedMedications();
        }

        // Render medications with new enhanced UI - Collapsed/Expandable
        function renderSelectedMedications() {
            const container = document.getElementById('selectedMedications');

            if (selectedMedications.length === 0) {
                container.innerHTML = '';
                return;
            }

            container.innerHTML = selectedMedications.map((med, idx) => `
                <div class="medication-card" id="med-card-${idx}">
                    <!-- Collapsed View (Default) -->
                    <div class="med-collapsed" onclick="toggleMedicationExpand(${idx})">
                        <div class="med-collapsed-info">
                            <strong>💊 ${med.name}</strong>
                            <span class="med-collapsed-details">${med.dose} • ${med.form}</span>
                        </div>
                        <div class="med-collapsed-right">
                            <span class="med-quick-info">${frequencyLabels[med.frequency]} × ${med.days}d = ${med.quantity} units</span>
                            <span class="med-toggle-arrow" id="arrow-${idx}">${med.expanded ? '▲' : '▼'}</span>
                        </div>
                    </div>

                    <!-- Expanded View (Hidden by default) -->
                    <div class="med-expanded ${med.expanded ? '' : 'hidden'}" id="med-expand-${idx}">
                        <div class="med-fields-compact">
                            <!-- Row 1: Dose, Form -->
                            <div class="med-field-inline">
                                <label>Dose</label>
                                <input 
                                    type="text" 
                                    value="${med.dose}" 
                                    placeholder="e.g. 500 mg"
                                    onchange="updateMedicationDetail('${med.name.replace(/'/g, "\\'")}', 'dose', this.value)"
                                >
                            </div>
                            <div class="med-field-inline">
                                <label>Form</label>
                                <select onchange="updateMedicationDetail('${med.name.replace(/'/g, "\\'")}', 'form', this.value)">
                                    <option value="Tablet" ${med.form === 'Tablet' ? 'selected' : ''}>Tablet</option>
                                    <option value="Capsule" ${med.form === 'Capsule' ? 'selected' : ''}>Capsule</option>
                                    <option value="Syrup" ${med.form === 'Syrup' ? 'selected' : ''}>Syrup</option>
                                    <option value="Injection" ${med.form === 'Injection' ? 'selected' : ''}>Injection</option>
                                    <option value="Cream" ${med.form === 'Cream' ? 'selected' : ''}>Cream</option>
                                    <option value="Ointment" ${med.form === 'Ointment' ? 'selected' : ''}>Ointment</option>
                                </select>
                            </div>

                            <!-- Row 2: Frequency, Days -->
                            <div class="med-field-inline">
                                <label>Frequency</label>
                                <select onchange="updateMedicationDetail('${med.name.replace(/'/g, "\\'")}', 'frequency', parseInt(this.value))">
                                    <option value="0" ${med.frequency === 0 ? 'selected' : ''}>As needed</option>
                                    <option value="1" ${med.frequency === 1 ? 'selected' : ''}>Once daily</option>
                                    <option value="2" ${med.frequency === 2 ? 'selected' : ''}>Twice daily</option>
                                    <option value="3" ${med.frequency === 3 ? 'selected' : ''}>3x daily</option>
                                    <option value="4" ${med.frequency === 4 ? 'selected' : ''}>4x daily</option>
                                </select>
                            </div>
                            <div class="med-field-inline">
                                <label>Days</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="90" 
                                    value="${med.days}" 
                                    onchange="updateMedicationDetail('${med.name.replace(/'/g, "\\'")}', 'days', this.value)"
                                >
                            </div>

                            <!-- Row 3: Timing, Quantity -->
                            <div class="med-field-inline">
                                <label>Timing</label>
                                <select onchange="updateMedicationDetail('${med.name.replace(/'/g, "\\'")}', 'timing', this.value)">
                                    <option value="After food" ${med.timing === 'After food' ? 'selected' : ''}>After food</option>
                                    <option value="Before food" ${med.timing === 'Before food' ? 'selected' : ''}>Before food</option>
                                    <option value="Anytime" ${med.timing === 'Anytime' ? 'selected' : ''}>Anytime</option>
                                </select>
                            </div>
                            <div class="med-field-inline">
                                <label>Total Units</label>
                                <input 
                                    type="number" 
                                    value="${med.quantity}" 
                                    readonly
                                    title="Auto: ${med.frequency > 0 ? med.frequency + ' × ' + med.days : 'as needed'}"
                                >
                            </div>
                        </div>

                        <!-- Summary + Remove -->
                        <div class="med-expanded-footer">
                            <span class="med-expanded-summary">
                                📋 ${med.frequency === 0 ? 'As needed' : `${med.frequency}× daily for ${med.days} days`} | ⏰ ${med.timing}
                            </span>
                            <button 
                                type="button" 
                                class="medication-remove-compact"
                                onclick="removeSelectedMedication('${med.name.replace(/'/g, "\\'")}')"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Toggle medication card expand/collapse
        function toggleMedicationExpand(idx) {
            const med = selectedMedications[idx];
            if (!med) return;
            
            // Toggle the expanded state in data
            med.expanded = !med.expanded;
            
            // Re-render to apply the state
            renderSelectedMedications();
        }
