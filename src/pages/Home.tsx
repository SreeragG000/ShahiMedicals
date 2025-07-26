import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Truck, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/contexts/ProductContext';
import heroImage from '@/assets/pharmacy-hero.jpg';

export default function Home() {
  const { state: { products } } = useProducts();
  const featuredProducts = products.slice(0, 6);

  const features = [
    {
      icon: Shield,
      title: "Authentic Medicines",
      description: "100% genuine medicines from trusted manufacturers"
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Round-the-clock pharmacy service for emergencies"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and secure delivery to your doorstep"
    },
    {
      icon: Award,
      title: "Expert Care",
      description: "Professional guidance from qualified pharmacists"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Pharmacy Hero"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 animate-fade-in">
              Your Health, <span className="bg-gradient-primary bg-clip-text text-transparent">Our Priority</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
              Trusted pharmacy services with authentic medicines, expert guidance, and convenient delivery. 
              Your wellness journey starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Link to="/products">
                <Button size="lg" variant="medical" className="w-full sm:w-auto">
                  Shop Medicines
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/categories">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Why Choose Shahi Medicals?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Committed to providing the highest quality healthcare services with trust and reliability
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6 group-hover:shadow-glow transition-all duration-300">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-card-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-foreground">
                Featured Products
              </h2>
              <p className="text-xl text-muted-foreground">
                Discover our most popular and trusted medicines
              </p>
            </div>
            
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-primary-foreground">
            Ready to Get Started?
          </h2>
          
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Browse our extensive collection of medicines and health products. 
            Your health is our commitment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}