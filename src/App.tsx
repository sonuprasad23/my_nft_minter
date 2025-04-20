// frontend/src/App.tsx
import React, { useEffect, useState, useRef } from 'react';
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
  const [starSpeed, setStarSpeed] = useState(1); // Start with normal slow speed

  const speedIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Read backend URL from environment variable set by Netlify or local .env file
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/mint';
  const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://ipfs.io/ipfs/'; // Allow configuring gateway

  useEffect(() => {
    console.log("Using Backend URL:", BACKEND_URL);
    console.log("Using IPFS Gateway:", IPFS_GATEWAY);
  }, [BACKEND_URL, IPFS_GATEWAY]);


  // --- Function to clear the speed interval ---
  const clearSpeedInterval = () => {
    if (speedIntervalRef.current) {
      clearInterval(speedIntervalRef.current);
      speedIntervalRef.current = null;
    }
  };

  // --- Effect to control star speed based on status ---
  useEffect(() => {
    clearSpeedInterval(); // Always clear previous interval first

    if (status === 'ready' || status === 'error' || status === 'success') {
      // Slow speed for ready, error, AND success
      setStarSpeed(1);
    } else {
      // Start acceleration for all processing states
      setStarSpeed(20); // Start accelerating
      const targetSpeed = 150;
      const increment = 15;
      const intervalTime = 100; // ms

      speedIntervalRef.current = setInterval(() => {
        setStarSpeed(currentSpeed => {
          if (status === 'ready' || status === 'error' || status === 'success') {
              clearSpeedInterval(); return 1; // Stop accelerating if status changed back
          }
          const nextSpeed = currentSpeed + increment;
          if (nextSpeed >= targetSpeed) {
            clearSpeedInterval(); return targetSpeed;
          }
          return nextSpeed;
        });
      }, intervalTime);
    }
    // Cleanup function for the effect
    return () => { clearSpeedInterval(); };
  }, [status]); // Run effect only when status changes

  // --- Handle Minting ---
  const handleMint = async (prompt: string, address: string) => {
    setStatus('generating'); // Trigger acceleration
    setMintResult(null);
    setErrorMessage(null);

    try {
      console.log(`Sending request to backend: ${BACKEND_URL}`);
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, recipient_address: address }),
      });

      setStatus('waiting_tx'); // Update status while waiting for response/tx

      const responseData: ApiSuccessResponse | ApiErrorResponse = await response.json();

      if (response.ok && 'success' in responseData && responseData.success === true) {
        const successData = responseData as ApiSuccessResponse;
        console.log("Minting successful:", successData);
        setStatus('success'); // Reset speed to slow

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
        setStatus('error'); // Reset speed to slow
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unknown network error occurred.';
      console.error('Network/Fetch Error:', error);
      setStatus('error'); // Reset speed to slow
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
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
            {mintResult && status === 'success' && <ResultsSection result={mintResult} />}
          </div>
        </main>
         <footer className="text-center p-4 text-xs text-gray-500">
            Sei AI NFT Minter - Hackrank Project
         </footer>
      </div>
    </div>
  );
}