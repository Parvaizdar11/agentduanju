import * as React from "react";
import { Paperclip, ArrowUp } from "lucide-react";

import { cn } from "./ui/utils";
import { Button } from "./ui/button";

interface ChatPromptProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSend?: (value: string) => void;
  disabled?: boolean;
}

function ChatPrompt({
  value,
  placeholder = "What can I do for you?",
  onChange,
  onSend,
  disabled = false,
  className,
  ...props
}: ChatPromptProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !disabled;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend?.(value);
    }
  }

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }, [value]);

  return (
    <div
      data-slot="chat-prompt"
      className={cn("relative w-full", className)}
      {...props}
    >
      {/* Slim pill input — larger height and right actions */}
      <div
        className={cn(
          "relative flex items-center rounded-full transition-all",
          "px-6 py-4", // 增加内边距
          "outline-none",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        )}
        style={{
          border: "1px solid rgba(255, 255, 255, 0.3)", // 更柔和的半透明白色边框
          backgroundColor: "rgba(55, 65, 81, 0.8)", // 深灰色背景，不是纯黑
          backdropFilter: "blur(12px)", // 毛玻璃效果
        }}
      >
        {/* Textarea input (single-line look) */}
        <textarea
          ref={textareaRef}
          data-slot="chat-prompt-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 min-w-0 bg-transparent border-0",
            "text-[16px] text-white md:text-[16px]",
            "placeholder:text-gray-300",
            "selection:bg-blue-500/30 selection:text-white",
            "resize-none overflow-hidden outline-none",
            "leading-7 px-4 py-3", // 增加内边距
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          style={{ minHeight: "48px", maxHeight: "120px" }}
        />

        {/* Right actions (kept on the right) */}
        <div className="flex items-center gap-2 ml-3">
          {/* Attach button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            className={cn(
              "size-12 shrink-0 rounded-full",
              "bg-gray-800/60 hover:bg-gray-700/70",
              "text-gray-400 hover:text-gray-300",
              "border-0 transition-all",
            )}
            aria-label="Attach file"
          >
            <Paperclip className="size-[18px]" />
          </Button>

          {/* Send button */}
          <Button
            type="button"
            size="icon"
            disabled={!canSend}
            onClick={() => canSend && onSend?.(value)}
            className={cn(
              "size-12 shrink-0 rounded-full border-0",
              "transition-all",
              canSend
                ? "bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20"
                : "bg-gray-800/40 text-gray-600 cursor-not-allowed hover:bg-gray-800/40",
            )}
            aria-label="Send message"
          >
            <ArrowUp className="size-[18px]" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ChatPrompt };
