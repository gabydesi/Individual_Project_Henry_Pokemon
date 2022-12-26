import React from 'react';
import { Link } from 'react-router-dom';
//genero mi componente funcional

const Navbar = (props) => {
    return (
        <div>
            <Link to="/">Home</Link>
            <Link to="/create">Create</Link>
        </div>
    )
}

export default Navbar;