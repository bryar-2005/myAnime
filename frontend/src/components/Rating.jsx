import { useState } from "react";
import { rateAnime } from "../lib/api";

export default function Rating({ animeId, initialRating, onRate }) {
    const [rating, setRating] = useState(initialRating || 0);
    const [hover, setHover] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const handleRate = async (score) => {
        if (submitting) return;
        setSubmitting(true);
        try {
            await rateAnime(animeId, score);
            setRating(score);
            if (onRate) onRate(score);
        } catch (err) {
            console.error(err);
            alert("هەڵەیەک ڕوویدا لە کاتی ناردنی هەڵسەنگاندنەکە.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-wider text-muted">هەڵسەنگاندنی تۆ</p>
            <div className="flex items-center gap-1">
                {[...Array(10)].map((_, i) => {
                    const score = i + 1;
                    return (
                        <button
                            key={score}
                            disabled={submitting}
                            onMouseEnter={() => setHover(score)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => handleRate(score)}
                            className="focus:outline-none transition group"
                        >
                            <svg
                                className={`w-5 h-5 transition ${(hover || rating) >= score ? "text-accent fill-accent" : "text-muted group-hover:text-accent/50"
                                    }`}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </button>
                    );
                })}
                {rating > 0 && <span className="ml-2 font-semibold text-accent">{rating}/10</span>}
            </div>
        </div>
    );
}
