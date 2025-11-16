import { Logo } from "../shared/components/Logo";
import { ManAtTheTable } from "./signUp/components/svg/ManAtTheTable";

export function SignUp() {
    return (
        <div className="flex h-screen">
            {/* Left Section */}
            <div className="w-1/2 h-full flex flex-col p-8 bg-blue-100">
                {/* Logo at the top */}
                <div className="mb-8 flex items-center gap-2">
                    <Logo/>
                    <div className="text-5xl font-bold text-black py-4 px-6">Trading Assist</div>
                </div>
                {/* Header below logo */}
                <div className="mb-6">
                    <h1 className="text-4xl font-bold">
                        Welcome!
                    </h1>
                </div>
                
                {/* Motivational text */}
                <div className="mb-8">
                    <p className="text-xl leading-relaxed">
                        We're excited to have you join our trading community! Start by telling us a bit about yourself. Your journey to automating your trading strategies begins with just a few simple details.
                    </p>
                    <p className="text-lg mt-4 leading-relaxed">
                        Fill in your first name, last name, and country to get started. This information helps us personalize your trading experience and connect you with traders from around the world.
                    </p>
                </div>
                
                {/* Illustration */}
                <div className="flex-1 flex items-center justify-center">
                    <ManAtTheTable/>
                </div>
            </div>
            
            {/* Right Section */}
            <div className="w-1/2 h-full flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        Let's Start!
                    </h2>
                    
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Step 1 of 4</span>
                            <span className="text-sm text-gray-500">25%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#5C7CFA] h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <div className="flex justify-between mt-2">
                            {[1, 2, 3, 4].map((step) => (
                                <div
                                    key={step}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        step === 1
                                            ? 'bg-[#5C7CFA] text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                                >
                                    {step}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-6">
                        {/* First Name Input */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C7CFA] focus:border-transparent"
                                placeholder="Enter your first name"
                            />
                        </div>

                        {/* Last Name Input */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C7CFA] focus:border-transparent"
                                placeholder="Enter your last name"
                            />
                        </div>

                        {/* Country Select */}
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                            </label>
                            <select
                                id="country"
                                name="country"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C7CFA] focus:border-transparent bg-white"
                            >
                                <option value="">Select your country</option>
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="CA">Canada</option>
                                <option value="AU">Australia</option>
                                <option value="DE">Germany</option>
                                <option value="FR">France</option>
                                <option value="IT">Italy</option>
                                <option value="ES">Spain</option>
                                <option value="NL">Netherlands</option>
                                <option value="BE">Belgium</option>
                                <option value="CH">Switzerland</option>
                                <option value="AT">Austria</option>
                                <option value="SE">Sweden</option>
                                <option value="NO">Norway</option>
                                <option value="DK">Denmark</option>
                                <option value="FI">Finland</option>
                                <option value="PL">Poland</option>
                                <option value="CZ">Czech Republic</option>
                                <option value="IE">Ireland</option>
                                <option value="PT">Portugal</option>
                                <option value="GR">Greece</option>
                                <option value="UA">Ukraine</option>
                            </select>
                        </div>

                        {/* Next Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#5C7CFA] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#4318FF] transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            Next
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
  }
