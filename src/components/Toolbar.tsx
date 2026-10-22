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
  Minus,
  Table
} from 'lucide-react';

interface ToolbarProps {
  onInsert: (prefix: string, suffix?: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onInsert }) => {
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-900 border-b border-zinc-800 text-zinc-300">
      <button
        onClick={() => onInsert('**', '**')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition cursor-pointer"
        title="Negrito (**texto**)"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => onInsert('*', '*')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition cursor-pointer"
        title="Itálico (*texto*)"
      >
        <Italic className="w-4 h-4" />
      </button>

      <div className="h-4 w-px bg-zinc-800 mx-1" />

      <button
        onClick={() => onInsert('# ')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition cursor-pointer"
        title="Título 1 (# Título)"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        onClick={() => onInsert('## ')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition cursor-pointer"
        title="Título 2 (## Título)"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => onInsert('### ')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition cursor-pointer"
        title="Título 3 (### Título)"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="h-4 w-px bg-zinc-800 mx-1" />

      <button
        onClick={() => onInsert('> ')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition cursor-pointer"
        title="Citação (> citação)"
      >
        <Quote className="w-4 h-4" />
      </button>

      <button
        onClick={() => onInsert('- ')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition cursor-pointer"
        title="Lista (- item)"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => onInsert('- [ ] ')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition cursor-pointer"
        title="Checklist (- [ ] tarefa)"
      >
        <CheckSquare className="w-4 h-4" />
      </button>

      <button
        onClick={() => onInsert('```\n', '\n```')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition cursor-pointer"
        title="Bloco de Código"
      >
        <Code className="w-4 h-4" />
      </button>

      <button
        onClick={() =>
          onInsert(
            '\n| Coluna 1 | Coluna 2 | Coluna 3 |\n| :--- | :---: | ---: |\n| Item 1 | Valor A | 100 |\n| Item 2 | Valor B | 250 |\n'
          )
        }
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition cursor-pointer text-emerald-400"
        title="Tabela Markdown (| Col 1 | Col 2 |)"
      >
        <Table className="w-4 h-4" />
      </button>

      <button
        onClick={() => onInsert('\n---\n')}
        className="p-1.5 rounded hover:bg-zinc-800 hover:text-white transition cursor-pointer"
        title="Linha Divisória (---)"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
};
