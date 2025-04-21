// frontend/src/App.tsx
import { useEffect, useState, useRef } from 'react'; // Removed 'React,'
import { Header } from './components/Header';
import { MintForm } from './components/MintForm';
import { StatusIndicator } from './components/StatusIndicator';
import { ResultsSection } from './components/ResultsSection';
import { StarField } from './components/StarField';
import './index.css';

// --- Interfaces ---
interface MintResult {
  imageUrl: string;
  tokenId: string | number | null; // Keep null possibility if API returns it
  transactionUrl: string;
  metadataUrl: string;
  imageIpfsUrl: string;
}
interface ApiSuccessResponse {
  success: true;
  image_cid: string;
  metadata_cid: string;
  token_id: string | number | null; // Keep null possibility if API returns it
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

  // --- !!! CRITICAL CHANGE FOR DEPLOYMENT !!! ---
  // Read backend URL from environment variable set in Netlify UI
  // Fallback to localhost for local development (requires local frontend/.env file)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/mint';
  // Optional: Configure IPFS Gateway via environment variable
  const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
  // ---

  // Log the URLs being used (helpful for debugging deployment)
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

  useEffect(() => {
    clearSpeedInterval();
    if (status === 'ready' || status === 'error' || status === 'success') {
      setStarSpeed(1);
    } else {
      setStarSpeed(20);
      const targetSpeed = 150; const increment = 15; const intervalTime = 100;
      speedIntervalRef.current = setInterval(() => {
        setStarSpeed(currentSpeed => {
          // Check status *inside* the interval callback as well
          if (status === 'ready' || status === 'error' || status === 'success') {
              clearSpeedInterval(); return 1;
          }
          const nextSpeed = currentSpeed + increment;
          if (nextSpeed >= targetSpeed) {
            clearSpeedInterval(); return targetSpeed;
          }
          return nextSpeed;
        });
      }, intervalTime);
    }
    // Cleanup function for useEffect
    return () => { clearSpeedInterval(); };
  }, [status]); // Dependency array includes status

  const handleMint = async (prompt: string, address: string): Promise<void> => { // Added return type
    setStatus('generating');
    setMintResult(null);
    setErrorMessage(null);

    try {
      console.log(`Sending request to backend: ${BACKEND_URL}`); // Log the actual URL
      const response = await fetch(BACKEND_URL, { // Use the variable
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, recipient_address: address }),
      });

      // Assume 'waiting_tx' starts after request *initiation* and ends when response arrives
      // This might need adjustment based on backend logic, but it's a reasonable place
      setStatus('waiting_tx');

      const responseData: ApiSuccessResponse | ApiErrorResponse = await response.json();

      if (response.ok && 'success' in responseData && responseData.success === true) {
        const successData = responseData as ApiSuccessResponse;
        console.log("Minting successful:", successData);
        setStatus('success');

        // Use the IPFS_GATEWAY variable
        setMintResult({
          imageUrl: `${IPFS_GATEWAY}${successData.image_cid}`,
          // Ensure tokenId is always a string or 'N/A' for consistency in MintResult
          tokenId: successData.token_id !== null ? String(successData.token_id) : 'N/A',
          transactionUrl: successData.explorer_url,
          metadataUrl: `${IPFS_GATEWAY}${successData.metadata_cid}`,
          imageIpfsUrl: `${IPFS_GATEWAY}${successData.image_cid}`,
        });

      } else {
        const errorData = responseData as ApiErrorResponse;
        // Default error message if 'error' field is missing
        const errorMsg = errorData.error || `Request failed with status ${response.status}`;
        console.error('API Error:', errorMsg);
        setStatus('error');
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      // Type guard for better error handling
      const errorMsg = error instanceof Error ? error.message : 'An unknown network error occurred.';
      console.error('Network/Fetch Error:', error);
      setStatus('error');
      setErrorMessage(errorMsg);
    }
  };

  return (
    // JSX structure remains the same
    <div className="relative min-h-screen text-white overflow-hidden bg-gray-900"> {/* Added default bg */}
      <StarField speed={starSpeed} />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-2xl mx-auto">
            <MintForm
              onMint={handleMint}
              disabled={status !== 'ready' && status !== 'success' && status !== 'error'}
            />
            <StatusIndicator status={status} errorMessage={errorMessage} />
            {/* Render ResultsSection only on success and when mintResult is available */}
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