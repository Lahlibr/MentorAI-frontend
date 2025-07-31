// export class ReviewerService{
//   static async submitForReview(data:CreateReviewRequest): Promise<Review> {
//     return apiCall<ReviewDto>('/reviews', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }
//   static async getMyReviews(): Promise<ReviewDto[]> {
//     return apiCall<ReviewDto[]>('/reviews/my-reviews');
//   }
//   static async getPendingReview(): Promise<ReviewDto> {
//     return apiCall<ReviewDto[]>(`/reviews/${id}`);
//   }
//   static async submitReview(id: string, data: SubmitReviewRequest): Promise<Review> {
//     return apiCall<Review>(`/reviews/${id}/submit`, {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }
//   static async getById(id: string): Promise<Review> {
//     return apiCall<Review>(`/reviews/${id}`);
//   }
// }