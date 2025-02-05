import React from 'react';
import Link from 'next/link';
import { Linkedin, Github, BriefcaseBusiness } from 'lucide-react';

function Footer() {
	return (
		<div className="pl-4 pr-4 pt-2 pb-2 shadow-lg flex justify-between items-center gap-5 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ">
			{/* Social Links or Additional Links */}
			<div className="flex gap-4 text-gray-800 dark:text-white text-sm">
				<Link
					href="https://www.linkedin.com"
					target="_blank"
					className="flex items-center gap-2 hover:text-blue-500"
				>
					<Linkedin size={20} />
				</Link>
				<Link
					href="https://github.com"
					target="_blank"
					className="flex items-center gap-2 hover:text-gray-600"
				>
					<Github size={20} />
				</Link>
				<Link
					href="https://github.com"
					target="_blank"
					className="flex items-center gap-2 hover:text-gray-600"
				>
					<BriefcaseBusiness size={20} />
				</Link>
			</div>

			{/* Copyright notice */}
			<div className="text-gray-500 dark:text-gray-400 text-sm flex justify-center gap-5 items-center">
				<p>Design and Developed by Shan-e-Haider Bukhari</p>
				<p>&copy; {new Date().getFullYear()} All rights reserved.</p>
			</div>
		</div>
	);
}

export default Footer;
