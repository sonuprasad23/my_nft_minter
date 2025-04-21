import { ExternalLinkIcon } from 'lucide-react'; // Removed 'React,'

// Re-use or define the MintResult type (better to import if possible)
interface MintResult {
  imageUrl: string;
  tokenId: string | number | null; // Match App.tsx definition
  transactionUrl: string;
  metadataUrl: string;
  imageIpfsUrl: string;
}

// Define the types for the props
interface ResultsSectionProps {
  result: MintResult; // Prop will not be null when component is rendered
}

export function ResultsSection({ result }: ResultsSectionProps) { // Apply the prop types
  return <div className="backdrop-blur-lg bg-gray-800/50 rounded-lg shadow-xl p-6 mb-8 animate-fade-in border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        Your NFT Has Been Minted!
      </h2>
      <div className="mb-6">
        <div className="rounded-lg overflow-hidden shadow-lg mx-auto max-w-md border border-gray-600"> {/* Added border */}
          <img src={result.imageUrl} alt="Generated NFT" className="w-full h-auto block" /> {/* Added block display */}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <span className="text-gray-400">Token ID:</span>
          {/* Display 'N/A' if tokenId is null or handle as needed */}
          <span className="ml-2 font-mono text-white">{result.tokenId ?? 'N/A'}</span>
        </div>
        <div className="space-y-2">
          <a href={result.transactionUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
            <ExternalLinkIcon className="h-4 w-4 mr-2 flex-shrink-0" /> {/* Added flex-shrink-0 */}
            <span className="truncate">View Transaction on SeiStream</span> {/* Added truncate */}
          </a>
          <a href={result.metadataUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
            <ExternalLinkIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">View Metadata on IPFS</span>
          </a>
          <a href={result.imageIpfsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
            <ExternalLinkIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">View Image on IPFS</span>
          </a>
        </div>
      </div>
    </div>;
}