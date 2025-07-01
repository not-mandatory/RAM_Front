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
        {/* En-tête */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
            <div className="flex items-center gap-0">
              <div className="h-16 w-40 relative">
                <Image
                  src="/images/ram-logo.png"
                  alt="Logo Royal Air Maroc"
                  fill
                  className="object-contain object-left"
                  sizes="160px"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/auth/login">
                <Button className="bg-red-600 hover:bg-red-700 text-white">Connexion</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Section Héro */}
          <section className="relative py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-green-600/5"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-30"></div>

            <div className="container mx-auto px-4 md:px-6 text-center relative">
              <div className="max-w-4xl mx-auto">
                <Badge className="mb-6 bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                  <Star className="w-3 h-3 mr-1" />
                  Plateforme d’Évaluation des Projets
                </Badge>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                  <span className="bg-gradient-to-r from-red-600 via-red-700 to-green-600 bg-clip-text text-transparent">
                    Excellence & Innovation
                  </span>
                  <br />
                  {/* <span className="text-slate-800">au Service du Ciel</span> */}
                </h1>

                <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                  Une plateforme dédiée à l’évaluation et au suivi des projets d’innovation dans le cadre du programme We Innov'8 Make Impact de Royal Air Maroc.
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">90+</div>
                    <div className="text-sm text-slate-600">Destinations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">50+</div>
                    <div className="text-sm text-slate-600">Projets actifs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">15M+</div>
                    <div className="text-sm text-slate-600">Passagers/an</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">70+</div>
                    <div className="text-sm text-slate-600">Années d’excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section des Fonctionnalités */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
                  <Zap className="w-3 h-3 mr-1" />
                  Innovation Continue
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
                  Pourquoi l’innovation est-elle essentielle pour nous ?
                </h2>
                <div className="text-lg text-slate-600 max-w-2xl mx-auto">
                  <div className="rounded-lg p-4 bg-white/60">
                    L’innovation est au cœur de notre démarche. Notre plateforme d’évaluation valorise l’avis des collaborateurs, l’impact concret des projets et leur capacité à rendre l’entreprise plus agile, performante et adaptée à un environnement en perpétuelle évolution.
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
                      Explorez et évaluez des projets stratégiques façonnant l’avenir de RAM, de l’expérience passager à l’innovation technologique.
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
                      Un système d’évaluation basé sur la désirabilité, la viabilité, la faisabilité et l’alignement avec les objectifs stratégiques de RAM.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-slate-800">Suivi des Performances</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base leading-relaxed">
                      Des tableaux de bord avancés pour suivre la progression des projets et mesurer leur impact sur la performance globale de RAM.
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
