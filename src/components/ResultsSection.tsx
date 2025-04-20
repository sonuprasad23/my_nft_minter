// frontend/src/components/ResultsSection.tsx
import React from 'react';
import { ExternalLinkIcon } from 'lucide-react'; // Ensure lucide-react is installed

// Define the expected structure for the result prop
interface MintResult {
  imageUrl: string;
  tokenId: string | number | null;
  transactionUrl: string;
  metadataUrl: string;
  imageIpfsUrl: string;
}

interface ResultsSectionProps {
  result: MintResult;
}

export function ResultsSection({ result }: ResultsSectionProps) {
  return (
    <div className="backdrop-blur-lg bg-gray-800/50 rounded-lg shadow-xl p-6 mb-8 animate-fade-in border border-gray-700"> {/* Added backdrop/opacity */}
      <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"> {/* Changed gradient */}
        Your NFT Has Been Minted!
      </h2>
      <div className="mb-6 flex justify-center"> {/* Center image container */}
        <div className="rounded-lg overflow-hidden shadow-lg max-w-sm border-2 border-purple-500"> {/* Added border */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <img src={result.imageUrl} alt="Generated NFT" className="w-full h-auto object-cover" onError={(e: any) => { e.target.onerror = null; e.target.src="/placeholder-image.png"; e.target.alt="Error loading image"; }}/> {/* Added error handling */}
        </div>
      </div>
      <div className="space-y-3 text-center md:text-left"> {/* Center text on small screens */}
        <div className="bg-gray-700/50 p-3 rounded-md">
          <span className="text-gray-400 font-medium">Token ID:</span>
          <span className="ml-2 font-mono text-lg text-white break-all">{result.tokenId ?? 'Processing...'}</span>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start space-y-2 md:space-y-0 md:space-x-4 pt-2"> {/* Flex layout for links */}
          <a href={result.transactionUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-purple-400 hover:text-purple-300 transition-colors duration-200 text-sm font-medium">
            <ExternalLinkIcon className="h-4 w-4 mr-1" />
            View Transaction
          </a>
          <a href={result.metadataUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-purple-400 hover:text-purple-300 transition-colors duration-200 text-sm font-medium">
            <ExternalLinkIcon className="h-4 w-4 mr-1" />
            View Metadata (IPFS)
          </a>
          <a href={result.imageIpfsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-purple-400 hover:text-purple-300 transition-colors duration-200 text-sm font-medium">
            <ExternalLinkIcon className="h-4 w-4 mr-1" />
            View Image (IPFS)
          </a>
        </div>
      </div>
    </div>
  );
}