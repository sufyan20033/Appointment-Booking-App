import { useState } from 'react';
import { mockProviders } from '@/data/mockData';
import { ProviderMap } from '@/components/ProviderMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Clock, CreditCard, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Provider } from '@/types';

const Dashboard = () => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleOpenBooking = (provider: Provider) => {
    setSelectedProvider(provider);
    setBookingDialogOpen(true);
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }
    toast.success('Appointment booked! Payment processed via Stripe. Email confirmation sent.');
    setBookingDialogOpen(false);
    setSelectedDate('');
    setSelectedTime('');
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
                    <Dialog open={bookingDialogOpen && selectedProvider?.id === provider.id} onOpenChange={setBookingDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => handleOpenBooking(provider)} className="w-full">
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Appointment
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-background">
                        <DialogHeader>
                          <DialogTitle>Book Appointment with {provider.name}</DialogTitle>
                          <DialogDescription>
                            Choose your preferred date and time
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="time">Time Slot</Label>
                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent className="bg-background z-50">
                                <SelectItem value="09:00">09:00 AM</SelectItem>
                                <SelectItem value="10:00">10:00 AM</SelectItem>
                                <SelectItem value="11:00">11:00 AM</SelectItem>
                                <SelectItem value="14:00">02:00 PM</SelectItem>
                                <SelectItem value="15:00">03:00 PM</SelectItem>
                                <SelectItem value="16:00">04:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-4">
                              <span className="font-medium">Consultation Fee</span>
                              <span className="text-lg font-bold">$50.00</span>
                            </div>
                            <Button onClick={handleBookAppointment} className="w-full">
                              <CreditCard className="mr-2 h-4 w-4" />
                              Pay with Stripe & Book
                            </Button>
                            <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                              <Mail className="h-3 w-3" />
                              You'll receive email confirmation
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
