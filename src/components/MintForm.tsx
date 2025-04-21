import React, { useState } from 'react';
export function MintForm({
  onMint,
  disabled
}) {
  const [prompt, setPrompt] = useState('');
  const [address, setAddress] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    if (prompt.trim() && address.trim()) {
      onMint(prompt, address);
    }
  };
  return <div className="backdrop-blur-lg bg-gray-800/50 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            Enter Your Image Prompt
          </label>
          <textarea id="prompt" className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" rows={4} placeholder="Describe the NFT you want to create..." value={prompt} onChange={e => setPrompt(e.target.value)} disabled={disabled} required />
        </div>
        <div className="mb-6">
          <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
            Recipient Sei Address
          </label>
          <input id="address" type="text" className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="0x..." value={address} onChange={e => setAddress(e.target.value)} disabled={disabled} required />
        </div>
        <button type="submit" className={`w-full py-3 px-6 rounded-lg font-medium text-lg transition-all duration-200 ${disabled ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'}`} disabled={disabled}>
          ✨ Mint AI NFT ✨
        </button>
      </form>
    </div>;
}