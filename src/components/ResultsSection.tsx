import React from 'react';
import { ExternalLinkIcon } from 'lucide-react';
export function ResultsSection({
  result
}) {
  return <div className="backdrop-blur-lg bg-gray-800/50 rounded-lg shadow-xl p-6 mb-8 animate-fade-in border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        Your NFT Has Been Minted!
      </h2>
      <div className="mb-6">
        <div className="rounded-lg overflow-hidden shadow-lg mx-auto max-w-md">
          <img src={result.imageUrl} alt="Generated NFT" className="w-full h-auto" />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <span className="text-gray-400">Token ID:</span>
          <span className="ml-2 font-mono text-white">{result.tokenId}</span>
        </div>
        <div className="space-y-2">
          <a href={result.transactionUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
            <ExternalLinkIcon className="h-4 w-4 mr-2" />
            View Transaction on SeiStream
          </a>
          <a href={result.metadataUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
            <ExternalLinkIcon className="h-4 w-4 mr-2" />
            View Metadata on IPFS
          </a>
          <a href={result.imageIpfsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
            <ExternalLinkIcon className="h-4 w-4 mr-2" />
            View Image on IPFS
          </a>
        </div>
      </div>
    </div>;
}