"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export type Review = {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
  helpful: number
  isVerified: boolean
}

interface ProductReviewsProps {
  productId: string
  initialReviews?: Review[]
}

export default function ProductReviews({ productId, initialReviews = [] }: ProductReviewsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>({})

  // Load reviews from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedReviews = JSON.parse(localStorage.getItem(`product-reviews-${productId}`) || "[]")
      setReviews(savedReviews)
    }
  }, [productId])

  // Calculate average rating
  const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0] // 5 stars to 1 star
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[5 - review.rating]++
    }
  })

  const handleRatingClick = (rating: number) => {
    setUserRating(rating)
  }

  const handleRatingHover = (rating: number) => {
    setHoverRating(rating)
  }

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to submit a review",
        variant: "destructive",
      })
      return
    }

    if (userRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Review required",
        description: "Please write a review comment",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    // Create new review
    const newReview: Review = {
      id: `review-${Date.now()}`,
      userId: user.id?.toString() || `guest-${Date.now()}`,
      userName: user.name || "Anonymous User",
      rating: userRating,
      comment: comment.trim(),
      date: new Date().toISOString(),
      helpful: 0,
      isVerified: true,
    }

    // Simulate API call
    setTimeout(() => {
      // Add to reviews
      const updatedReviews = [newReview, ...reviews]
      setReviews(updatedReviews)

      // Save to localStorage
      const savedReviews = JSON.parse(localStorage.getItem(`product-reviews-${productId}`) || "[]")
      savedReviews.push(newReview)
      localStorage.setItem(`product-reviews-${productId}`, JSON.stringify(savedReviews))

      // Reset form
      setUserRating(0)
      setComment("")
      setSubmitting(false)

      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      })
    }, 1000)
  }

  const handleHelpfulClick = (reviewId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to mark reviews as helpful",
        variant: "destructive",
      })
      return
    }

    if (helpfulClicked[reviewId]) {
      return
    }

    const updatedReviews = reviews.map((review) =>
      review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review,
    )

    setReviews(updatedReviews)
    setHelpfulClicked((prev) => ({ ...prev, [reviewId]: true }))

    // Save to localStorage
    localStorage.setItem(`product-reviews-${productId}`, JSON.stringify(updatedReviews))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="col-span-1">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating) ? "text-accent fill-accent" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground mb-4">Based on {reviews.length} reviews</div>

            <div className="w-full space-y-2">
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <div key={rating} className="flex items-center gap-2">
                  <div className="w-8 text-sm text-right">{rating} ★</div>
                  <Progress value={reviews.length ? (ratingCounts[index] / reviews.length) * 100 : 0} className="h-2" />
                  <div className="w-8 text-sm text-muted-foreground">{ratingCounts[index]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <h3 className="font-medium mb-4">Write a Review</h3>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="mr-2">Your Rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => handleRatingHover(star)}
                    onMouseLeave={() => handleRatingHover(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= (hoverRating || userRating) ? "text-accent fill-accent" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Share your experience with this product..."
              className="min-h-[100px] mb-4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!user || submitting}
            />

            <Button
              onClick={handleSubmitReview}
              disabled={!user || submitting}
              className="bg-primary hover:bg-primary/90"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
            {!user && (
              <p className="text-sm text-muted-foreground mt-2">
                Please{" "}
                <a href="/login" className="text-primary hover:underline">
                  login
                </a>{" "}
                to write a review
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Customer Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {review.userName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.userName}</div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating ? "text-accent fill-accent" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                        {review.isVerified && (
                          <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{formatDate(review.date)}</div>
                </div>

                <div className="mt-3 text-sm">{review.comment}</div>

                <div className="mt-4 flex items-center gap-4">
                  <button
                    onClick={() => handleHelpfulClick(review.id)}
                    disabled={helpfulClicked[review.id]}
                    className={`flex items-center text-xs ${
                      helpfulClicked[review.id] ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Helpful {review.helpful > 0 && `(${review.helpful})`}
                  </button>
                  <button className="flex items-center text-xs text-muted-foreground hover:text-foreground">
                    <Flag className="h-3 w-3 mr-1" />
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
