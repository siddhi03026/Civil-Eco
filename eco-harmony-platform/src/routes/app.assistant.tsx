import { createFileRoute } from "@tanstack/react-router";
import { ChatbotWidget } from "@/components/ChatbotWidget";

export const Route = createFileRoute("/app/assistant")({
  component: AssistantPage,
});

const SUGGESTIONS = [
  "How do I start composting at home?",
  "Tips for plastic-free shopping",
  "Best way to segregate waste",
  "Ideas for a village clean-up drive",
];

function AssistantPage() {
  return (
    <ChatbotWidget mode="page" suggestions={SUGGESTIONS} />
  );
}
