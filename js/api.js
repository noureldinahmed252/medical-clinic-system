// ========================
// API Configuration & Service
// ========================

const BASE_URL = "https://expansively-nuciform-saran.ngrok-free.dev";

// Generic API Request Handler
async function apiRequest(endpoint, method = "GET", body = null) {
    try {
        const token = localStorage.getItem("authToken");

        console.log(`📡 ${method} ${endpoint}`);

        const response = await fetch(BASE_URL + endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
                ...(token && { Authorization: "Bearer " + token })
            },
            body: body ? JSON.stringify(body) : null
        });

        console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
        
        // Get response text first
        const responseText = await response.text();
        console.log(`📄 Response Body:`, responseText);

        // Try to parse JSON safely
        let data = {};
        if (responseText) {
            try {
                data = JSON.parse(responseText);
            } catch {
                console.error("❌ Invalid JSON response:", responseText);
                throw new Error("Server returned invalid response");
            }
        }

        // Handle unauthorized - give better error message
        if (response.status === 401) {
            localStorage.removeItem("authToken");
            // Use the API message if available (e.g., "Invalid email or password")
            const errorMsg = data.message || "Invalid credentials or session expired";
            throw new Error(errorMsg);
        }

        if (!response.ok) {
            // Clean error messages STRICTLY to remove file paths and dangerous content
            let errorMessage = data.message || `Error: ${response.status}`;
            
            // 🔥 STRICT CLEANING - Remove all dangerous patterns
            errorMessage = String(errorMessage)
                // Remove Windows paths (C:\, D:\, etc.)
                .replace(/[A-Z]:\\[^\s"]*/gi, '[path]')
                // Remove Unix/Linux paths (/home/, /root/, etc.)
                .replace(/\/[a-zA-Z0-9_\-\/]+/g, '[path]')
                // Remove file extensions patterns
                .replace(/\.[a-zA-Z0-9]{2,}:/g, '[error]')
                // Remove stack traces
                .replace(/at\s+[^\n]*/gi, '')
                // Remove function calls with paths
                .replace(/\([^()]*[A-Z]:\\[^)]*\)/gi, '[error]')
                // Remove URLs that might navigate
                .replace(/https?:\/\/[^\s]*/gi, '[url]')
                // Keep only first line
                .split('\n')[0]
                // Trim whitespace
                .trim();
            
            // Fallback message for status codes
            if (!errorMessage || errorMessage.length === 0) {
                if (response.status === 401) {
                    errorMessage = 'Invalid email or password';
                } else if (response.status === 404) {
                    errorMessage = 'Server not available';
                } else if (response.status === 500) {
                    errorMessage = 'Server error';
                } else {
                    errorMessage = 'Connection error';
                }
            }
            
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error("🔴 API Error:", error);
        throw error;
    }
}

// ========================
// AUTH ENDPOINTS
// ========================

// Login Doctor - Correct endpoint
async function apiLogin(email, password) {
    console.log("🔐 Attempting login...");
    const response = await apiRequest("/api/auth/doctor/login", "POST", {
        email: email,
        password: password
    });
    
    console.log("✅ Login response:", response);
    
    // Save token if returned - using authToken consistently
    const token = response.token || response.access_token || response.data?.token;

    if (token) {
        localStorage.setItem('authToken', token);
        console.log("🔑 Token saved in authToken:", token.substring(0, 20) + "...");
    } else {
        console.warn("⚠️ No token in login response");
    }
    
    return response;
}

// Register Doctor - Correct endpoint
async function apiSignup(signupData) {
    console.log("📝 Attempting registration with data:", signupData);
    const response = await apiRequest("/api/auth/doctor/register", "POST", signupData);
    
    console.log("✅ Registration response:", response);
    
    // Save token if returned
    if (response.token) {
        localStorage.setItem("authToken", response.token);
    } else if (response.access_token) {
        localStorage.setItem("authToken", response.access_token);
    } else if (response.data?.token) {
        localStorage.setItem("authToken", response.data.token);
    }
    
    return response;
}

