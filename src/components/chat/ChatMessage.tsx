
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import GlassPanel from "../ui-custom/GlassPanel";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
  isBot?: boolean;
  userName?: string;
  botName?: string;
  timestamp?: Date;
  preserveFormatting?: boolean;
}

const ChatMessage = ({
  content,
  isBot = false,
  userName = "You",
  botName = "AI Bot",
  timestamp = new Date(),
  preserveFormatting = false,
  className,
  ...props
}: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-3 max-w-full animate-slide-up",
        {
          "justify-start": isBot,
          "justify-end": !isBot,
        },
        className
      )}
      {...props}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {botName.charAt(0)}
        </div>
      )}

      <div
        className={cn("px-4 py-3 rounded-2xl max-w-[80%]", {
          "bg-primary text-primary-foreground": !isBot,
          "rounded-tl-sm": isBot,
          "rounded-tr-sm": !isBot,
        })}
      >
        {isBot ? (
          <GlassPanel className="p-3 rounded-2xl rounded-tl-sm">
            {preserveFormatting ? (
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mb-2 prose-p:mb-2 prose-ul:mb-2 prose-ul:mt-0">
                <ReactMarkdown>
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-sm">{content}</div>
            )}
          </GlassPanel>
        ) : (
          <div className="text-sm">{content}</div>
        )}
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold flex-shrink-0">
          {userName.charAt(0)}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
