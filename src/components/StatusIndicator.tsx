// src/components/StatusIndicator.tsx
// Removed 'CheckCircleIcon' from import
import { Loader2Icon, XCircleIcon } from 'lucide-react';

// Define props including the optional errorMessage
interface StatusIndicatorProps {
  status: 'ready' | 'generating' | 'uploading_img' | 'uploading_meta' | 'minting' | 'waiting_tx' | 'success' | 'error';
  errorMessage?: string | null; // Optional error message prop
}

export function StatusIndicator({ status, errorMessage }: StatusIndicatorProps) {
  // Don't render anything if status is 'ready' or 'success'
  if (status === 'ready' || status === 'success') {
    return null;
  }

  const getStatusContent = () => {
    switch (status) {
      case 'generating':
        return { icon: <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />, text: 'Generating Image...', color: 'text-blue-400' };
      case 'uploading_img':
        return { icon: <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />, text: 'Uploading Image...', color: 'text-blue-400' };
      case 'uploading_meta':
        return { icon: <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />, text: 'Uploading Metadata...', color: 'text-blue-400' };
      case 'minting':
        return { icon: <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />, text: 'Minting on Sei...', color: 'text-blue-400' };
      case 'waiting_tx':
         return { icon: <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />, text: 'Waiting for Confirmation...', color: 'text-purple-400' };
     // Case 'success' is removed from rendering here
      case 'error':
        return {
          icon: <XCircleIcon className="h-5 w-5 mr-2" />,
          text: errorMessage || 'Error: Something went wrong. Please try again.',
          color: 'text-red-400'
        };
      default:
        // This case handles any unexpected status values, though TS should prevent them.
        return { icon: <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />, text: 'Processing...', color: 'text-blue-400' };
    }
  };

  const { icon, text, color } = getStatusContent();

  return (
    <div className="flex items-center justify-center mb-8 min-h-[28px]">
      <div className={`flex items-center ${color} font-medium text-center animate-fade-in`}>
        {icon}
        <span>{text}</span>
      </div>
    </div>
  );
}