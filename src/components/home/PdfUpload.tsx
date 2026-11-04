import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Upload, AlertCircle, FileUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { setCurrentBook } from '../../features/library/librarySlice';
import { registerLocalPdfFile } from '../../services/pdfService';

interface PdfUploadProps {
  compact?: boolean;
}

export function PdfUpload({ compact = false }: PdfUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const processFile = (file: File | undefined) => {
    if (!file) return;

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setUploadError('Please select a valid .pdf document.');
      return;
    }

    if (file.size === 0) {
      setUploadError('The selected PDF file appears to be empty.');
      return;
    }

    setUploadError(null);
    const sessionEntry = registerLocalPdfFile(file);

    dispatch(
      setCurrentBook({
        id: sessionEntry.id,
        title: sessionEntry.title,
        sourceType: 'local',
        url: sessionEntry.objectUrl,
        fileName: sessionEntry.fileName,
        fileSize: sessionEntry.fileSize,
      })
    );

    navigate(`/read?source=local&id=${encodeURIComponent(sessionEntry.id)}`);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    processFile(droppedFile);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    processFile(selected);
    event.target.value = '';
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload or drag and drop a local PDF file"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group w-full rounded-xl border border-dashed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
          compact ? 'px-5 py-5' : 'px-6 py-7'
        } ${
          isDragging
            ? 'border-blue-600 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-950/20'
            : 'border-zinc-300 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-100/90 dark:hover:bg-zinc-900'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
              {isDragging ? (
                <FileUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {isDragging
                  ? 'Drop your PDF file to begin reading'
                  : 'Or drag and drop a local PDF file'}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Reads directly from your device with zero server uploads or CORS limits
              </p>
            </div>
          </div>

          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-white underline underline-offset-4 whitespace-nowrap shrink-0">
            Browse local PDF
          </span>
        </div>
      </div>

      {uploadError && (
        <div
          role="alert"
          className="mt-2.5 flex items-center gap-2 text-xs text-red-600 dark:text-red-400"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
