// frontend/src/components/StatusIndicator.tsx
import React from 'react';
import { Loader2Icon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

type MintingStatus = 'ready' | 'generating' | 'uploading_img' | 'uploading_meta' | 'minting' | 'waiting_tx' | 'success' | 'error';

interface StatusIndicatorProps {
  status: MintingStatus;
  errorMessage?: string | null;
}

export function StatusIndicator({ status, errorMessage }: StatusIndicatorProps) {
  if (status === 'ready') {
    return <div className="min-h-[28px] mb-8"></div>; // Reserve space even when ready
  }

  const getStatusContent = () => {
    switch (status) {
      case 'generating': return { icon: <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />, text: 'Generating Image...', color: 'text-blue-400' };
      case 'uploading_img': return { icon: <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />, text: 'Uploading Image...', color: 'text-blue-400' };
      case 'uploading_meta': return { icon: <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />, text: 'Uploading Metadata...', color: 'text-blue-400' };
      case 'minting': return { icon: <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />, text: 'Minting on Sei Testnet...', color: 'text-blue-400' };
      case 'waiting_tx': return { icon: <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />, text: 'Waiting for Blockchain Confirmation...', color: 'text-purple-400' };
      case 'success': return { icon: <CheckCircleIcon className="h-5 w-5 mr-2 text-green-400" />, text: 'Success! Your NFT has been minted.', color: 'text-green-400' }; // Added color to icon too
      case 'error': return {
          icon: <XCircleIcon className="h-5 w-5 mr-2 text-red-500" />, // Added color to icon
          text: errorMessage ? `Error: ${errorMessage}` : 'Error: Something went wrong. Please check console.', // Display specific error
          color: 'text-red-400'
        };
      default: return { icon: <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />, text: 'Processing...', color: 'text-gray-400' };
    }
  };

  const { icon, text, color } = getStatusContent();

  return (
    <div className="flex items-center justify-center mb-8 min-h-[28px] px-4 py-2 rounded-md bg-gray-800/60 backdrop-blur-sm border border-gray-700 shadow-md">
      <div className={`flex items-center ${color} font-medium text-sm md:text-base text-center`}>
        {icon}
        <span>{text}</span>
      </div>
    </div>
  );
}