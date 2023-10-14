'use client';
import {scrapeAndStoreProduct} from '@/lib/actions';
import Link from 'next/link';
import React, {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';

const isValidAmazonProductURL = (url: string) => {
  try {
    const parseURL = new URL(url);
    const hostname = parseURL.hostname;
    if (hostname.includes('amazon.com') || hostname.includes('amazon.') || hostname.endsWith('amazon')) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};
const Searchbar = () => {
  const router = useRouter();
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidLink = isValidAmazonProductURL(searchPrompt);
    if (!isValidLink) return alert('Please provide a valid Amazon link');
    try {
      setIsLoading(true);
      const productUrl = await scrapeAndStoreProduct(searchPrompt);
      if (productUrl) router.push(productUrl);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
      <input type='text' placeholder='Enter product link' value={searchPrompt} onChange={(e) => setSearchPrompt(e.target.value)} className='searchbar-input' />
      <button type='submit' className='searchbar-btn' disabled={searchPrompt === ''}>
        {isLoading ? 'Search...' : 'Search'}
      </button>
    </form>
  );
};

export default Searchbar;
