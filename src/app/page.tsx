import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Plane, Globe, Star, ClipboardCheck, BarChart3, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
            <div className="flex items-center gap-0">
              {/* Logo container with increased size */}
              <div className="h-16 w-40 relative">
                <Image
                  src="/images/ram-logo.png"
                  alt="Royal Air Maroc Logo"
                  fill
                  className="object-contain object-left"
                  sizes="160px"
                />
              </div>
              {/* <div className="hidden sm:block -ml-8">
                <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  ProjectEval
                </span>
                <p className="text-xs text-muted-foreground">Système d'Évaluation</p>
              </div> */}
            </div>
            <div className="flex gap-4">
              <Link href="/auth/login">
                <Button className="bg-red-600 hover:bg-red-700 text-white">Connexion</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 md:py-32 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-green-600/5"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot;><g fill=&quot;none&quot; fillRule=&quot;evenodd&quot;><g fill=&quot;%23dc2626&quot; fillOpacity=&quot;.03&quot;><path d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/></g></g></svg>')] opacity-30"></div>

            <div className="container mx-auto px-4 md:px-6 text-center relative">
              <div className="max-w-4xl mx-auto">
                <Badge className="mb-6 bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                  <Star className="w-3 h-3 mr-1" />
                  Plateforme d'Évaluation des projets d'innovation
                </Badge>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                  <span className="bg-gradient-to-r from-red-600 via-red-700 to-green-600 bg-clip-text text-transparent">
                    Excellence & Innovation
                  </span>
                  <br />
                  <span className="text-slate-800">au Service du Ciel</span>
                </h1>

                <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                  Plateforme dédiée à l'évaluation et au suivi des projets d’innovation du programme We Innov'8 Make Impact de Royal Air Maroc.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Link href="/auth/login">
                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white gap-2 px-8">
                      <Plane className="h-5 w-5" />
                      Accéder à la Plateforme
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50 gap-2 px-8"
                  >
                    <Globe className="h-5 w-5" />
                    Découvrir RAM
                  </Button>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">90+</div>
                    <div className="text-sm text-slate-600">Destinations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">50+</div>
                    <div className="text-sm text-slate-600">Projets Actifs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">15M+</div>
                    <div className="text-sm text-slate-600">Passagers/An</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">70+</div>
                    <div className="text-sm text-slate-600">Ans d'Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section - Comment Nous Évaluons l'Excellence */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
                  <Zap className="w-3 h-3 mr-1" />
                  Innovation Continue
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
                  Pourquoi Évaluer les Projets RAM ?
                </h2>
                <div className="text-lg text-slate-600 max-w-2xl mx-auto">
  <div className=" rounded-lg p-4 bg-white/60">
    L’innovation est au cœur de notre démarche. Notre plateforme d’évaluation valorise les opinions de nos employés, l’impact concret et la capacité à faire évoluer l’entreprise vers plus d’agilité, de performance et de pertinence dans un environnement en constante transformation.
  </div>
</div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-slate-800">Projets Collaboratifs</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base leading-relaxed">
                      Explorez et évaluez les projets stratégiques qui façonnent l'avenir de RAM, de l'expérience
                      passager aux innovations technologiques.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <ClipboardCheck className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-slate-800">Évaluation Structurée</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base leading-relaxed">
                      Système d'évaluation basé sur les critères de désirabilité, viabilité, faisabilité et alignement
                      avec la stratégie RAM.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-slate-800">Suivi Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base leading-relaxed">
                      Tableaux de bord avancés pour suivre l'évolution des projets et mesurer leur impact sur la
                      performance globale de RAM.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
