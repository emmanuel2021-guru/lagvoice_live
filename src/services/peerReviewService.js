import api from './api';

export const peerReviewService = {
  async submitReview(data) {
    const response = await api.post('/peer-reviews', data);
    return response.review;
  },

  async getMyReviews() {
    const response = await api.get('/peer-reviews');
    return response.reviews;
  },

  async getFacultyList() {
    const response = await api.get('/peer-reviews/faculty-list');
    return response.faculty;
  }
};
