import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow mb-6">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="font-bold text-xl">Tejesh Kumar@Profile</div>
        <div className="space-x-4">
          <NavLink to="/home" className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}>Home</NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}>Projects</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}>Contact</NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}>Admin</NavLink>
          <NavLink to="/resume" className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}>Resume</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 