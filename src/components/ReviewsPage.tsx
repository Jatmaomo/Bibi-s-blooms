import React, { useState, useEffect } from 'react';
import { Review, CATEGORIES } from '../types';
import { subscribeToReviews, addReviewToFirestore } from '../lib/firebase';
import { Logo } from './Logo';
import {
  Star,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Send,
  ThumbsUp,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Plus,
  X,
} from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter state
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Helpful votes state (local)
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  // Review Form state
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState<number>(5);
  const [formHoverRating, setFormHoverRating] = useState<number>(0);
  const [formWearPurchased, setFormWearPurchased] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Subscribe to reviews from Firestore in real time
  useEffect(() => {
    const unsubscribe = subscribeToReviews(
      (updatedReviews) => {
        setReviews(updatedReviews);
        setIsLoading(false);
      },
      (err) => {
        console.warn('Reviews subscription notice:', err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!formComment.trim()) {
      setFormError('Please write your review comment.');
      return;
    }

    setFormSubmitting(true);

    try {
      await addReviewToFirestore({
        customerName: formName.trim(),
        rating: formRating,
        comment: formComment.trim(),
        wearPurchased: formWearPurchased.trim() || 'Ready-to-Wear Garment',
        location: formLocation.trim() || 'Nigeria',
        verified: true,
      });

      setFormSuccess(true);
      setFormName('');
      setFormRating(5);
      setFormWearPurchased('');
      setFormLocation('');
      setFormComment('');

      setTimeout(() => {
        setFormSuccess(false);
        setIsFormOpen(false);
      }, 2500);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setFormError(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Metrics calculations
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const fourStarCount = reviews.filter((r) => r.rating === 4).length;
  const threeStarCount = reviews.filter((r) => r.rating === 3).length;

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesRating =
      selectedRatingFilter === 'all' || r.rating === selectedRatingFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.wearPurchased &&
        r.wearPurchased.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.location && r.location.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRating && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Header Banner */}
      <div className="text-center flex flex-col items-center mb-12">
        <Logo size="lg" showTagline={false} className="mb-4" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
            Client Experiences &amp; Praise
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-luxury text-white tracking-wider">
          CUSTOMER REVIEWS
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-2xl">
          Authentic feedback from gentlemen wearing{' '}
          <span className="text-[#c5a059] font-bold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]">
            Bibi&apos;s Blooms
          </span>{' '}
          luxury ready-to-wear menswear. All pieces are ready-made garments ready for prompt delivery.
        </p>
        <div className="w-20 h-0.5 bg-[#c5a059] mt-4" />
      </div>

      {/* Ratings Overview Card (shown when there are reviews) */}
      {totalReviews > 0 ? (
        <div className="bg-[#121318] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Col 1: Average Score */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-zinc-800 pb-6 md:pb-0 md:pr-8">
              <span className="text-5xl sm:text-6xl font-black text-white font-luxury">
                {averageRating}
              </span>
              <div className="flex items-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-5 h-5 fill-[#c5a059] text-[#c5a059]"
                  />
                ))}
              </div>
              <span className="text-xs text-zinc-400 font-medium">
                Based on {totalReviews} verified customer review{totalReviews > 1 ? 's' : ''}
              </span>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>100% Ready-to-Wear Satisfaction</span>
              </div>
            </div>

            {/* Col 2: Star Distribution */}
            <div className="space-y-2 border-b md:border-b-0 md:border-r border-zinc-800 pb-6 md:pb-0 md:pr-8">
              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 text-zinc-400 font-medium">5 Stars</span>
                <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c5a059] rounded-full"
                    style={{
                      width: `${(fiveStarCount / totalReviews) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right text-zinc-400">{fiveStarCount}</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 text-zinc-400 font-medium">4 Stars</span>
                <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c5a059]/70 rounded-full"
                    style={{
                      width: `${(fourStarCount / totalReviews) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right text-zinc-400">{fourStarCount}</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 text-zinc-400 font-medium">3 Stars</span>
                <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-600 rounded-full"
                    style={{
                      width: `${(threeStarCount / totalReviews) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right text-zinc-400">{threeStarCount}</span>
              </div>
            </div>

            {/* Col 3: Write a Review CTA */}
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <h3 className="text-base font-bold text-white font-luxury">
                Purchased a Wear?
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs">
                Help fellow gentlemen choose their next luxury wear by sharing your honest feedback.
              </p>
              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                id="write-review-cta-btn"
                className="px-6 py-3 rounded-lg bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                {isFormOpen ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Close Review Form</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add Your Review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Real Empty State: When nobody has added a review yet */
        <div className="bg-[#121318] border border-zinc-800 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto mb-12 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/40 flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(197,160,89,0.25)]">
            <MessageSquare className="w-8 h-8 text-[#c5a059]" />
          </div>
          <h2 className="text-2xl font-bold font-luxury text-white mb-2">
            NO REVIEWS YET
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
            Nobody has added a review yet. Be the first gentleman to share your genuine experience with{' '}
            <span className="text-[#c5a059] font-semibold">Bibi&apos;s Blooms</span> ready-to-wear pieces.
          </p>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            id="first-review-btn"
            className="px-8 py-3.5 rounded-lg bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-transform hover:-translate-y-0.5"
          >
            {isFormOpen ? (
              <>
                <X className="w-4 h-4" />
                <span>Close Form</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Be The First To Review</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Review Submission Form Modal / Accordion */}
      {isFormOpen && (
        <div className="bg-[#121318] border-2 border-[#c5a059]/40 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#c5a059]" />
              <h2 className="text-xl font-bold font-luxury text-white">
                LEAVE YOUR REVIEW
              </h2>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {formSuccess ? (
            <div className="p-8 text-center bg-black/90 border border-[#c5a059]/50 rounded-xl space-y-3 shadow-[0_0_25px_rgba(197,160,89,0.2)]">
              <CheckCircle className="w-12 h-12 text-[#c5a059] mx-auto" />
              <h3 className="text-lg font-bold text-white font-luxury">Thank You for Your Review!</h3>
              <p className="text-xs sm:text-sm text-zinc-300">
                Your feedback has been saved and published to Bibi&apos;s Blooms client reviews.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-6">
              {formError && (
                <div className="p-3 bg-red-950/50 border border-red-500/40 text-red-300 text-xs rounded-lg">
                  {formError}
                </div>
              )}

              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Your Overall Rating <span className="text-[#c5a059]">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setFormHoverRating(star)}
                      onMouseLeave={() => setFormHoverRating(0)}
                      onClick={() => setFormRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (formHoverRating || formRating)
                            ? 'fill-[#c5a059] text-[#c5a059]'
                            : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-[#c5a059] font-bold ml-2">
                    {formRating} out of 5 Stars
                  </span>
                </div>
              </div>

              {/* Row: Name and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Your Full Name <span className="text-[#c5a059]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Adebayo Benson"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] rounded-lg text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos, Abuja, Port Harcourt"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] rounded-lg text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Wear Purchased */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Which Wear / Piece Did You Purchase?
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Imperial Black Senator Wear or Kaftan"
                    value={formWearPurchased}
                    onChange={(e) => setFormWearPurchased(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] rounded-lg text-sm text-white focus:outline-none"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setFormWearPurchased(e.target.value);
                    }}
                    className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 rounded-lg focus:outline-none focus:border-[#c5a059]"
                  >
                    <option value="">Select Category Quick-Fill</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Detailed Review Comment */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Review &amp; Feedback <span className="text-[#c5a059]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about the fabric quality, ready-to-wear fit, packaging, or delivery speed..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] rounded-lg text-sm text-white focus:outline-none leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 text-xs uppercase font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-8 py-3 rounded-lg bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Filter and Search Bar (Only shown when reviews exist) */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-800">
          {/* Rating Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <button
              onClick={() => setSelectedRatingFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-colors whitespace-nowrap ${
                selectedRatingFilter === 'all'
                  ? 'bg-[#c5a059] text-black'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setSelectedRatingFilter(5)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-colors flex items-center gap-1 whitespace-nowrap ${
                selectedRatingFilter === 5
                  ? 'bg-[#c5a059] text-black'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>5 Stars ({fiveStarCount})</span>
            </button>
            <button
              onClick={() => setSelectedRatingFilter(4)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-colors flex items-center gap-1 whitespace-nowrap ${
                selectedRatingFilter === 4
                  ? 'bg-[#c5a059] text-black'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>4 Stars ({fourStarCount})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-36 animate-pulse"
            />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((review) => {
              const votes = helpfulVotes[review.id] || 0;
              return (
                <div
                  key={review.id}
                  className="bg-[#121318] border border-zinc-800 hover:border-[#c5a059]/40 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between shadow-md"
                >
                  <div>
                    {/* Top Bar: Reviewer Info + Rating */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar initial */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c5a059] to-[#846b32] text-black font-bold font-luxury flex items-center justify-center text-sm shadow-md flex-shrink-0">
                          {review.customerName.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white font-luxury">
                              {review.customerName}
                            </h4>
                            {review.verified && (
                              <span
                                className="inline-flex items-center gap-1 text-[10px] text-[#c5a059] font-semibold"
                                title="Verified Buyer"
                              >
                                <CheckCircle className="w-3 h-3 text-[#c5a059]" />
                                <span>Verified</span>
                              </span>
                            )}
                          </div>
                          {review.location && (
                            <span className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#c5a059]" />
                              <span>{review.location}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Star Icons */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= review.rating
                                ? 'fill-[#c5a059] text-[#c5a059]'
                                : 'text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Wear purchased badge if present */}
                    {review.wearPurchased && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-[#c5a059] font-medium mb-3">
                        <ShoppingBag className="w-3 h-3 text-[#c5a059]" />
                        <span>{review.wearPurchased}</span>
                      </div>
                    )}

                    {/* Comment Text */}
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>

                  {/* Footer: Date & Helpful Action */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                    <span>
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>

                    <button
                      onClick={() => handleHelpfulClick(review.id)}
                      className="flex items-center gap-1.5 text-zinc-400 hover:text-[#c5a059] transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Helpful ({votes})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
            No reviews matched your search criteria.
          </div>
        )
      ) : null}
    </div>
  );
};
