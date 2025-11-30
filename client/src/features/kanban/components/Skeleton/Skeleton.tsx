import styles from "./Skeleton.module.css";

function SkeletonCard() {
  return <div className={styles.card} />;
}

function SkeletonSwimlane({ cardCount }: { cardCount: number }) {
  return (
    <div className={styles.swimlane}>
      <div className={styles.header}>
        <div className={styles.title} />
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
