import { DocItem } from '../types';
import { computeStats } from './markdown-parser';

const STORAGE_KEY = 'garden_docs_documents';
const CURRENT_DOC_ID_KEY = 'garden_docs_active_id';

export const SAMPLE_DOC_CONTENT = `# 🌿 Bem-vindo ao Garden Docs

> O processador de texto e notas sem distrações da **Suíte Garden**. 100% gratuito, privado e offline-first.

---

## ✨ Recursos de Alta Produtividade

- **Sintaxe Markdown Completa:** Títulos, listas, checklists, citações e blocos de código com syntax highlighting.
- **Exportação Universal:** Exporte seu documento em formato Markdown puro (\`.md\`), HTML estruturado ou imprima direto como **PDF formatado** (\`Ctrl + P\`).
- **Autonomia & Privacidade:** Nenhum dado é enviado para servidores ou nuvem. Tudo fica armazenado localmente no seu dispositivo.
- **Métricas em Tempo Real:** Acompanhamento automático de contagem de palavras, caracteres e tempo estimado de leitura.

---

### 📋 Checklist de Tarefas

- [x] Escolher o tema do documento
- [ ] Rascunhar a introdução
- [ ] Exportar versão final em PDF

\`\`\`typescript
// Garden Docs Engine - Zero Dependencies
const renderDocument = (content: string) => parseMarkdown(content);
\`\`\`
`;

export function getSavedDocuments(): DocItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: DocItem = {
        id: 'doc_welcome',
        title: 'Bem-vindo ao Garden Docs',
        content: SAMPLE_DOC_CONTENT,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...computeStats(SAMPLE_DOC_CONTENT),
      };
      saveDocuments([initial]);
      return [initial];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load documents:', err);
    return [];
  }
}

export function saveDocuments(docs: DocItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (err) {
    console.error('Failed to save documents:', err);
  }
}

export function getActiveDocId(): string {
  return localStorage.getItem(CURRENT_DOC_ID_KEY) || 'doc_welcome';
}

export function setActiveDocId(id: string): void {
  localStorage.setItem(CURRENT_DOC_ID_KEY, id);
}

export function downloadText(content: string, filename: string, mime: string = 'text/markdown'): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
