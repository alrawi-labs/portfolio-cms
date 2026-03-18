"use client";

import React, { useState } from 'react';

interface CodeBlockItem {
  language: string;
  label: string;
  code: string;
}

interface CodeBlockProps {
  heading?: string;
  subheading?: string;
  content?: string;
  codeBlocks: CodeBlockItem[];
  defaultTab?: number;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  heading, 
  subheading, 
  content,
  codeBlocks, 
  defaultTab = 0 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      'javascript': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
      'typescript': 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      'python': 'bg-green-500/10 text-green-500 border-green-500/30',
      'curl': 'bg-purple-500/10 text-purple-500 border-purple-500/30',
      'bash': 'bg-gray-500/10 text-gray-400 border-gray-500/30',
      'json': 'bg-orange-500/10 text-orange-500 border-orange-500/30',
      'html': 'bg-red-500/10 text-red-500 border-red-500/30',
      'css': 'bg-pink-500/10 text-pink-500 border-pink-500/30',
    };
    return colors[language.toLowerCase()] || 'bg-primary/10 text-primary border-primary/30';
  };

  if (!codeBlocks || codeBlocks.length === 0) return null;

  return (
    <div className="space-y-4">
      {heading && (
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-1.5 h-8 bg-primary rounded-full" />
          {heading}
        </h3>
      )}
      
      {subheading && (
        <h4 className="text-xl font-semibold text-text-muted">
          {subheading}
        </h4>
      )}

      {content && (
        <p className="text-text-muted leading-relaxed mb-6">
          {content}
        </p>
      )}

      <div className="bg-dark-secondary/30 rounded-2xl border border-border-subtle overflow-hidden">
        {/* Tabs */}
        {codeBlocks.length > 1 && (
          <div className="flex items-center gap-2 px-4 pt-4 border-b border-border-subtle overflow-x-auto">
            {codeBlocks.map((block, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === index
                    ? 'bg-dark-secondary text-text border-t border-x border-border-subtle'
                    : 'text-text-muted hover:text-text hover:bg-dark-secondary/50'
                }`}
              >
                {block.label}
              </button>
            ))}
          </div>
        )}

        {/* Code Content */}
        <div className="relative">
          {codeBlocks.map((block, index) => (
            <div
              key={index}
              className={`${activeTab === index ? 'block' : 'hidden'}`}
            >
              {/* Header with language badge and copy button */}
              <div className="flex items-center justify-between px-4 py-3 bg-dark-secondary/50 border-b border-border-subtle">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLanguageColor(block.language)}`}>
                  {block.language.toUpperCase()}
                </div>
                
                <button
                  onClick={() => copyToClipboard(block.code, index)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-secondary hover:bg-dark border border-border-subtle hover:border-primary/50 text-text-muted hover:text-text transition-all text-sm font-medium"
                >
                  {copiedIndex === index ? (
                    <>
                      <CheckIcon className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code */}
              <div className="p-4 overflow-x-auto">
                <pre className="text-sm leading-relaxed">
                  <code className="text-text-muted font-mono">
                    {block.code}
                  </code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;