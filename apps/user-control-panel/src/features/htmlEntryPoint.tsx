export function HtmlEntryPoint() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <ul className="space-y-2">
                <li>
                    <a 
                        href="/main" 
                        className="block px-4 py-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 font-medium underline"
                    >
                        Main
                    </a>
                </li>
                <li>
                    <div className="px-4 py-2 text-gray-700 font-semibold">Sign Up</div>
                    <ul className="ml-4 mt-1 space-y-1">
                        <li>
                            <a 
                                href="/sign-up-1" 
                                className="block px-4 py-2 text-blue-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200 underline"
                            >
                                Sign Up 1(first name, last name, email, country)
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/sign-up-2" 
                                className="block px-4 py-2 text-blue-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200 underline"
                            >
                                Sign Up 2(Trading preferences)
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}