// Register Doctor with Photo Upload
async function apiSignupWithPhoto(formData) {
    try {
        const token = localStorage.getItem("authToken");
        
        console.log("🔐 Attempting doctor registration with photo...");
        console.log("📸 FormData contents:");
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`  ${key}: File - ${value.name} (${value.size} bytes)`);
            } else {
                console.log(`  ${key}: ${value}`);
            }
        }

        const response = await fetch(BASE_URL + "/api/auth/doctor/register", {
            method: "POST",
            headers: {
                "ngrok-skip-browser-warning": "true"
                // NOTE: Don't set Content-Type header, let browser set it with boundary
                // NOTE: No Authorization header - registration is public
            },
            body: formData
        });

        console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
        
        // Get response text first
        const responseText = await response.text();
        console.log(`📄 Response Body:`, responseText);

        // Handle unauthorized
        if (response.status === 401) {
            localStorage.removeItem("authToken");
            throw new Error("Your session has expired. Please login again");
        }

        // Try to parse JSON safely
        let data = {};
        if (responseText) {
            try {
                data = JSON.parse(responseText);
            } catch {
                console.error("❌ Invalid JSON response:", responseText);
                throw new Error("Server returned invalid response");
            }
        }

        if (!response.ok) {
            // Clean error messages STRICTLY to remove file paths and dangerous content
            let errorMessage = data.message || data.Message || `Error: ${response.status}`;
            
            // 🔥 STRICT CLEANING - Remove all dangerous patterns
            errorMessage = String(errorMessage)
                // Remove Windows paths (C:\, D:\, etc.)
                .replace(/[A-Z]:\\[^\s"]*/gi, '[path]')
                // Remove Unix/Linux paths (/home/, /root/, etc.)
                .replace(/\/[a-zA-Z0-9_\-\/]+/g, '[path]')
                // Remove file extensions patterns
                .replace(/\.[a-zA-Z0-9]{2,}:/g, '[error]')
                // Remove stack traces
                .replace(/at\s+[^\n]*/gi, '')
                // Remove function calls with paths
                .replace(/\([^()]*[A-Z]:\\[^)]*\)/gi, '[error]')
                // Remove URLs that might navigate
                .replace(/https?:\/\/[^\s]*/gi, '[url]')
                // Keep only first line
                .split('\n')[0]
                // Trim whitespace
                .trim();
            
            // Fallback message for status codes
            if (!errorMessage || errorMessage.length === 0 || errorMessage === 'An unexpected error occurred. Please try again later.') {
                if (response.status === 401) {
                    errorMessage = 'Invalid email or password';
                } else if (response.status === 404) {
                    errorMessage = 'Server not available';
                } else if (response.status === 500) {
                    errorMessage = 'Data processing error - please check your input';
                } else {
                    errorMessage = 'Connection error - please try again later';
                }
            }
            
            throw new Error(errorMessage);
        }

        console.log("✅ Registration with photo successful:", data);
        
        // Save token if returned
        if (data.token) {
            localStorage.setItem("authToken", data.token);
            console.log("🔑 Token saved to localStorage");
        } else if (data.access_token) {
            localStorage.setItem("authToken", data.access_token);
        } else if (data.data?.token) {
            localStorage.setItem("authToken", data.data.token);
        }
        
        return data;
    } catch (error) {
        console.error("🔴 Registration error:", error);
        throw error;
    }
}

// Get Doctor Profile Data
async function getProfileData(doctorId) {
    try {
        console.log(`📋 Fetching doctor profile for ID: ${doctorId}`);
        const response = await apiRequest(`/api/DoctorProfile/${doctorId}`, "GET");
        
        console.log("✅ Profile data retrieved:", response);
        return response;
    } catch (error) {
        console.error("🔴 Profile fetch error:", error);
        throw error;
    }
}

// Update Doctor Profile
async function apiUpdateProfile(doctorId, formData) {
    try {
        const token = localStorage.getItem("authToken");
        
        console.log("✏️ Attempting to update doctor profile...");
        console.log("📌 Doctor ID:", doctorId);
        console.log("📸 FormData contents:");
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`  ${key}: File - ${value.name} (${value.size} bytes)`);
            } else {
                console.log(`  ${key}: ${value}`);
            }
        }

        const response = await fetch(BASE_URL + `/api/DoctorProfile/${doctorId}`, {
            method: "PUT",
            headers: {
                "ngrok-skip-browser-warning": "true",
                ...(token && { Authorization: "Bearer " + token })
                // NOTE: Don't set Content-Type header, let browser set it with boundary
            },
            body: formData
        });

        console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
        
        // Get response text first
        const responseText = await response.text();
        console.log(`📄 Response Body:`, responseText);

        // Try to parse JSON safely
        let data = {};
        if (responseText) {
            try {
                data = JSON.parse(responseText);
            } catch {
                console.error("❌ Invalid JSON response:", responseText);
                throw new Error("Server returned invalid response");
            }
        }

        if (!response.ok) {
            // Handle error response
            let errorMessage = data.message || data.Message || `Error: ${response.status}`;
            
            // Clean error message
            errorMessage = String(errorMessage)
                .replace(/[A-Z]:\\[^\s"]*/gi, '[path]')
                .replace(/\/[a-zA-Z0-9_\-\/]+/g, '[path]')
                .split('\n')[0]
                .trim();
            
            if (!errorMessage || errorMessage.length === 0) {
                if (response.status === 401) {
                    errorMessage = 'Unauthorized - please login again';
                } else if (response.status === 404) {
                    errorMessage = 'Doctor profile not found';
                } else if (response.status === 400) {
                    errorMessage = data.message || 'Invalid data provided';
                } else {
                    errorMessage = 'Failed to update profile';
                }
            }
            
            throw new Error(errorMessage);
        }

        console.log("✅ Profile updated successfully:", data);
        return data;
    } catch (error) {
        console.error("🔴 Profile update error:", error);
        throw error;
    }
}

// Logout
async function apiLogout() {
    console.log("🚪 Logging out...");
    localStorage.removeItem("authToken");
    console.log("✅ Logged out");
}
