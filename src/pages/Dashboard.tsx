import { useState } from 'react';
import { mockProviders } from '@/data/mockData';
import { ProviderMap } from '@/components/ProviderMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Provider } from '@/types';

const Dashboard = () => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const handleBookAppointment = (provider: Provider, slotId: string) => {
    toast.success(`Appointment booked with ${provider.name}!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Service Providers</h1>
          <p className="text-muted-foreground">Browse available providers and book your appointments</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Map Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Provider Locations
                </CardTitle>
                <CardDescription>Click on markers to view provider details</CardDescription>
              </CardHeader>
              <CardContent>
                <ProviderMap providers={mockProviders} onSelectProvider={setSelectedProvider} />
              </CardContent>
            </Card>
          </div>

          {/* Providers List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Available Providers</h2>
            {mockProviders.map((provider) => (
              <Card key={provider.id} className={selectedProvider?.id === provider.id ? 'ring-2 ring-primary' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{provider.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {provider.location.address}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{provider.service}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Available Time Slots
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {provider.availability.map((slot) => (
                        <Button
                          key={slot.id}
                          variant={slot.isBooked ? 'outline' : 'default'}
                          size="sm"
                          disabled={slot.isBooked}
                          onClick={() => handleBookAppointment(provider, slot.id)}
                          className="w-full"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          {slot.date} {slot.startTime}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
