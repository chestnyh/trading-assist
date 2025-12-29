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
                    <a
                        href="/sign-up"
                        className="block px-4 py-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 font-medium underline"
                    >
                        Sign Up
                    </a>
                </li>
                <li>
                            <a
                        href="/restore-password"
                        className="block px-4 py-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 font-medium underline"
                            >
                        Restore Password
                            </a>
                </li>
                <li>
                    <a
                        href="/sign-in"
                        className="block px-4 py-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 font-medium underline"
                    >
                        Sign In
                    </a>
                </li>
            </ul>
        </div>
    );
}