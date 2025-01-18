import { Link } from 'react-router-dom'
import { AiOutlineCamera, AiOutlineHome } from 'react-icons/ai'

function Navigation() {
  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className="text-gray-600 hover:text-blue-500">
          <AiOutlineHome className="text-2xl" />
        </Link>
        <Link to="/camera" className="text-gray-600 hover:text-blue-500">
          <AiOutlineCamera className="text-2xl" />
        </Link>
      </div>
    </nav>
  )
}

export default Navigation