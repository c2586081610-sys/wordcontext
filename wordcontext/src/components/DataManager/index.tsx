import { useState, useRef, useCallback } from 'react';
import { exportAll, exportByDeck, importData, clearAllData, type ImportResult } from '../../lib/io';
import { db, type DeckEntry } from '../../lib/db';
import { useStudyStore } from '../../stores/useStudyStore';

type ExportFormat = 'json' | 'csv';
type ExportScope = 'all' | 'deck';

export function DataManager() {
  const { init } = useStudyStore();

  // 导出状态
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
  const [exportScope, setExportScope] = useState<ExportScope>('all');
  const [selectedDeckId, setSelectedDeckId] = useState<string>('');
  const [decks, setDecks] = useState<DeckEntry[]>([]);
  const [exporting, setExporting] = useState(false);

  // 导入状态
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 清空状态
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  // 加载词库列表
  const loadDecks = useCallback(async () => {
    const allDecks = await db.decks.toArray();
    setDecks(allDecks);
    if (allDecks.length > 0 && !selectedDeckId) {
      setSelectedDeckId(allDecks[0].id);
    }
  }, [selectedDeckId]);

  // 处理导出
  const handleExport = async () => {
    setExporting(true);
    try {
      if (exportScope === 'all') {
        await exportAll(exportFormat);
      } else {
        if (!selectedDeckId) {
          alert('请选择词库');
          return;
        }
        await exportByDeck(selectedDeckId, exportFormat);
      }
    } catch (err) {
      alert(`导出失败：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setExporting(false);
    }
  };

  // 处理文件选择
  const handleFileSelect = (file: File) => {
    setImportResult(null);
    setPendingFile(file);
  };

  // 确认导入
  const handleImport = async () => {
    if (!pendingFile) return;
    setImporting(true);
    try {
      const result = await importData(pendingFile);
      setImportResult(result);
      setPendingFile(null);
      if (result.success) {
        // 刷新 store
        await init();
      }
    } catch (err) {
      setImportResult({
        success: false,
        message: `导入失败：${err instanceof Error ? err.message : String(err)}`,
        details: { wordsImported: 0, wordsSkipped: 0, cardsImported: 0, decksImported: 0, studyLogsImported: 0 },
      });
    } finally {
      setImporting(false);
    }
  };

  // 拖拽事件
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // 清空数据
  const handleClear = async () => {
    setClearing(true);
    try {
      await clearAllData();
      setShowClearConfirm(false);
      await init();
      alert('所有数据已清空');
    } catch (err) {
      alert(`清空失败：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setClearing(false);
    }
  };

  // 词库选择展开时加载
  const handleScopeChange = (scope: ExportScope) => {
    setExportScope(scope);
    if (scope === 'deck') loadDecks();
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">数据管理</h1>
        <p className="text-sm text-slate-500 mt-1">导入、导出和管理你的词库数据</p>
      </div>

      {/* 导出区域 */}
      <section className="glass rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <h2 className="text-lg font-semibold text-slate-800">导出数据</h2>
        </div>

        {/* 格式选择 */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">导出格式</label>
          <div className="flex gap-3">
            <FormatButton
              active={exportFormat === 'json'}
              onClick={() => setExportFormat('json')}
              label="JSON"
              desc="完整数据，可再导入"
            />
            <FormatButton
              active={exportFormat === 'csv'}
              onClick={() => setExportFormat('csv')}
              label="CSV"
              desc="单词表，可用 Excel 打开"
            />
          </div>
        </div>

        {/* 范围选择 */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">导出范围</label>
          <div className="flex gap-3">
            <ScopeButton
              active={exportScope === 'all'}
              onClick={() => handleScopeChange('all')}
              label="全部数据"
            />
            <ScopeButton
              active={exportScope === 'deck'}
              onClick={() => handleScopeChange('deck')}
              label="按词库"
            />
          </div>
        </div>

        {/* 词库选择 */}
        {exportScope === 'deck' && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">选择词库</label>
            <select
              value={selectedDeckId}
              onChange={e => setSelectedDeckId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">请选择词库</option>
              {decks.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.wordCount} 词)</option>
              ))}
            </select>
          </div>
        )}

        {/* 导出按钮 */}
        <button
          onClick={handleExport}
          disabled={exporting || (exportScope === 'deck' && !selectedDeckId)}
          className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? '导出中...' : '导出'}
        </button>
      </section>

      {/* 导入区域 */}
      <section className="glass rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <h2 className="text-lg font-semibold text-slate-800">导入数据</h2>
        </div>

        {/* 拖拽上传区域 */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <svg className="w-10 h-10 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
          </svg>
          <p className="text-sm text-slate-500">
            拖拽文件到此处，或<span className="text-blue-600 font-medium">点击选择文件</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">支持 JSON / CSV 格式</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
              e.target.value = '';
            }}
          />
        </div>

        {/* 待导入文件预览 */}
        {pendingFile && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${
                pendingFile.name.endsWith('.json') ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
              }`}>
                {pendingFile.name.endsWith('.json') ? 'JSON' : 'CSV'}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">{pendingFile.name}</p>
                <p className="text-xs text-slate-400">{(pendingFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPendingFile(null)}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleImport}
                disabled={importing}
                className="px-4 py-1.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {importing ? '导入中...' : '确认导入'}
              </button>
            </div>
          </div>
        )}

        {/* 导入结果 */}
        {importResult && (
          <div className={`p-4 rounded-xl border ${
            importResult.success
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-2">
              {importResult.success ? (
                <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
              <div>
                <p className={`text-sm font-medium ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {importResult.message}
                </p>
                {importResult.success && importResult.details && (
                  <div className="mt-2 text-xs text-green-700 space-y-0.5">
                    <p>新导入单词：{importResult.details.wordsImported}</p>
                    {importResult.details.wordsSkipped > 0 && (
                      <p>跳过（已存在）：{importResult.details.wordsSkipped}</p>
                    )}
                    {importResult.details.cardsImported > 0 && (
                      <p>导入卡片：{importResult.details.cardsImported}</p>
                    )}
                    {importResult.details.decksImported > 0 && (
                      <p>导入词库：{importResult.details.decksImported}</p>
                    )}
                    {importResult.details.studyLogsImported > 0 && (
                      <p>导入学习记录：{importResult.details.studyLogsImported}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 危险区域 */}
      <section className="rounded-2xl border border-red-200 bg-red-50/50 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <h2 className="text-lg font-semibold text-red-800">危险操作</h2>
        </div>
        <p className="text-sm text-red-700/70">清空所有数据将不可恢复，请确保已导出备份。</p>

        {!showClearConfirm ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 rounded-xl border border-red-300 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            清空所有数据
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-white border border-red-200 space-y-3">
            <p className="text-sm font-medium text-red-800">确认要清空所有数据吗？此操作不可撤销！</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleClear}
                disabled={clearing}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {clearing ? '清空中...' : '确认清空'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// 格式选择按钮
function FormatButton({ active, onClick, label, desc }: {
  active: boolean;
  onClick: () => void;
  label: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 p-3 rounded-xl border-2 text-left transition-all ${
        active
          ? 'border-blue-500 bg-blue-50/50'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <span className={`text-sm font-semibold ${active ? 'text-blue-700' : 'text-slate-700'}`}>{label}</span>
      <span className={`block text-xs mt-0.5 ${active ? 'text-blue-600/70' : 'text-slate-400'}`}>{desc}</span>
    </button>
  );
}

// 范围选择按钮
function ScopeButton({ active, onClick, label }: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );
}
