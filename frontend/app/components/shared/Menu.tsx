'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    console.log(`Menue is now ${isOpen ? 'Open' : 'Close'}`)
  }

  return (
    <div className="flex items-center">
      <button
        className="text-gray-500 focus:outline-none md:hidden cursor-pointer"
        onClick={toggleMenu}
      >
        {isOpen ? (
          <AiOutlineClose className="h-6 w-6 text-green-500" />
        ) : (
          <AiOutlineMenu className="h-6 w-6 text-green-500" />
        )}
      </button>

      <div
        className={`md:hidden ${
          isOpen
            ? 'p-6 flex flex-col items-center gap-4 absolute top-14 left-0 w-full bg-black text-center text-white text-lg '
            : 'hidden'
        }`}
      >
        <Link href="/create">Create</Link>
        <p>Movies</p>
        <p>Series</p>
        <p>Anime</p>
        <Link href="/account">Account</Link>
        <button className="bg-green-500 text-white rounded-full p-1 min-w-28 text-md hidden md:block">
          Login
        </button>
      </div>
    </div>
  )
}

export default Menu
