import { ReviewCard, ReviewGrid } from "./review-card";
import Section from "./section";
import Wrap from "./wrap";
import { reviews } from "@/lib/content";

export default function Reviews() {
  return (
    <Section id="reviews">
      <Wrap>
        <p className="m-0 mb-3 text-[.72rem] font-[850] tracking-[.13em] text-eyebrow uppercase">
          What people say
        </p>
        <ReviewGrid>
          {reviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </ReviewGrid>
      </Wrap>
    </Section>
  );
}
