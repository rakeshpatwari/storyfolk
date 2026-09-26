import { createFileRoute } from "@tanstack/react-router";
import { CharacterForge } from "@/components/character-forge";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <CharacterForge />;
}
