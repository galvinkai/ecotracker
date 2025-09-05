import { Button } from "@/components/ui/button";

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

export const SuggestedQuestions = ({ onSelectQuestion }: SuggestedQuestionsProps) => {
  const questions = [
    "How can I reduce my transportation carbon footprint?",
    "What are the most effective ways to lower my energy usage?",
    "How does my shopping impact the environment?",
    "What's my current carbon footprint?",
    "Tips for sustainable travel?",
    "How to reduce food waste at home?"
  ];

  return (
    <div className="space-y-3 my-4">
      <h3 className="text-sm font-medium text-muted-foreground">Suggested Questions</h3>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs text-left h-auto py-1.5 bg-background/50 hover:bg-background/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80 dark:text-gray-200 dark:border-gray-700"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};
