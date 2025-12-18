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
                    <div className="px-4 py-2 text-gray-700 font-semibold">Restore Password</div>
                    <ul className="ml-4 mt-1 space-y-1">
                        <li>
                            <a
                                href="/restore-password-1"
                                className="block px-4 py-2 text-blue-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200 underline"
                            >
                                Restore Password 1(Insert your email)
                            </a>
                        </li>
                        <li>
                            <a
                                href="/restore-password-2"
                                className="block px-4 py-2 text-blue-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200 underline"
                            >
                                Restore Password 2(Insert code from email)
                            </a>
                        </li>
                        <li>
                            <a
                                href="/restore-password-3"
                                className="block px-4 py-2 text-blue-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200 underline"
                            >
                                Restore Password 3(Insert new password)
                            </a>
                        </li>
                    </ul>
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