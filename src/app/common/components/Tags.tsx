
import { Chip } from "@heroui/react";

export default function Tags({ tags }: { tags: string[] | null | undefined }) {
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Chip
          key={index}
          classNames={{
            base: "bg-gradient-to-br from-secondary border-small border-white/50 shadow-pink-500/30",
            content: "drop-shadow shadow-black text-white",
          }}
          variant="solid"
        >
          {tag}
        </Chip>
      ))}
    </div>
  );
}