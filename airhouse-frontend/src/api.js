const BASE_URL = 'http://localhost:8089/api/v1';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 204) {
    return null;
  }

  // Handle PDF/binary responses (like invoice)
  const contentType = response.headers.get('content-type');
  if (contentType && (contentType.includes('text/plain') || contentType.includes('application/octet-stream') || contentType.includes('pdf'))) {
    return await response.text();
  }

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error?.message || 'Something went wrong');
  }

  // Handle API envelope: { data: ..., timeStamp: ..., error: ... }
  // Note: some responses might not be wrapped, let's fallback to the full JSON
  return Object.prototype.hasOwnProperty.call(json, 'data') ? json.data : json;
}

export const api = {
  // Authentication
  login: (email, password) => 
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    
  signup: (email, password, name) => 
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  refresh: () => 
    request('/auth/refresh', {
      method: 'POST',
    }),

  // User Profile
  getProfile: () => request('/users/profile'),
  updateProfile: (profileData) => 
    request('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    }),

  // Guest Management
  getMyGuests: () => request('/users/me/guests'),
  addNewGuest: (guestData) => 
    request('/users/guests', {
      method: 'POST',
      body: JSON.stringify(guestData),
    }),
  updateGuest: (guestId, guestData) => 
    request(`/users/guests/${guestId}`, {
      method: 'PUT',
      body: JSON.stringify(guestData),
    }),
  deleteGuest: (guestId) => 
    request(`/users/guests/${guestId}`, {
      method: 'DELETE',
    }),

  // Hotel Browsing
  searchHotels: (searchParams) => 
    request('/hotels/search', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    }),
  getHotelInfo: (hotelId, filterParams) => {
    // getHotelInfo handles optionally sending HotelInfoRequestDTO in body or query,
    // let's send it in body as per the controller mapping (@RequestBody(required = false))
    return request(`/hotels/${hotelId}/info`, {
      method: 'POST',
      body: filterParams ? JSON.stringify(filterParams) : undefined,
    });
  },

  // Booking Flow
  initializeBooking: (bookingRequest) => 
    request('/bookings/init', {
      method: 'POST',
      body: JSON.stringify(bookingRequest),
    }),
  addGuestsToBooking: (bookingId, guestDTOList) => 
    request(`/bookings/${bookingId}/guest`, {
      method: 'POST',
      body: JSON.stringify(guestDTOList),
    }),
  initiatePayment: (bookingId) => 
    request(`/bookings/${bookingId}/payments`, {
      method: 'POST',
    }),
  verifyPayment: (bookingId, razorpayResponse) => 
    request(`/bookings/${bookingId}/payments/verify`, {
      method: 'POST',
      body: JSON.stringify(razorpayResponse),
    }),
  recordFailedPayment: (bookingId, failureRequest) => 
    request(`/bookings/${bookingId}/payments/failed`, {
      method: 'POST',
      body: JSON.stringify(failureRequest),
    }),
  cancelBooking: (bookingId) => 
    request(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
    }),
  getBookingStatus: (bookingId) => 
    request(`/bookings/${bookingId}/status`),
  getMyBookings: () => request('/users/myBookings'),
  getMyPayments: () => request('/users/me/payments'),
  downloadInvoiceUrl: (bookingId) => `${BASE_URL}/bookings/${bookingId}/invoice`,

  // Manager Operations
  manager: {
    getAllHotels: () => request('/admin/hotels'),
    getHotel: (hotelId) => request(`/admin/hotels/${hotelId}`),
    createHotel: (hotelDTO) => 
      request('/admin/hotels', {
        method: 'POST',
        body: JSON.stringify(hotelDTO),
      }),
    updateHotel: (hotelId, hotelDTO) => 
      request(`/admin/hotels/${hotelId}`, {
        method: 'PUT',
        body: JSON.stringify(hotelDTO),
      }),
    deleteHotel: (hotelId) => 
      request(`/admin/hotels/${hotelId}`, {
        method: 'DELETE',
      }),
    activateHotel: (hotelId) => 
      request(`/admin/hotels/${hotelId}`, {
        method: 'PATCH',
      }),
    getBookings: (hotelId) => request(`/admin/hotels/${hotelId}/bookings`),
    getReport: (hotelId, startDate, endDate) => {
      let url = `/admin/hotels/${hotelId}/reports`;
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length) url += `?${params.join('&')}`;
      return request(url);
    },
    
    // Rooms management
    getRooms: (hotelId) => request(`/admin/hotels/${hotelId}/rooms`),
    getRoom: (hotelId, roomId) => request(`/admin/hotels/${hotelId}/rooms/${roomId}`),
    createRoom: (hotelId, roomDTO) => 
      request(`/admin/hotels/${hotelId}/rooms`, {
        method: 'POST',
        body: JSON.stringify(roomDTO),
      }),
    deleteRoom: (hotelId, roomId) => 
      request(`/admin/hotels/${hotelId}/rooms/${roomId}`, {
        method: 'DELETE',
      }),
    updateRoomInventory: (hotelId, roomId, inventoryUpdateRequest) => 
      request(`/admin/hotels/${hotelId}/rooms/${roomId}/inventory`, {
        method: 'PATCH',
        body: JSON.stringify(inventoryUpdateRequest),
      }),
  }
};
