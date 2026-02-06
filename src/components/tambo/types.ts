// Tambo component types

export interface TamboMessage {
  id: string;
  role: "user" | "assistant";
  content: string | Array<{ type: string; text?: string }>;
  renderedComponent?: React.ReactNode;
}

export interface SuggestedAction {
  label: string;
  prompt: string;
  icon?: React.ReactNode;
}

export interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
