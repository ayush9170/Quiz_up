import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-10 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo / Brand */}
        <div className="text-2xl font-extrabold text-white tracking-wide">
          Quiz<span className="text-blue-500">_Up</span>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-sm font-medium">
          <a href="#" className="hover:text-blue-400 transition">Home</a>
          <a href="#" className="hover:text-blue-400 transition">About</a>
          <a href="#" className="hover:text-blue-400 transition">Create Quiz</a>
          <a href="#" className="hover:text-blue-400 transition">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-5 text-lg">
          <a href="#" className="hover:text-blue-500 transition"><FaFacebook /></a>
          <a href="#" className="hover:text-pink-500 transition"><FaInstagram /></a>
          <a href="#" className="hover:text-blue-400 transition"><FaLinkedin /></a>
        </div>
      </div>

      {/* Divider & Copyright */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Quiz_Up. All rights reserved.
      </div>
    </footer>
  );
}
