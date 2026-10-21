import React, { useState } from 'react';
import { DocItem } from '../types';
import { Plus, Trash2, FileText, Search, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  docs: DocItem[];
  activeDocId: string;
  onSelectDoc: (id: string) => void;
  onCreateDoc: () => void;
  onDeleteDoc: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  docs,
  activeDocId,
  onSelectDoc,
  onCreateDoc,
  onDeleteDoc,
}) => {
  const [search, setSearch] = useState('');

  const filtered = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-0 bottom-0 left-0 z-40 w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <span className="font-bold text-sm tracking-tight text-white">Documentos</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onCreateDoc}
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow"
              title="Novo Documento"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-zinc-800">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              Nenhum documento encontrado.
            </div>
          ) : (
            filtered.map((doc) => (
              <div
                key={doc.id}
                className={`group flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer ${
                  doc.id === activeDocId
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white border border-transparent'
                }`}
                onClick={() => {
                  onSelectDoc(doc.id);
                  onClose();
                }}
              >
                <div className="flex items-center gap-2 truncate pr-1">
                  <FileText className="w-3.5 h-3.5 shrink-0 text-zinc-500 group-hover:text-emerald-400" />
                  <span className="truncate font-medium">{doc.title || 'Sem Título'}</span>
                </div>

                {docs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDoc(doc.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition"
                    title="Excluir Documento"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono text-center">
          Garden Docs • 100% Offline-First
        </div>
      </aside>
    </>
  );
};
