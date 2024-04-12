import React from 'react'
import '../Navbar.css'
import { BiSupport } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdApps } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { FaGoogleDrive } from "react-icons/fa";

function Navbar() {
    return (
        <div className='nav'>
            <FaGoogleDrive />
            <a href="/">Drive</a>
            <input type="text" placeholder='Search' />
            <BiSupport />
            <IoSettingsOutline />
            <IoMdApps />
            <MdAccountCircle />

        </div>
    )
}

export default Navbar
