import { useState } from "react";
import { Star } from "lucide-react";

interface CheckoutDetailsProps {
  setRating: (rating: number) => void;
  setComment: (comment: string) => void;
  setDriverTip: (tip: number) => void;
}

const TIP_SUGGESTIONS = [1000, 2000, 3000, 5000, 7500, 10000];

export default function CheckoutDetails({
  setRating,
  setComment,
  setDriverTip,
}: CheckoutDetailsProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [tipInput, setTipInput] = useState("");

  const handleStarClick = (value: number) => {
    setSelectedStar(value);
    setRating(value);
  };

  const handleTipInput = (raw: string) => {
    setTipInput(raw);
    const parsed = parseInt(raw.replace(/\D/g, ""), 10);
    setDriverTip(isNaN(parsed) ? 0 : parsed);
  };

  const handleSuggestionClick = (amount: number) => {
    setTipInput(amount.toLocaleString());
    setDriverTip(amount);
  };

  const activeStar = hoveredStar || selectedStar;

  return (
    <div className="flex flex-col gap-7 p-6 bg-white rounded-2xl">
      {/* Rating */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Rate your experience
        </label>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => handleStarClick(n)}
            onMouseEnter={() => setHoveredStar(n)}
            onMouseLeave={() => setHoveredStar(0)}
            className="p-0.5 transition-transform duration-150 hover:scale-125"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star
              size={28}
              strokeWidth={1.5}
              className="transition-colors duration-150"
              fill={n <= activeStar ? "#F59E0B" : "none"}
              color={n <= activeStar ? "#F59E0B" : "#D1D5DB"}
            />
          </button>
        ))}
      </div>

      {/* Comment */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="checkout-comment"
          className="text-xs font-semibold uppercase tracking-widest text-gray-400"
        >
          Any comments?{" "}
          <span className="normal-case tracking-normal font-normal text-gray-300">
            (optional)
          </span>
        </label>
        <textarea
          id="checkout-comment"
          rows={3}
          placeholder="Tell us about your experience…"
          onChange={(e) => setComment(e.target.value)}
          className="resize-none w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-amber-400 transition-colors duration-200"
        />
      </div>

      {/* Driver Tip */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="checkout-tip"
          className="text-xs font-semibold uppercase tracking-widest text-gray-400"
        >
          Driver tip
        </label>

        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-300 pointer-events-none">
            ₦
          </span>
          <input
            id="checkout-tip"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={tipInput}
            onChange={(e) => handleTipInput(e.target.value)}
            className="w-full pl-7 pr-3.5 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-800 placeholder-gray-300 outline-none focus:border-amber-400 transition-colors duration-200"
          />
        </div>

        {/* Tip suggestions */}
        <div className="grid grid-cols-3 gap-2">
          {TIP_SUGGESTIONS.map((amount) => {
            const isSelected = tipInput === amount.toLocaleString();
            return (
              <button
                key={amount}
                type="button"
                onClick={() => handleSuggestionClick(amount)}
                className={`py-2.5 px-2 rounded-lg border text-xs font-medium transition-all duration-150 text-center
                  ${
                    isSelected
                      ? "border-amber-400 bg-amber-50 text-amber-700 font-semibold"
                      : "border-gray-200 bg-gray-100 text-gray-600 hover:border-gray-300"
                  }`}
              >
                ₦{amount.toLocaleString()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
