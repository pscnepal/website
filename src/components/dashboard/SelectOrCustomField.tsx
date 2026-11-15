import { useMemo, useState } from 'react';
import {
  SharedSearchSelect,
  type SearchSelectOption,
} from '../common/SharedSearchSelect';

const CUSTOM_SENTINEL = '__PSC_CUSTOM_VALUE__';

export interface SelectOrCustomFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: SearchSelectOption[];
  placeholder?: string;
  customPlaceholder?: string;
  searchPlaceholder?: string;
  customOptionLabel?: string;
  focusRingClass?: string;
}

export function SelectOrCustomField({
  label,
  required = false,
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  customPlaceholder = 'Enter custom value...',
  searchPlaceholder = 'Search options...',
  customOptionLabel = '+ Add custom value...',
  focusRingClass = 'focus:ring-blue-600',
}: SelectOrCustomFieldProps) {
  const [forceCustom, setForceCustom] = useState(false);

  const dedupedOptions = useMemo(() => {
    const seen = new Set<string>();
    const list: SearchSelectOption[] = [];
    for (const opt of options) {
      if (!seen.has(opt.value)) {
        seen.add(opt.value);
        list.push(opt);
      }
    }
    return list;
  }, [options]);

  const matchesKnownOption = dedupedOptions.some((o) => o.value === value);
  const showCustomInput = forceCustom || (Boolean(value.trim()) && !matchesKnownOption);

  const selectOptions = useMemo<SearchSelectOption[]>(() => {
    return [
      ...dedupedOptions,
      {
        value: CUSTOM_SENTINEL,
        label: customOptionLabel,
        description: 'Type a custom value not listed above',
      },
    ];
  }, [dedupedOptions, customOptionLabel]);

  const selectValue = showCustomInput ? CUSTOM_SENTINEL : value;

  return (
    <div className="min-w-0 w-full space-y-1.5">
      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate">
        {label} {required && <span className="text-crimson-600">*</span>}
      </label>

      <SharedSearchSelect
        options={selectOptions}
        value={selectValue}
        onChange={(nextVal) => {
          if (nextVal === CUSTOM_SENTINEL) {
            setForceCustom(true);
            if (matchesKnownOption) {
              onChange('');
            }
          } else {
            setForceCustom(false);
            onChange(nextVal);
          }
        }}
        size="sm"
        className="w-full"
        popoverWidth="w-full"
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
      />

      {showCustomInput && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={customPlaceholder}
          className={`w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 ${focusRingClass}`}
        />
      )}
    </div>
  );
}
