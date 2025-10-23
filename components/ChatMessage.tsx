import React, { useState } from 'react';
import { Message } from '../types';
import { GenealogyBotIcon, UserIcon, PrintIcon, CopyIcon, CheckIcon, BookIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

const renderMarkdown = (text: string): string => {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>') // Links
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')           // Italic
    // Process unordered lists
    .replace(/((?:^|\n)\s*-\s.*)+/g, (match) => {
        const items = match.trim().split('\n').map(line => `<li>${line.replace(/^\s*-\s/, '')}</li>`).join('');
        return `<ul>${items}</ul>`;
    })
    // Process ordered lists
    .replace(/((?:^|\n)\s*\d+\.\s.*)+/g, (match) => {
        const items = match.trim().split('\n').map(line => `<li>${line.replace(/^\s*\d+\.\s/, '')}</li>`).join('');
        return `<ol>${items}</ol>`;
    })
    .replace(/\n/g, '<br />')
    .replace(/<br \/>(\s*<(?:ul|ol)>)/g, '$1') // remove <br> before lists
    .replace(/(<\/(?:ul|ol)>)\s*<br \/>/g, '$1'); // remove <br> after lists
};

const SimpleMarkdownRenderer: React.FC<{ text: string, isStreaming?: boolean }> = ({ text, isStreaming }) => {
  const renderedHtml = renderMarkdown(text);
    
  return (
    <div className="text-sm whitespace-pre-wrap leading-relaxed">
      <div dangerouslySetInnerHTML={{ __html: renderedHtml }} style={{ display: 'inline' }} />
      {isStreaming && <span className="blinking-cursor"></span>}
      <style>{`
        .blinking-cursor {
          display: inline-block;
          width: 8px;
          height: 1rem;
          background-color: #475569;
          animation: blink 1s step-end infinite;
          vertical-align: bottom;
          margin-left: 2px;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        ul, ol {
          padding-left: 20px;
          margin-top: 8px;
          margin-bottom: 8px;
        }
        ul {
          list-style-type: disc;
        }
        ol {
            list-style-type: decimal;
        }
        strong { font-weight: bold; }
        em { font-style: italic; }
        a { color: #475569; text-decoration: underline; }
      `}</style>
    </div>
  );
};


const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming }) => {
  const isUser = message.role === 'user';
  const [isCopied, setIsCopied] = useState(false);

  const handlePrint = () => {
    const logoTextHtml = `
      <div class="logo-container">
        <div style="font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 24pt; letter-spacing: 1px;">LiahonaBooks</div>
        <div style="font-family: 'IM Fell English SC', serif; font-size: 14pt; margin-top: 5px;">www.liahonabooks.com</div>
      </div>
    `;
    
    const printWindow = window.open('', '', 'height=600,width=800');

    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Answer</title>');
      printWindow.document.write(`
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=IM+Fell+English+SC&family=Georgia&display=swap" rel="stylesheet">
        <style>
          body { 
            font-family: Georgia, serif; 
            padding: 20px; 
            font-size: 12pt; 
            line-height: 1.6; 
            color: #333; 
          }
          .logo-container { text-align: center; margin-bottom: 20px; color: #334155; }
          hr { border: none; border-top: 1px solid #ccc; margin: 20px 0; }
          p, div, span, li { word-wrap: break-word; }
          ul, ol { padding-left: 25px; margin-top: 1em; margin-bottom: 1em; }
          ul { list-style-type: disc; }
          ol { list-style-type: decimal; }
          strong { font-weight: bold; }
          em { font-style: italic; }
          a { color: #0000EE; text-decoration: underline; }
          footer { 
            margin-top: 30px; 
            padding-top: 15px; 
            border-top: 1px solid #ccc; 
            text-align: center; 
            font-size: 9pt; 
            color: #666;
            font-family: sans-serif;
          }
        </style>
      `);
      printWindow.document.write('</head><body>');
      printWindow.document.write(logoTextHtml);
      printWindow.document.write('<hr />');
      printWindow.document.write(renderMarkdown(message.text));
      printWindow.document.write('<footer>Powered by LiahonaBooks.com</footer>')
      printWindow.document.write('</body></html>');
      
      printWindow.document.close();
      
      printWindow.onafterprint = () => {
        printWindow.close();
      };

      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 250);
    } else {
      alert("Could not open print window. Please check your browser's popup blocker settings.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`p-2 rounded-full ${isUser ? 'bg-slate-200' : 'bg-slate-100'}`}>
        {isUser ? (
            <UserIcon className="w-6 h-6 text-slate-700" />
        ) : (
            <GenealogyBotIcon className="w-6 h-6 text-slate-700" />
        )}
      </div>
       {isUser ? (
        <div className="rounded-lg px-4 py-3 max-w-lg shadow-sm bg-gradient-to-br from-slate-700 to-slate-800 text-white">
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
      ) : (
        <div className="flex flex-col items-start w-full">
          <div className="rounded-lg px-4 py-3 max-w-lg shadow-sm bg-white text-slate-800 border border-slate-200 w-full">
             {message.text ? (
                <SimpleMarkdownRenderer text={message.text} isStreaming={isStreaming} />
             ) : (
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <div className="animate-pulse h-2.5 w-2.5 bg-slate-400 rounded-full"></div>
                    <div className="animate-pulse h-2.5 w-2.5 bg-slate-400 rounded-full" style={{animationDelay: '0.2s'}}></div>
                    <div className="animate-pulse h-2.5 w-2.5 bg-slate-400 rounded-full" style={{animationDelay: '0.4s'}}></div>
                </div>
             )}
          </div>
          
          {message.sources && message.sources.length > 0 && !isStreaming && (
            <div className="mt-4 w-full max-w-lg p-4 bg-slate-100/80 border border-slate-200 rounded-lg">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <BookIcon className="w-5 h-5" />
                  Sources
                </h3>
                <ul className="space-y-2">
                  {message.sources.map((source, index) => (
                    <li key={index} className="text-xs text-slate-600">
                      <strong className="text-slate-800">{source.title}:</strong> {source.explanation}
                    </li>
                  ))}
                </ul>
            </div>
          )}
          
          {message.text && !isStreaming && (
            <div className="mt-2 flex items-center gap-4">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 rounded px-2 py-1"
                aria-label="Print this answer"
              >
                <PrintIcon className="w-5 h-5" />
                <span>Print</span>
              </button>
               <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 rounded px-2 py-1"
                aria-label="Copy this answer"
              >
                {isCopied ? <CheckIcon className="w-5 h-5 text-green-600" /> : <CopyIcon className="w-5 h-5" />}
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;