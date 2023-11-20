import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <div className='navbar-container'>
        <nav className='navList'>
            <ul className='navItem'>
                <li className='navLink'>
                    <Link href="/">CompAsia</Link>
                </li>
            </ul>
        </nav>
        <nav className='navList'>
            <ul className='navItem'>
                <li className='navLink'>
                    <Link href="/">Home</Link>
                </li>
                <li className='navLink'>

                    <Link href="/purchase">Purchase</Link>
                </li>
            </ul>
        </nav>
    </div>
  )
}
