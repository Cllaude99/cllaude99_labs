import { useState } from 'react';

interface UseFileInputParams {
  disabled: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useFileInput = ({ disabled, onChange }: UseFileInputParams) => {
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const updateFileName = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setSelectedFileName('');
    } else if (files.length === 1) {
      setSelectedFileName(files[0].name);
    } else {
      setSelectedFileName(`${files.length}개의 파일 선택됨`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFileName(e.target.files);
    onChange?.(e);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, inputElement: HTMLInputElement | null) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0 && inputElement) {
      try {
        const dataTransfer = new DataTransfer();
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file) {
            dataTransfer.items.add(file);
          }
        }
        inputElement.files = dataTransfer.files;
      } catch (error) {
        /* DataTransfer를 지원하지 않는 브라우저의 경우 직접 할당 */
        inputElement.files = files;
      }

      updateFileName(inputElement.files);
      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  return {
    selectedFileName,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};
