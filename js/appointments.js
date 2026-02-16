
        // Save Appointment
        function saveAppointment(e) {
            e.preventDefault();
            const appointment = {
                id: appointments.length + 1,
                patientId: document.getElementById('appointmentPatient').value,
                date: document.getElementById('appointmentDate').value,
                time: document.getElementById('appointmentTime').value,
                status: document.getElementById('appointmentStatus').value,
                notes: document.getElementById('appointmentNotes').value
            };
            
            appointments.push(appointment);
            closeModal('addAppointmentModal');
            document.getElementById('appointmentForm').reset();
            showToast('Appointment added successfully!', 'success');
            updateAllData();
        }

        // Edit Appointment
        function editAppointment(id) {
            const apt = appointments.find(a => a.id === id);
            if (!apt) return;
            
            const patient = patients.find(p => p.id === apt.patientId);
            
            document.getElementById('editAppointmentId').value = id;
            document.getElementById('editAppointmentPatientName').value = patient ? patient.name : 'Unknown';
            document.getElementById('editAppointmentDate').value = apt.date;
            document.getElementById('editAppointmentTime').value = apt.time;
            document.getElementById('editAppointmentStatus').value = apt.status;
            document.getElementById('editAppointmentNotes').value = apt.notes;
            
            document.getElementById('editAppointmentModal').classList.add('active');
        }

        // Update Appointment
        function updateAppointment(e) {
            e.preventDefault();
            const id = parseInt(document.getElementById('editAppointmentId').value);
            const apt = appointments.find(a => a.id === id);
            
            if (apt) {
                apt.date = document.getElementById('editAppointmentDate').value;
                apt.time = document.getElementById('editAppointmentTime').value;
                apt.status = document.getElementById('editAppointmentStatus').value;
                apt.notes = document.getElementById('editAppointmentNotes').value;
                
                closeModal('editAppointmentModal');
                showToast('Appointment updated successfully!', 'success');
                updateAllData();
            }
        }

        // Delete Appointment
        function deleteAppointment(id) {
            if (confirm('Are you sure you want to delete this appointment?')) {
                appointments = appointments.filter(a => a.id !== id);
                showToast('Appointment deleted successfully!', 'success');
                updateAllData();
            }
        }

        
        function renderAppointmentsList(date) {
            const dayAppointments = appointments.filter(a => a.date === date);
            const container = document.getElementById('appointmentsList');
            
            document.getElementById('appointmentsTitle').textContent = `Appointments for ${date}`;
            
            if (dayAppointments.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📅</div>
                        <div class="empty-state-title">No Appointments</div>
                        <p>No appointments scheduled for this day</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = dayAppointments.map(apt => {
                const patient = patients.find(p => p.id === apt.patientId);
                const statusClass = apt.status === 'confirmed' ? 'appointment-confirmed' : 'appointment-pending';
                
                return `
                    <div class="appointment-item ${statusClass}">
                        <div class="appointment-info">
                            <div class="appointment-time">${apt.time}</div>
                            <div class="appointment-patient">Patient: ${patient ? patient.name : 'Unknown'}</div>
                            <div style="color: var(--text-secondary); font-size: 13px;">ID: ${apt.patientId}</div>
                        </div>
                        <div class="appointment-actions">
                            <span class="badge ${apt.status === 'confirmed' ? 'badge-success' : 'badge-warning'}">
                                ${apt.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                            </span>
                            ${apt.status === 'pending' ? `
                                            <button class="action-btn btn-success" onclick="startConsultation(${apt.id})" title="Accept & Consult">
                                                ✅
                                            </button>
                                        ` : ''}
                            <button class="action-btn btn-primary" onclick="editAppointment(${apt.id})" title="Edit">
                                ✏️
                            </button>
                            <button class="action-btn btn-danger" onclick="deleteAppointment(${apt.id})" title="Delete">
                                🗑️
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
     // Calendar Functions
        function renderCalendar() {
            const grid = document.getElementById('calendarGrid');
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            document.getElementById('calendarTitle').textContent = `${monthNames[currentMonth]} ${currentYear}`;
            
            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const today = new Date().toISOString().split('T')[0];
            
            let html = `
                <div class="calendar-day-header">Sun</div>
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
            `;
            
            for (let i = 0; i < firstDay; i++) {
                html += '<div></div>';
            }
            
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayAppointments = appointments.filter(a => a.date === dateStr);
                const isToday = dateStr === today;
                const isSelected = dateStr === selectedDate;
                
                let classes = 'calendar-day';
                if (dayAppointments.length > 0) classes += ' has-appointments';
                if (isToday) classes += ' today';
                if (isSelected) classes += ' selected';
                
                html += `
                    <div class="${classes}" onclick="selectDate('${dateStr}')">
                        <div class="day-number">${day}</div>
                        ${dayAppointments.length > 0 ? `<div class="day-appointments">${dayAppointments.length} apt${dayAppointments.length > 1 ? 's' : ''}</div>` : ''}
                    </div>
                `;
            }
            
            grid.innerHTML = html;
            renderAppointmentsList(selectedDate);
        }

        function selectDate(date) {
            selectedDate = date;
            renderCalendar();
        }

        function changeMonth(delta) {
            currentMonth += delta;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            } else if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        }

        function goToToday() {
            const today = new Date();
            currentMonth = today.getMonth();
            currentYear = today.getFullYear();
            selectedDate = today.toISOString().split('T')[0];
            renderCalendar();
        }

                // Update Dashboard
        function updateDashboard() {
            document.getElementById('totalPatients').textContent = patients.length;
            
            const today = new Date().toISOString().split('T')[0];
            const todayAppts = appointments.filter(a => a.date === today);
            document.getElementById('todayAppointments').textContent = todayAppts.length;
            
            const pendingAppts = todayAppts.filter(a => a.status === 'pending');
            document.getElementById('pendingAppointments').textContent = pendingAppts.length;
            
            const confirmedAppts = todayAppts.filter(a => a.status === 'confirmed');
            document.getElementById('confirmedAppointments').textContent = confirmedAppts.length;
            
            const list = document.getElementById('todayAppointmentsList');
            if (todayAppts.length === 0) {
                list.innerHTML = '<div class="empty-state"><p>No appointments today</p></div>';
            } else {
                list.innerHTML = todayAppts.map(apt => {
                    const patient = patients.find(p => p.id === apt.patientId);
                    const statusClass = apt.status === 'confirmed' ? 'appointment-confirmed' : 'appointment-pending';
                    
                    return `
                        <div class="appointment-item ${statusClass}">
                            <div class="appointment-info">
                                <div class="appointment-time">${apt.time}</div>
                                <div class="appointment-patient">Patient: ${patient ? patient.name : 'Unknown'}</div>
                            </div>
                            <div class="appointment-actions">
                                <span class="badge ${apt.status === 'confirmed' ? 'badge-success' : 'badge-warning'}">
                                    ${apt.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                </span>
                                ${apt.status === 'pending' ? `
                                    <button class="action-btn btn-success" onclick="startConsultation(${apt.id})">
                                        ✅
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Update patient selects
        function updatePatientSelects() {
            const select = document.getElementById('appointmentPatient');
            select.innerHTML = '<option value="">-- Select Patient --</option>';
            patients.forEach(p => {
                select.innerHTML += `<option value="${p.id}">${p.name} (${p.id})</option>`;
            });
        }

        // Confirm Appointment
        function confirmAppointment(id) {
            const apt = appointments.find(a => a.id === id);
            if (apt) {
                apt.status = 'confirmed';
                showToast('Appointment confirmed!', 'success');
                updateAllData();
            }
        }