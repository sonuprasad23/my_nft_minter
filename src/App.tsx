// frontend/src/App.tsx
import { useEffect, useState, useRef } from 'react';
import { Header } from './components/Header';
import { MintForm } from './components/MintForm';
import { StatusIndicator } from './components/StatusIndicator';
import { ResultsSection } from './components/ResultsSection';
import { StarField } from './components/StarField';
import './index.css';

// --- Interfaces ---
interface MintResult {
  imageUrl: string;
  tokenId: string | number | null;
  transactionUrl: string;
  metadataUrl: string;
  imageIpfsUrl: string;
}
interface ApiSuccessResponse {
  success: true;
  image_cid: string;
  metadata_cid: string;
  token_id: string | number | null;
  transaction_hash: string;
  explorer_url: string;
}
interface ApiErrorResponse {
  success?: false;
  error: string;
}
// ---

export function App() {
  type MintingStatus = 'ready' | 'generating' | 'uploading_img' | 'uploading_meta' | 'minting' | 'waiting_tx' | 'success' | 'error';
  const [status, setStatus] = useState<MintingStatus>('ready');
  const [mintResult, setMintResult] = useState<MintResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [starSpeed, setStarSpeed] = useState(1);

  const speedIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/mint';
  const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';

  useEffect(() => {
    console.log("Using Backend URL:", BACKEND_URL);
    console.log("Using IPFS Gateway:", IPFS_GATEWAY);
  }, [BACKEND_URL, IPFS_GATEWAY]);


  const clearSpeedInterval = () => {
    if (speedIntervalRef.current) {
      clearInterval(speedIntervalRef.current);
      speedIntervalRef.current = null;
    }
  };

  // --- Corrected useEffect for starSpeed ---
  useEffect(() => {
    clearSpeedInterval(); // Clear any existing interval first

    // Check the *current* status from the state
    if (status === 'ready' || status === 'error' || status === 'success') {
      setStarSpeed(1); // Set speed to normal if not processing
    } else {
      // If processing, start increasing speed
      setStarSpeed(20); // Initial boost
      const targetSpeed = 150;
      const increment = 15;
      const intervalTime = 100;

      speedIntervalRef.current = setInterval(() => {
        // Update speed based on the *previous* speed, not checking status here
        setStarSpeed(currentSpeed => {
          const nextSpeed = currentSpeed + increment;
          if (nextSpeed >= targetSpeed) {
            clearSpeedInterval(); // Stop interval when target is reached
            return targetSpeed;
          }
          return nextSpeed;
        });
      }, intervalTime);
    }

    // Cleanup function: ensures interval is cleared if status changes
    // or component unmounts while interval is running.
    return () => {
        clearSpeedInterval();
    };
  }, [status]); // Re-run this effect whenever the status changes
  // --- End of corrected useEffect ---

  const handleMint = async (prompt: string, address: string): Promise<void> => {
    setStatus('generating');
    setMintResult(null);
    setErrorMessage(null);

    try {
      console.log(`Sending request to backend: ${BACKEND_URL}`);
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, recipient_address: address }),
      });

      // Update status based on backend progress if possible, otherwise use waiting_tx
      // For now, assume backend handles intermediate steps and we wait for final result
      setStatus('waiting_tx');

      const responseData: ApiSuccessResponse | ApiErrorResponse = await response.json();

      if (response.ok && 'success' in responseData && responseData.success === true) {
        const successData = responseData as ApiSuccessResponse;
        console.log("Minting successful:", successData);
        setStatus('success');
        setMintResult({
          imageUrl: `${IPFS_GATEWAY}${successData.image_cid}`,
          tokenId: successData.token_id !== null ? String(successData.token_id) : 'N/A',
          transactionUrl: successData.explorer_url,
          metadataUrl: `${IPFS_GATEWAY}${successData.metadata_cid}`,
          imageIpfsUrl: `${IPFS_GATEWAY}${successData.image_cid}`,
        });

      } else {
        const errorData = responseData as ApiErrorResponse;
        const errorMsg = errorData.error || `Request failed with status ${response.status}`;
        console.error('API Error:', errorMsg);
        setStatus('error');
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unknown network error occurred.';
      console.error('Network/Fetch Error:', error);
      setStatus('error');
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-gray-900">
      <StarField speed={starSpeed} />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-2xl mx-auto">
            <MintForm
              onMint={handleMint}
              disabled={status !== 'ready' && status !== 'success' && status !== 'error'}
            />
            {/* StatusIndicator will now only show during intermediate steps or on error */}
            <StatusIndicator status={status} errorMessage={errorMessage} />
            {/* ResultsSection only shows on success */}
            {status === 'success' && mintResult && <ResultsSection result={mintResult} />}
          </div>
        </main>
         <footer className="text-center p-4 text-xs text-gray-500">
            Sei AI NFT Minter - Hackrank Project
         </footer>
      </div>
    </div>
  );
}