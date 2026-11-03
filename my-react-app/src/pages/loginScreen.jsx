
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { logIn } from '../store/authSlice.js'

const PHONE_LENGTH = 10

function LoginScreen() {
  const dispatch = useDispatch()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  function handleChange(event) {
    const digits = event.target.value.replace(/\D/g, '').slice(0, PHONE_LENGTH)
    setPhone(digits)
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (phone.length !== PHONE_LENGTH) {
      setError(`Please enter a ${PHONE_LENGTH}-digit phone number.`)
      return
    }

    dispatch(logIn(phone))
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">

      {/* Left Side - CRM Banner */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-indigo-700 p-8 md:p-12 lg:p-14 text-white">

        {/* Decorative circles */}
        <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white/5" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-34 w-34 items-center justify-center rounded-xl bg-white text-xl font-bold text-blue-800 shadow-lg">
            LF
          </div>
          <span className="text-1xl font-bold tracking-wide">
            LeadFlow CRM
          </span>
        </div>

        {/* Banner Content */}
        <div className="relative z-10 my-16 max-w-xl">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-widest">
            SMART CRM SOLUTION
          </span>

          <h1 className="mt-8 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Manage Your Leads.
            <span className="mt-2 block text-blue-200">
              Grow Your Business.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-8 text-blue-100 md:text-lg">
            Simplify your sales process, manage customer relationships,
            and track your business growth with LeadFlow CRM.
          </p>

          <div className="mt-10 space-y-5">
            {[
              'Manage your leads efficiently',
              'Track sales performance',
              'Build better customer relationships',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-400/20 text-sm text-blue-200">
                  ✓
                </span>
                <span className="text-sm text-blue-50 md:text-base">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-sm text-blue-200">
          © 2026 LeadFlow CRM. All rights reserved.
        </p>
      </div>

      {/* Right Side - Login */}
      <div className="flex items-center justify-center bg-slate-50 px-6 py-12 md:px-12">

        <div className="w-full max-w-md">

          {/* Mobile Brand */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 font-bold text-white">
              LF
            </div>
            <span className="text-xl font-bold text-slate-900">
              LeadFlow CRM
            </span>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Welcome to LeadFlow
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Welcome Back!
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500 md:text-base">
              Sign in to continue to your CRM dashboard.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate>

            <div className="mb-7">
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Phone Number
              </label>

              <div className={`flex items-center rounded-xl border bg-white px-4 transition-all ${
                error
                  ? 'border-red-500'
                  : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10'
              }`}>
                <span className="mr-3 text-sm font-medium text-slate-500">
                  +91
                </span>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  autoFocus
                  value={phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full border-0 bg-transparent py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              {error && (
                <p className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-4 text-base font-semibold text-white shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-xl active:translate-y-0"
            >
              Log In
              <span>→</span>
            </button>

          </form>

          {/* Footer */}
          <div className="mt-10 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Secure access to your CRM workspace.
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default LoginScreen