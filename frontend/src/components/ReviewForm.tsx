import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Star, Send, Loader } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewFormProps {
  productId: number;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (!isAuthenticated) {
      toast.error('لطفا ابتدا وارد شوید');
      return;
    }

    if (rating === 0) {
      toast.error('لطفا امتیاز را انتخاب کنید');
      return;
    }

    if (!review.trim()) {
      toast.error('لطفا متن نظر را وارد کنید');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/v1/products/${productId}/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rating,
          comment: review
        })
      });

      if (!response.ok) throw new Error('خطا در ارسال نظر');
      
      toast.success('نظر شما ثبت شد ✓');
      setRating(0);
      setReview('');
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در ارسال نظر');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>نظر خود را بنویسید</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">امتیاز</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hover || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">نظر شما</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="تجربه خود را با ما شریک کنید..."
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none resize-none h-24"
          />
        </div>

        <Button
          onClick={submitReview}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 ml-2 animate-spin" />
              در حال ارسال...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 ml-2" />
              ارسال نظر
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
