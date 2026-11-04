import { useState, type FormEvent } from 'react';
import { ArrowRight, Link2, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { validatePdfUrl } from '../../utils/urlHelpers';

interface PdfUrlInputProps {
  compact?: boolean;
}

export function PdfUrlInput({ compact = false }: PdfUrlInputProps) {
  const [urlInput, setUrlInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = validatePdfUrl(urlInput);
    if (!result.valid) {
      setValidationError(result.errorMessage ?? 'Invalid PDF URL.');
      return;
    }

    setValidationError(null);
    navigate(`/read?url=${encodeURIComponent(result.normalizedUrl)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <label htmlFor="pdf-url-input" className="sr-only">
        PDF Document URL
      </label>
      <div
        className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-zinc-900 border transition-colors ${
          validationError
            ? 'border-red-500 dark:border-red-500'
            : 'border-zinc-300/90 dark:border-zinc-800 focus-within:border-blue-700 dark:focus-within:border-blue-400'
        }`}
      >
        <div className="flex items-center gap-3 flex-1 px-2.5 min-w-0">
          <Link2
            className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0"
            aria-hidden="true"
          />
          <input
            id="pdf-url-input"
            type="url"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Paste a direct PDF link (https://example.com/book.pdf)"
            className={`w-full bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none ${
              compact ? 'text-sm py-1.5' : 'text-sm sm:text-base py-2'
            }`}
            autoComplete="url"
            spellCheck={false}
          />
          {urlInput.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setUrlInput('');
                setValidationError(null);
              }}
              aria-label="Clear URL input"
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size={compact ? 'md' : 'lg'}
          className="sm:w-auto w-full"
        >
          <span>Open Book</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {validationError && (
        <div
          role="alert"
          className="mt-2.5 flex items-center gap-2 text-xs text-red-600 dark:text-red-400"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
    </form>
  );
}
