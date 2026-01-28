'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  error?: string;
  hint?: string;
  required?: boolean;
  onChange: (file: File | null) => void;
  value?: File | null;
}

export function FileUpload({
  label,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 5,
  error,
  hint,
  required,
  onChange,
  value,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setLocalError(`File terlalu besar. Maksimal ${maxSize}MB`);
      return false;
    }

    // Check file type
    const acceptedTypes = accept.split(',').map(t => t.trim().toLowerCase());
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    const fileMime = file.type.toLowerCase();

    const isAccepted = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExt === type;
      }
      return fileMime.includes(type.replace('*', ''));
    });

    if (!isAccepted) {
      setLocalError(`Format file tidak didukung. Gunakan: ${accept}`);
      return false;
    }

    setLocalError(null);
    return true;
  }, [accept, maxSize]);

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      onChange(file);
    }
  }, [onChange, validateFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    onChange(null);
    setLocalError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onChange]);

  const displayError = error || localError;
  const isImage = value?.type.startsWith('image/');

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {!value ? (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
            dragActive
              ? 'border-primary bg-primary/5'
              : displayError
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <div className="text-center">
            <Upload className={cn(
              'mx-auto h-10 w-10 mb-3',
              dragActive ? 'text-primary' : 'text-gray-400'
            )} />
            <p className="text-sm text-gray-600">
              <span className="text-primary font-medium">Klik untuk upload</span>
              {' '}atau drag & drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept.replace(/\./g, '').toUpperCase()} (max {maxSize}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-3">
            {isImage ? (
              <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src={URL.createObjectURL(value)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {value.name}
              </p>
              <p className="text-xs text-gray-500">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {hint && !displayError && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
      {displayError && (
        <p className="text-xs text-red-500">{displayError}</p>
      )}
    </div>
  );
}
