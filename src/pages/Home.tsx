import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Book Your Appointments with Ease
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Connect with trusted service providers, schedule appointments instantly, and manage your bookings all in one place.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Browse Providers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Why Choose BookEase?</h2>
            <p className="text-muted-foreground">Everything you need to manage appointments efficiently</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Calendar className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Easy Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Book appointments in seconds with our intuitive interface
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <MapPin className="mb-4 h-12 w-12 text-secondary" />
              <h3 className="mb-2 text-xl font-semibold">Find Nearby</h3>
              <p className="text-sm text-muted-foreground">
                Locate service providers near you with interactive maps
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Clock className="mb-4 h-12 w-12 text-accent" />
              <h3 className="mb-2 text-xl font-semibold">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">
                Get instant notifications about your appointments
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Shield className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your data is protected with industry-standard security
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of users who trust BookEase for their appointments
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
