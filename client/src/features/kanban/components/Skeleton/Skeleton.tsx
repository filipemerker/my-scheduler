import { Skeleton } from "@radix-ui/themes";
import styles from "./Skeleton.module.css";

function SkeletonCard() {
  return <Skeleton width="100%" height="59px" />;
}

function SkeletonSwimlane({ cardCount }: { cardCount: number }) {
  return (
    <div className={styles.swimlane}>
      <div className={styles.header}>
        <Skeleton width="80px" height="20px" style={{ marginTop: 3 }} />
      </div>
      <div className={styles.ideas}>
        {Array.from({ length: cardCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function KanbanSkeleton() {
  return (
    <div className={styles.container}>
      <SkeletonSwimlane cardCount={3} />
      <SkeletonSwimlane cardCount={2} />
      <SkeletonSwimlane cardCount={4} />
    </div>
  );
}
