import { Link } from 'react-router-dom';

import { Logo } from "../../shared/components/Logo"

export function Main() {
  return (
    <div className="min-h-screen bg-darkbg">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto px-[100px]">
          <div className="flex items-center justify-between">
            {/* Left Section - Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center justify-center">
                <Logo/>
              </div>
              <span className="text-xl font-bold text-gray-900">Trading Assist</span>
            </div>

            {/* Center Section - Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className="text-gray-900 hover:text-[#5C7CFA] transition-colors">
                About us
              </Link>
              <Link to="/documents" className="text-gray-900 hover:text-[#5C7CFA] transition-colors">
                View documents
              </Link>
              <Link to="/contact" className="text-gray-900 hover:text-[#5C7CFA] transition-colors">
                Contact
              </Link>
            </div>

            {/* Right Section - User Actions */}
            <div className="flex items-center gap-4">
              {/* User Profile Icon */}
              <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {/* Log out Button */}
              <button className="bg-gray-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm">
                Log out
              </button>

              {/* Paper Airplane Icon */}
              <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>

              {/* Moon Icon (Theme Toggle) */}
              <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section*/}
      <section className="bg-white">
        <div className="mx-auto px-[100px]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Column - Text Content */}
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 leading-tight">
                Unlock Your{' '}
                <span className="font-bold">Coding Potential</span>
                {' '}with Enigma
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl">
                Learn coding and design with Enigma-AI, your ultimate destination for mastering the art of creating stunning designs and building powerful applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Get Started
                </button>
                <button className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  Start a Free Trial
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Column - Chart Image */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <img 
                src="../../assets/hero_image.png" 
                alt="Financial Chart" 
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>    

      {/* How it works?  */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto px-[100px]">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
            How it works ?
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {/* Step 1 Card */}
            <div className="bg-gray-100 p-8 rounded-lg shadow-md flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Step 1
              </h3>
              <p className="text-gray-600 text-lg">
                Ready to dive in? Here's how you can start contributing to the Enigma Code-ai developer community.
              </p>
            </div>

            {/* Step 2 Card */}
            <div className="bg-gray-100 p-8 rounded-lg shadow-md flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Step 2
              </h3>
              <p className="text-gray-600 text-lg">
                Access a wealth of resources to support your development journey with Enigma Code-ai.
              </p>
            </div>

            {/* Step 3 Card */}
            <div className="bg-gray-100 p-8 rounded-lg shadow-md flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Step 3
              </h3>
              <p className="text-gray-600 text-lg">
                Access a wealth of resources to support your development journey with Enigma Code-ai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Check on the go  */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto px-[100px]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Section - Mobile Phone Mockup */}
            <div className="flex-1 flex justify-center lg:justify-start">
              <div className="relative w-[300px] h-[600px] bg-gray-800 rounded-[40px] p-2 shadow-2xl">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-10"></div>
                
                {/* Phone Screen */}
                <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="bg-white px-4 py-1 flex justify-between items-center text-xs">
                    <span className="font-semibold">9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 border border-gray-900 rounded-sm"></div>
                      <div className="w-4 h-2 border border-gray-900 rounded-sm"></div>
                    </div>
                  </div>

                  {/* Chat Header */}
                  <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="text-sm font-medium">Chats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-semibold">Trading Assist</div>
                        <div className="text-xs text-gray-500">last seen just now</div>
                      </div>
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="h-[400px] bg-gradient-to-b from-gray-100 to-gray-200 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Welcome Message */}
                      <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[80%]">
                        <p className="text-sm">Welcome to our store! We're so glad to have you here. 😊</p>
                      </div>
                      
                      {/* Assistance Message */}
                      <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[85%]">
                        <p className="text-sm font-medium mb-2">Here's how we can assist you today:</p>
                        <ol className="text-sm space-y-1 list-decimal list-inside">
                          <li>Track Your Order - Easily check the status of your recent purchase.</li>
                          <li>Browse Products - Discover our range of categories, from electronics to home goods.</li>
                          <li>Talk to Support - Need help? We're here to assist you with any queries.</li>
                        </ol>
                        <p className="text-sm mt-2">Choose one of the options below, or type your question to get started!</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-2">
                      <button className="w-full bg-green-500 text-white rounded-xl py-3 px-4 text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Track my order
                      </button>
                      <button className="w-full bg-green-500 text-white rounded-xl py-3 px-4 text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Browse products
                      </button>
                      <button className="w-full bg-green-500 text-white rounded-xl py-3 px-4 text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Talk to support
                      </button>
                    </div>
                  </div>

                  {/* Input Field */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
                    <div className="text-xs text-gray-400 text-right mb-1">10:15</div>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a2 2 0 000-2.828l-6.414-6.414a2 2 0 10-2.828 2.828L15.172 7z" />
                      </svg>
                      <input type="text" placeholder="Message" className="flex-1 bg-transparent text-sm outline-none" />
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - QR Code and Text */}
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Check on the go{' '}
                <span className="font-bold">anytime anywhere</span>
              </h2>
              
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* QR Code */}
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <div className="w-48 h-48 bg-white border-2 border-gray-900 grid grid-cols-8 grid-rows-8">
                    {/* Simple QR code pattern */}
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${
                          Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Descriptive Text */}
                <div className="flex flex-col justify-center">
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Scan to get access to our chatbot
                  </p>
                  <p className="text-sm text-gray-600">
                    IOS & Android
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto px-[100px]">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Testimonials Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Testimonial Card 1 - Hadid Khan */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              {/* Star Rating - 5/5 */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 3.817 1.48-8.279L.004 9.306l8.332-1.151L12 .587z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                "Great session! Dani was super helpful. She shared some practical advice on how can lorem ip we go about refining our service offerings."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  HK
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Hadid Khan</p>
                  <p className="text-xs text-gray-600">UIUX Designer</p>
                </div>
              </div>
            </div>

            {/* Testimonial Card 2 - Wade Warren */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              {/* Star Rating - 4/5 */}
              <div className="flex gap-1 mb-4">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 3.817 1.48-8.279L.004 9.306l8.332-1.151L12 .587z"/>
                  </svg>
                ))}
                <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 3.817 1.48-8.279L.004 9.306l8.332-1.151L12 .587z"/>
                </svg>
              </div>
              <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                "It's is both attractive and highly adaptable. It's exactly what I've been looking forefinitely wo lorem ipsum dolorth the investment."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  WW
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Wade Warren</p>
                  <p className="text-xs text-gray-600">Web Designer</p>
                </div>
              </div>
            </div>

            {/* Testimonial Card 3 - Jenny Wilson */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              {/* Star Rating - 5/5 */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 3.817 1.48-8.279L.004 9.306l8.332-1.151L12 .587z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                "I am really satisfied with it. I'm good to go. It really saves me time and effort. It's is exactly what our business has been lacking."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  JW
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Jenny Wilson</p>
                  <p className="text-xs text-gray-600">Trust Administrator</p>
                </div>
              </div>
            </div>

            {/* Testimonial Card 4 - Max Wieder */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              {/* Star Rating - 3/5 */}
              <div className="flex gap-1 mb-4">
                {[...Array(3)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 3.817 1.48-8.279L.004 9.306l8.332-1.151L12 .587z"/>
                  </svg>
                ))}
                {[...Array(2)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 3.817 1.48-8.279L.004 9.306l8.332-1.151L12 .587z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                "Great session! Dani was super helpful. She shared some practical advice on how can lorem ip we go about refining our service offerings."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  MW
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Max Wieder</p>
                  <p className="text-xs text-gray-600">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto px-[100px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Years Graph */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              {/* Graph Area */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <svg viewBox="0 0 300 150" className="w-full h-32">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line key={y} x1="30" y1={20 + y} x2="280" y2={20 + y} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {/* X-axis labels */}
                  {['2016-1', '2016-3', '2016-5', '2016-7', '2016-9', '2016-11'].map((label, i) => (
                    <text key={i} x={40 + i * 48} y={145} fontSize="8" fill="#6b7280" textAnchor="middle">
                      {label}
                    </text>
                  ))}
                  {/* Y-axis labels */}
                  {[0, 50, 100, 150, 200, 250].map((val, i) => (
                    <text key={i} x="25" y={130 - i * 20} fontSize="8" fill="#6b7280" textAnchor="end">
                      {val}
                    </text>
                  ))}
                  {/* Red line */}
                  <polyline
                    points="40,110 88,90 136,70 184,30 232,50 280,80"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  {/* Blue line */}
                  <polyline
                    points="40,120 88,100 136,80 184,50 232,70 280,100"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              
              {/* Text and Icons */}
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-gray-700 flex-1">
                  Ready to dive in? Here's how you can start contributing to the Enigma Code-ai developer community.
                </p>
                <div className="flex flex-col gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 - Months Graph */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              {/* Graph Area */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <svg viewBox="0 0 300 150" className="w-full h-32">
                  {/* Grid lines */}
                  {[0, 5, 10, 15, 20, 25, 30].map((y, i) => (
                    <line key={i} x1="30" y1={20 + i * 15} x2="280" y2={20 + i * 15} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {/* X-axis labels */}
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((label, i) => (
                    <text key={i} x={35 + i * 20} y={145} fontSize="8" fill="#6b7280" textAnchor="middle">
                      {label}
                    </text>
                  ))}
                  {/* Y-axis labels */}
                  {[-5, 0, 5, 10, 15, 20, 25, 30].map((val, i) => (
                    <text key={i} x="25" y={130 - i * 15} fontSize="8" fill="#6b7280" textAnchor="end">
                      {val}
                    </text>
                  ))}
                  {/* Red line */}
                  <polyline
                    points="35,120 55,110 75,100 95,85 115,70 135,55 155,45 175,40 195,45 215,55 235,70 255,85"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  {/* Blue line */}
                  <polyline
                    points="35,125 55,115 75,105 95,90 115,75 135,60 155,50 175,35 195,40 215,50 235,65 255,80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              
              {/* Text and Icons */}
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-gray-700 flex-1">
                  Access a wealth of resources to support your development journey with Enigma Code-ai.
                </p>
                <div className="flex flex-col gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3 - Days Graph */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              {/* Graph Area */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <svg viewBox="0 0 300 150" className="w-full h-32">
                  {/* Grid lines */}
                  {[0, 20, 40, 60, 80, 100].map((y, i) => (
                    <line key={i} x1="30" y1={20 + i * 20} x2="280" y2={20 + i * 20} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {/* X-axis labels */}
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => (
                    <text key={i} x={50 + i * 35} y={145} fontSize="8" fill="#6b7280" textAnchor="middle">
                      {label}
                    </text>
                  ))}
                  {/* Y-axis labels */}
                  {[0, 20, 40, 60, 80, 100].map((val, i) => (
                    <text key={i} x="25" y={130 - i * 20} fontSize="8" fill="#6b7280" textAnchor="end">
                      {val}
                    </text>
                  ))}
                  {/* Red line */}
                  <polyline
                    points="50,100 85,90 120,50 155,70 190,80 225,40 260,60"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  {/* Blue line */}
                  <polyline
                    points="50,110 85,50 120,60 155,80 190,90 225,70 260,80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              
              {/* Text and Icons */}
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-gray-700 flex-1">
                  Access a wealth of resources to support your development journey with Enigma Code-ai.
                </p>
                <div className="flex flex-col gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto px-[100px]">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <br /> Questions
            </h2>
            <p className="text-gray-600">
              Have questions about Enigma Code-ai? Here are some of the most common inquiries we receive from our users. If you don't find the answer you're looking for, feel free to contact us.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* FAQ Item 1 - Open */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">What is Enigma Code-ai?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p className="mt-2 text-gray-600">
                Have questions about Enigma Code-ai? Here are some of the most common inquiries we receive from our users. If you don't find the answer you're looking for, feel free to contact us.
              </p>
            </div>

            {/* FAQ Item 2 - Closed */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">How do I get started with Enigma Code-ai?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* FAQ Item 3 - Closed */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">What programming languages does Enigma Code-ai support?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* FAQ Item 4 - Closed */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">Can I use Enigma Code-ai for free?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* FAQ Item 5 - Closed */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">How does the AI-powered code completion work?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* FAQ Item 6 - Closed */}
            <div className="pb-4">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">What if I need help or have a question?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="mx-auto px-[100px]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-normal text-gray-900 mb-4">
              Many users trust us
            </h2>
            <p className="text-2xl text-gray-900 mb-10">
              join us
            </p>
            <div className="flex justify-center gap-6">
              <button className="bg-black text-white px-8 py-4 rounded-lg shadow-lg hover:bg-gray-800 transition-colors duration-300 font-medium">
                Get Started
              </button>
              <button className="bg-gradient-to-br from-gray-400 to-gray-600 text-white px-8 py-4 rounded-lg shadow-lg hover:from-gray-500 hover:to-gray-700 transition-all duration-300 font-medium">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-white py-16 border-t border-blue-200">
        <div className="mx-auto px-[100px]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Logo and Socials */}
            <div className="flex flex-col items-start gap-6">
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold text-gray-700">Logo</span>
                <p className="text-gray-500 text-sm mt-1">
                  Unlock Your Coding <br />
                  Potential with Enigma
                </p>
              </div>
              <div className="flex space-x-4">
                {/* Twitter Icon */}
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 014 9.74c-.095 0-.189-.007-.283-.012v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                {/* GitHub Icon */}
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.499.092.679-.217.679-.481 0-.237-.008-.865-.011-1.695-2.782.602-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.618.069-.606.069-.606 1.003.07 1.531 1.032 1.531 1.032.892 1.529 2.341 1.089 2.91.835.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.953 0-1.092.39-1.988 1.029-2.681-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.022A9.606 9.606 0 0112 6.865c.85.004 1.705.115 2.504.337 1.909-1.292 2.747-1.022 2.747-1.022.546 1.379.202 2.398.099 2.651.64.693 1.028 1.59 1.028 2.681 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2Z" clipRule="evenodd" />
                  </svg>
                </a>
                {/* Slack Icon */}
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.001 10.001a2 2 0 100-4 2 2 0 000 4zm-4 0a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4zm-4 4a2 2 0 100-4 2 2 0 000 4zm-4 0a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4zm-4 4a2 2 0 100-4 2 2 0 000 4zm-4 0a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Middle Column - Product Links */}
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-lg font-bold text-gray-700">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Extension</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Pro</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Docs</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Download</a></li>
              </ul>
            </div>

            {/* Right Column - Resources Links */}
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-lg font-bold text-gray-700">Resources</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">About us</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Customers</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Brand</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}