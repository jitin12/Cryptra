'use client'

import { Brain, Shield, Lightbulb, Users, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
export default function Page() {

   const router = useRouter();

  return (
    <div className=" inset-0 -z-10 h-full w-full items-center [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <nav className="z-10 p-4  bg-dark w-full rounded-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl md:text-2xl font-bold bg-gradient-to-r bg-gradient-to-r from-white via-gray-200 to-purple-200 bg-clip-text text-transparent">
            Cryptra
          </div>
          <div className="hidden md:flex space-x-8">
            <button type='button' className="text-xl hover:text-purple-400 transition-colors hover:cursor-pointer" onClick={() => router.push('/')}>About</button>
            <button  className="text-xl hover:text-purple-400 transition-colors hover:cursor-pointer" onClick={() => router.push('/pairs')} >Pairs</button>
            <button  className="text-xl hover:text-purple-400 transition-colors hover:cursor-pointer" onClick={() => router.push('/')}>Community</button>

          </div>
          <button type="button" className="text-md md:text-lg px-6 py-2 border border-purple-400 rounded-full font-semibold hover:shadow-lg">
            Sign Up
          </button>
        </div>
      </nav>
      </div>

  )
}