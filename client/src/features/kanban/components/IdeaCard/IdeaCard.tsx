import { Box, Text } from "@radix-ui/themes";
import type { Idea } from "../../types";
import styles from "./IdeaCard.module.css";

interface IdeaCardProps {
  idea: Idea;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <Box className={styles.card}>
      <Text as="p" size="3" weight="bold">
        {idea.name}
      </Text>

      {idea.description && (
        <Text as="p" size="1" color="gray" mt="1">
          {idea.description}
        </Text>
      )}
    </Box>
  );
}
