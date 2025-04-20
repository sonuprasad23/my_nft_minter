// frontend/src/components/Header.tsx
import React, { useState } from 'react';
import { MenuIcon, XIcon } from 'lucide-react'; // Ensure lucide-react is installed

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800/70 backdrop-blur-md shadow-md sticky top-0 z-20"> {/* Added backdrop & sticky */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
             {/* Optional: Add small logo image here */}
            <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Sei AI NFT Minter
            </h1>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <div className="text-sm text-gray-400">Powered by Sei Testnet</div>
          </nav>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="text-sm text-gray-400 py-2 text-center">
              Powered by Sei Testnet
            </div>
            {/* Add mobile nav links here if needed later */}
          </div>
        )}
      </div>
    </header>
  );
}