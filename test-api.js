const http = require('http');

// Base URL for API
const baseUrl = 'http://localhost:3000/api/v1';

// Function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/v1${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          console.log(`${method} ${path} - Status: ${res.statusCode}`);
          resolve({ statusCode: res.statusCode, data: parsedData });
        } catch (e) {
          console.log(`${method} ${path} - Error parsing response: ${e.message}`);
          resolve({ statusCode: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      console.error(`Error making request to ${path}: ${error.message}`);
      reject(error);
    });

    if (data && (method === 'POST' || method === 'PUT')) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test functions for each endpoint
async function testHealthcheck() {
  console.log('\n--- Testing Healthcheck Endpoint ---');
  try {
    const response = await makeRequest('GET', '/healthcheck');
    console.log('Healthcheck Response:', response.data);
    return response;
  } catch (error) {
    console.error('Healthcheck test failed:', error);
    return null;
  }
}

async function testUserRegistration() {
  console.log('\n--- Testing User Registration ---');
  try {
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'admin'
    };
    
    const response = await makeRequest('POST', '/auth/register', userData);
    console.log('Registration Response:', response.data);
    return response;
  } catch (error) {
    console.error('Registration test failed:', error);
    return null;
  }
}

async function testUserLogin(email = 'test@example.com', password = 'password123') {
  console.log('\n--- Testing User Login ---');
  try {
    const loginData = {
      email,
      password
    };
    
    const response = await makeRequest('POST', '/auth/login', loginData);
    console.log('Login Response:', response.data);
    return response;
  } catch (error) {
    console.error('Login test failed:', error);
    return null;
  }
}

async function testPartnerCreation(token) {
  console.log('\n--- Testing Partner Creation ---');
  try {
    const partnerData = {
      name: 'Test Partner',
      email: `partner${Date.now()}@example.com`,
      phone: '1234567890',
      address: {
        street: '123 Main St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      },
      serviceArea: [
        {
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345'
        }
      ],
      vehicleType: 'van',
      vehicleCapacity: {
        weight: 1000,
        volume: 10
      },
      userId: '60d0fe4f5311236168a109ca' // This is a placeholder, use actual ID from registration
    };
    
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    const response = await makeRequest('POST', '/partners', partnerData, options);
    console.log('Partner Creation Response:', response.data);
    return response;
  } catch (error) {
    console.error('Partner creation test failed:', error);
    return null;
  }
}

async function testHubCreation(token) {
  console.log('\n--- Testing Hub Creation ---');
  try {
    const hubData = {
      name: 'Test Hub',
      code: `HUB${Date.now()}`,
      type: 'warehouse',
      location: {
        address: {
          street: '456 Main St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        },
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        }
      },
      capacity: {
        maxPackages: 1000,
        currentPackages: 0,
        maxVehicles: 20
      },
      operatingHours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '10:00', close: '16:00' },
        sunday: { open: 'closed', close: 'closed' }
      },
      contactInfo: {
        managerName: 'Test Manager',
        phone: '0987654321',
        email: 'manager@testhub.com'
      },
      serviceArea: [
        {
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          radius: 50
        }
      ]
    };
    
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    const response = await makeRequest('POST', '/hubs', hubData, options);
    console.log('Hub Creation Response:', response.data);
    return response;
  } catch (error) {
    console.error('Hub creation test failed:', error);
    return null;
  }
}

async function testSlotCreation(token, hubId) {
  console.log('\n--- Testing Slot Creation ---');
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startTime = new Date(tomorrow);
    startTime.setHours(9, 0, 0, 0);
    
    const endTime = new Date(tomorrow);
    endTime.setHours(10, 0, 0, 0);
    
    const slotData = {
      hubId: hubId || '60d0fe4f5311236168a109cb', // This is a placeholder, use actual hub ID
      date: tomorrow.toISOString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      type: 'pickup',
      capacity: 5,
      price: 10.99
    };
    
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    const response = await makeRequest('POST', '/slots', slotData, options);
    console.log('Slot Creation Response:', response.data);
    return response;
  } catch (error) {
    console.error('Slot creation test failed:', error);
    return null;
  }
}

async function testAppointmentCreation(token, partnerId, hubId, slotId) {
  console.log('\n--- Testing Appointment Creation ---');
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 30, 0, 0);
    
    const appointmentData = {
      type: 'pickup',
      scheduledTime: tomorrow.toISOString(),
      location: {
        address: {
          street: '789 Main St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        },
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        }
      },
      customer: {
        name: 'Test Customer',
        phone: '1231231234',
        email: 'customer@example.com'
      },
      partnerId: partnerId || '60d0fe4f5311236168a109cc', // This is a placeholder, use actual partner ID
      hubId: hubId || '60d0fe4f5311236168a109cb', // This is a placeholder, use actual hub ID
      slotId: slotId || '60d0fe4f5311236168a109cd', // This is a placeholder, use actual slot ID
      package: {
        size: 'medium',
        weight: 5,
        description: 'Test package',
        specialHandling: false
      },
      priority: 1,
      notes: 'Test appointment',
      userId: '60d0fe4f5311236168a109ca' // This is a placeholder, use actual user ID
    };
    
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    const response = await makeRequest('POST', '/appointments', appointmentData, options);
    console.log('Appointment Creation Response:', response.data);
    return response;
  } catch (error) {
    console.error('Appointment creation test failed:', error);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('Starting API Tests...');
  
  // Test healthcheck
  await testHealthcheck();
  
  // Test user registration and login
  const registrationResponse = await testUserRegistration();
  let token = null;
  let userId = null;
  
  if (registrationResponse && registrationResponse.data && registrationResponse.data.data) {
    token = registrationResponse.data.data.token;
    userId = registrationResponse.data.data.user._id;
    console.log('Got token:', token);
    console.log('User ID:', userId);
  } else {
    // Try login with default credentials
    const loginResponse = await testUserLogin();
    if (loginResponse && loginResponse.data && loginResponse.data.data) {
      token = loginResponse.data.data.token;
      userId = loginResponse.data.data.user._id;
      console.log('Got token from login:', token);
      console.log('User ID from login:', userId);
    }
  }
  
  if (!token) {
    console.log('No authentication token available. Skipping authenticated tests.');
    return;
  }
  
  // Test partner creation
  const partnerResponse = await testPartnerCreation(token);
  let partnerId = null;
  
  if (partnerResponse && partnerResponse.data && partnerResponse.data.data) {
    partnerId = partnerResponse.data.data.partner._id;
    console.log('Partner ID:', partnerId);
  }
  
  // Test hub creation
  const hubResponse = await testHubCreation(token);
  let hubId = null;
  
  if (hubResponse && hubResponse.data && hubResponse.data.data) {
    hubId = hubResponse.data.data.hub._id;
    console.log('Hub ID:', hubId);
  }
  
  // Test slot creation
  const slotResponse = await testSlotCreation(token, hubId);
  let slotId = null;
  
  if (slotResponse && slotResponse.data && slotResponse.data.data) {
    slotId = slotResponse.data.data.slot._id;
    console.log('Slot ID:', slotId);
  }
  
  // Test appointment creation
  await testAppointmentCreation(token, partnerId, hubId, slotId);
  
  console.log('\nAPI Tests Completed!');
}

// Run the tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
});
