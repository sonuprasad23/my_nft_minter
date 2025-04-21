import React, { useState } from 'react';
import { MenuIcon, XIcon } from 'lucide-react';
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              AI NFT Minter
            </h1>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-white">
              {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="text-sm text-gray-400">Powered by Sei Network</div>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && <div className="md:hidden py-4 border-t border-gray-700">
            <div className="text-sm text-gray-400 py-2">
              Powered by Sei Network
            </div>
          </div>}
      </div>
    </header>;
}