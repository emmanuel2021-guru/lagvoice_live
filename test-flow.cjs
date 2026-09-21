const axios = require('axios');

async function runTests() {
  const baseURL = 'http://localhost:3000/api';
  let token = '';

  try {
    console.log('Testing Registration...');
    const regRes = await axios.post(`${baseURL}/auth/register`, {
      name: 'Test Staff',
      email: 'teststaff2@unilag.edu.ng',
      password: 'Password123',
      role: 'staff',
      staffId: 'STF/2026/001',
      department: 'Engineering',
      faculty: 'Technology'
    });
    console.log('Registration Success:', regRes.data.user.email);
    token = regRes.data.token;

    console.log('Testing Update Profile...');
    const updateRes = await axios.put(`${baseURL}/auth/me`, {
      name: 'Updated Staff',
      department: 'Advanced Engineering',
      faculty: 'Technology'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Update Profile Success:', updateRes.data.user.department);

    console.log('Testing Ticket Creation...');
    const ticketRes = await axios.post(`${baseURL}/tickets`, {
      title: 'Broken Projector',
      description: 'The projector in Hall A is broken.',
      category: 'Infrastructure',
      urgency: 'high'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Ticket Creation Success:', ticketRes.data.ticket.title);

    console.log('Testing Fetch Tickets (Staff sees all)...');
    const fetchRes = await axios.get(`${baseURL}/tickets`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Fetch Tickets Success. Count:', fetchRes.data.count);
    
    console.log('ALL TESTS PASSED.');
    process.exit(0);
  } catch (err) {
    console.error('TEST FAILED:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

runTests();
