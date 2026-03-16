'use client'
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Recycle, Leaf, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="relative">
          <div className="text-9xl font-bold text-transparent bg-gradient-to-r from-green-600 to-green-400 bg-clip-text animate-scale-in">
            404
          </div>
          <Truck className="absolute top-8 -right-8 w-12 h-12 text-green-400 animate-float opacity-30" style={{animationDelay: '0.5s'}} />
          <Truck className="absolute -bottom-8 -left-8 w-10 h-10 text-green-500 animate-float opacity-40" style={{animationDelay: '1.5s'}} />
        </div>
        <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Oops! Page Not Found
          </h1>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
            <p className="text-sm text-gray-600">
              You can return to the homepage or use the navigation to find what you're looking for.
            </p>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <Button 
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}