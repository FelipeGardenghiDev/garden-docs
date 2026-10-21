import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Download,
  Printer,
  Eye,
  Edit3,
  Columns,
  Clock,
  Type
} from 'lucide-react';
import { DocItem } from './types';
import {
  getSavedDocuments,
  saveDocuments,
  getActiveDocId,
  setActiveDocId,
  downloadText
} from './core/document-store';
import { parseMarkdown, computeStats } from './core/markdown-parser';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';

export const App: React.FC = () => {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [activeDocId, setActiveId] = useState<string>('doc_welcome');
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load documents on mount
  useEffect(() => {
    const saved = getSavedDocuments();
    setDocs(saved);
    const active = getActiveDocId();
    if (saved.some((d) => d.id === active)) {
      setActiveId(active);
    } else if (saved.length > 0) {
      setActiveId(saved[0].id);
    }
  }, []);

  const activeDoc = docs.find((d) => d.id === activeDocId) || docs[0];

  const handleUpdateContent = (newContent: string) => {
    if (!activeDoc) return;
    const stats = computeStats(newContent);

    // Auto-detect title from first H1 if present
    const firstLine = newContent.split('\n')[0] || '';
    const autoTitle = firstLine.startsWith('# ') ? firstLine.replace('# ', '').trim() : activeDoc.title;

    const updated: DocItem = {
      ...activeDoc,
      title: autoTitle || 'Sem Título',
      content: newContent,
      updatedAt: Date.now(),
      ...stats,
    };

    const newDocs = docs.map((d) => (d.id === activeDoc.id ? updated : d));
    setDocs(newDocs);
    saveDocuments(newDocs);
  };

  const handleCreateDoc = () => {
    const newDoc: DocItem = {
      id: `doc_${Date.now()}`,
      title: 'Novo Documento',
      content: '# 📝 Novo Documento\n\nComece a digitar seu texto aqui...',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      wordCount: 7,
      readingTimeMin: 1,
    };
    const newDocs = [newDoc, ...docs];
    setDocs(newDocs);
    saveDocuments(newDocs);
    setActiveId(newDoc.id);
    setActiveDocId(newDoc.id);
  };

  const handleDeleteDoc = (id: string) => {
    if (docs.length <= 1) return;
    const newDocs = docs.filter((d) => d.id !== id);
    setDocs(newDocs);
    saveDocuments(newDocs);
    if (activeDocId === id) {
      setActiveId(newDocs[0].id);
      setActiveDocId(newDocs[0].id);
    }
  };

  const handleInsert = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea || !activeDoc) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = activeDoc.content.substring(start, end);
    const replacement = `${prefix}${selected || 'texto'}${suffix}`;

    const newContent =
      activeDoc.content.substring(0, start) +
      replacement +
      activeDoc.content.substring(end);

    handleUpdateContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected.length || 5)
      );
    }, 0);
  };

  const handleExportMarkdown = () => {
    if (!activeDoc) return;
    downloadText(activeDoc.content, `${activeDoc.title.replace(/\s+/g, '_')}.md`, 'text/markdown');
  };

  const handlePrintPdf = () => {
    window.print();
  };

  if (!activeDoc) {
    return <div className="p-8 text-center text-zinc-500">Carregando Garden Docs...</div>;
  }

  const renderedHtml = parseMarkdown(activeDoc.content);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Document Library Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        docs={docs}
        activeDocId={activeDocId}
        onSelectDoc={(id) => {
          setActiveId(id);
          setActiveDocId(id);
        }}
        onCreateDoc={handleCreateDoc}
        onDeleteDoc={handleDeleteDoc}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navbar */}
        <header className="no-print h-14 bg-zinc-900/90 backdrop-blur border-b border-zinc-800 px-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="Abrir Documentos"
            >
              <Menu className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={activeDoc.title}
              onChange={(e) => {
                const updated = { ...activeDoc, title: e.target.value };
                const newDocs = docs.map((d) => (d.id === activeDoc.id ? updated : d));
                setDocs(newDocs);
                saveDocuments(newDocs);
              }}
              className="bg-transparent font-bold text-sm text-zinc-100 focus:outline-none focus:bg-zinc-800 px-2 py-1 rounded truncate max-w-xs sm:max-w-md"
            />
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center gap-2">
            {/* Word count & Reading time pills */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-zinc-400 border-r border-zinc-800 pr-3">
              <span className="flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-zinc-500" />
                {activeDoc.wordCount} palavras
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                ~{activeDoc.readingTimeMin} min leitura
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-zinc-800 p-0.5 rounded-lg border border-zinc-700/60">
              <button
                onClick={() => setViewMode('edit')}
                className={`p-1.5 rounded text-xs transition ${
                  viewMode === 'edit' ? 'bg-zinc-700 text-white font-semibold shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Apenas Editor"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded text-xs transition hidden sm:block ${
                  viewMode === 'split' ? 'bg-zinc-700 text-white font-semibold shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Visão Dividida (Split)"
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`p-1.5 rounded text-xs transition ${
                  viewMode === 'preview' ? 'bg-zinc-700 text-white font-semibold shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Apenas Leitura / Preview"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Export Buttons */}
            <button
              onClick={handleExportMarkdown}
              className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              title="Baixar Markdown (.md)"
            >
              <Download className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow shadow-emerald-950"
              title="Imprimir / Exportar PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar PDF</span>
            </button>
          </div>
        </header>

        {/* Formatting Toolbar */}
        {viewMode !== 'preview' && (
          <div className="no-print">
            <Toolbar onInsert={handleInsert} />
          </div>
        )}

        {/* Content Workspace */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Markdown Textarea Editor */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className={`h-full overflow-y-auto p-4 sm:p-6 no-print ${viewMode === 'split' ? 'w-full sm:w-1/2 border-r border-zinc-800' : 'w-full max-w-4xl mx-auto'}`}>
              <textarea
                ref={textareaRef}
                value={activeDoc.content}
                onChange={(e) => handleUpdateContent(e.target.value)}
                placeholder="Escreva seu documento aqui em Markdown..."
                className="w-full h-full bg-transparent text-zinc-100 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-zinc-600"
              />
            </div>
          )}

          {/* Formatted Preview Page */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`h-full overflow-y-auto p-4 sm:p-8 bg-zinc-950 print-only-page ${viewMode === 'split' ? 'hidden sm:block sm:w-1/2' : 'w-full max-w-4xl mx-auto'}`}>
              <div
                className="prose prose-invert max-w-none text-zinc-100"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default App;
