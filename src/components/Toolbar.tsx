import React from 'react';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  CheckSquare,
  Code,
  Minus
} from 'lucide-react';

interface ToolbarProps {
  onInsert: (prefix: string, suffix?: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onInsert }) => {
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-900 border-b border-zinc-800 text-zinc-300">
      <button
        onClick={() => onInsert('**', '**')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition"
        title="Negrito (**texto**)"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => onInsert('*', '*')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition"
        title="Itálico (*texto*)"
      >
        <Italic className="w-4 h-4" />
      </button>

      <div className="h-4 w-px bg-zinc-800 mx-1" />

      <button
        onClick={() => onInsert('# ')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition"
        title="Título 1 (# Título)"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        onClick={() => onInsert('## ')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition"
        title="Título 2 (## Título)"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => onInsert('### ')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition"
        title="Título 3 (### Título)"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="h-4 w-px bg-zinc-800 mx-1" />

      <button
        onClick={() => onInsert('> ')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition"
        title="Citação (> citação)"
      >
        <Quote className="w-4 h-4" />
      </button>

      <button
        onClick={() => onInsert('- ')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition"
        title="Lista (- item)"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => onInsert('- [ ] ')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition"
        title="Checklist (- [ ] tarefa)"
      >
        <CheckSquare className="w-4 h-4" />
      </button>

      <button
        onClick={() => onInsert('```\n', '\n```')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition"
        title="Bloco de Código"
      >
        <Code className="w-4 h-4" />
      </button>

      <button
        onClick={() => onInsert('\n---\n')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition"
        title="Linha Divisória (---)"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
};
