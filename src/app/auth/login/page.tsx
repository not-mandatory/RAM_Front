import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Full Background Image with Overlays */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Full Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/royal-air-maroc.jpg"
            alt="RAM Background"
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* RAM Logo at Top Left */}
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center gap-0">
            <div className="h-12 w-32 relative">
              <Image
                src="/images/ram-logo.png"
                alt="Royal Air Maroc Logo"
                fill
                className="object-contain object-left"
                sizes="128px"
              />
            </div>
            <div className="text-white -ml-6">
              <div className="font-bold text-xl leading-tight">ProjectEval</div>
              <div className="text-sm opacity-90 leading-tight">Système d'Évaluation</div>
            </div>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-8 left-8 right-8 text-white z-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight">
              Système d'Évaluation
              <br />
              de Projets
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Plateforme dédiée à l'excellence opérationnelle et à l'innovation continue au service de l'aviation
              marocaine.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-sm font-bold">70+</span>
              </div>
              <div>
                <div className="font-semibold">Années d'Excellence</div>
                <div className="text-sm opacity-80">Depuis 1953</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex justify-center lg:hidden">
            <div className="flex items-center gap-0">
              <div className="h-12 w-20 relative">
                <Image
                  src="/images/ram-logo.png"
                  alt="Royal Air Maroc Logo"
                  fill
                  className="object-contain object-left"
                  sizes="80px"
                />
              </div>
              <div className="text-gray-800 -ml-4">
                <div className="font-bold text-lg">ProjectEval</div>
                <div className="text-xs text-gray-600 leading-tight">Système d'Évaluation</div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h1>
            <p>Sign in to access your project evaluation dashboard</p>
          </div>

          <LoginForm />

          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Royal Air Maroc</span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            Need help? Contact your <span className="font-medium">system administrator</span>
          </div>
        </div>
      </div>
    </div>
  )
}
