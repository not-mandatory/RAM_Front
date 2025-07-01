import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Partie gauche – Image de fond avec superposition */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <Image
            src="/images/royal-air-maroc.jpg"
            alt="Fond RAM"
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
          {/* Superposition sombre pour lisibilité */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Contenu en bas de page */}
        <div className="absolute bottom-8 left-8 right-8 text-white z-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight">
              Plateforme
              <br />
              d’Évaluation de Projets
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Plateforme d’évaluation des projets d’innovation dans le cadre du programme We Innov'8 Make Impact.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-sm font-bold">70+</span>
              </div>
              <div>
                <div className="font-semibold">Années d’excellence</div>
                <div className="text-sm opacity-80">Depuis 1953</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partie droite – Formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Logo pour mobile */}
          <div className="flex justify-center lg:hidden">
            <div className="flex items-center gap-0">
              <div className="h-12 w-20 relative">
                <Image
                  src="/images/ram-logo.png"
                  alt="Logo Royal Air Maroc"
                  fill
                  className="object-contain object-left"
                  sizes="80px"
                />
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bienvenue</h1>
            <p>Connectez-vous pour accéder à la plateforme.</p>
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
            Besoin d’aide ?  
            <span className="font-medium"> Contactez l’administrateur.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
