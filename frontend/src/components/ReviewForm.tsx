import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Star, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Props { productId: number; onSuccess?: () => void; }

export default function ReviewForm({ productId, onSuccess }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (rating === 0) { toast.error('لطفا امتیاز انتخاب کنید'); return; }
    if (!review.trim()) { toast.error('متن نظر را وارد کنید'); return; }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/v1/products/${productId}/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ rating, comment: review })
      });
      if (!res.ok) throw new Error('خطا در ارسال نظر');
      toast.success('نظر با موفقیت ثبت شد');
      setRating(0); setReview('');
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطا');
    } finally { setLoading(false); }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader><CardTitle>نظر خود را بنویسید</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">امتیاز</p>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(s => (
              <button
                key={s}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-110"
                type="button"
              >
                <Star className={`w-8 h-8 ${s <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">نظر شما</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="تجربه خود را بنویسید..."
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none h-24"
          />
        </div>

        <Button onClick={submitReview} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
          {loading ? 'در حال ارسال...' : (<><Send className="w-4 h-4 ml-2" /> ارسال نظر</>)}
        </Button>
      </CardContent>
    </Card>
  );
}
