import React from 'react';

interface MarkdownMessageProps {
  content: string;
}

export const MarkdownMessage = ({ content }: MarkdownMessageProps) => {
  // Process the content to properly display markdown-like text formatting
  const processedContent = React.useMemo(() => {
    // If the content is empty, return empty string
    if (!content || content.trim() === '') return '';
    
    let result = content;
    
    // Convert markdown links [text](url) to HTML links
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>');
    
    // Convert markdown bold **text** to <strong>
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert markdown italic *text* to <em>
    result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert backtick code
    result = result.replace(/`(.*?)`/g, '<code class="bg-muted/50 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
    
    // Handle bullet lists (- item)
    result = result.replace(/^- (.*?)$/gm, '<li>$1</li>');
    
    // Handle numbered lists (1. item)
    result = result.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');
    
    // Wrap adjacent list items in <ul> or <ol>
    let lines = result.split('\n');
    let inList = false;
    let listType = '';
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('<li>')) {
        if (!inList) {
          // Determine if it's a numbered or bullet list
          const prevLine = i > 0 ? lines[i - 1] : '';
          listType = prevLine.match(/^\d+\./) ? 'ol' : 'ul';
          lines[i] = `<${listType}>${lines[i]}`;
          inList = true;
        }
      } else if (inList) {
        lines[i - 1] += `</${listType}>`;
        inList = false;
      }
    }
    
    // Close the last list if needed
    if (inList && lines.length > 0) {
      lines[lines.length - 1] += `</${listType}>`;
    }
    
    // Join lines back together, converting newlines to <br>
    result = lines.join('<br>');
    
    // Replace consecutive <br> tags with paragraph breaks
    result = result.replace(/<br><br>/g, '</p><p>');
    
    // Wrap in paragraphs if not already done
    if (!result.startsWith('<p>')) {
      result = `<p>${result}</p>`;
    }
    
    return result;
  }, [content]);

  return (
    <div 
      className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5"
      dangerouslySetInnerHTML={{ __html: processedContent }} 
    />
  );
};
