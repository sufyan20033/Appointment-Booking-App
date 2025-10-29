import { useState } from 'react';
import { mockAppointments } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Plus, Users, MapPin, Mail, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const ProviderDashboard = () => {
  const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '' });
  const [clinicInfo, setClinicInfo] = useState({
    address: '',
    city: '',
    zipCode: '',
    latitude: '',
    longitude: '',
  });

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Time slot added successfully! Email notification sent to interested patients.');
    setNewSlot({ date: '', startTime: '', endTime: '' });
  };

  const handleSaveClinicInfo = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Clinic location saved successfully!');
  };

  const handleConfirmAppointment = (id: string) => {
    toast.success('Appointment confirmed! Email notification sent to patient.');
  };

  const handleCancelAppointment = (id: string) => {
    toast.success('Appointment cancelled! Email notification sent to patient.');
  };

  const providerAppointments = mockAppointments.filter(apt => apt.providerId === 'p1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
          <p className="text-muted-foreground">Manage your availability and appointments</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{providerAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Active appointments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {providerAppointments.filter(apt => apt.status === 'confirmed').length}
              </div>
              <p className="text-xs text-muted-foreground">Confirmed bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {providerAppointments.filter(apt => apt.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          {/* Clinic Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Clinic Location
              </CardTitle>
              <CardDescription>Set your clinic location for patients to find you</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveClinicInfo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Medical Center Dr"
                    value={clinicInfo.address}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={clinicInfo.city}
                      onChange={(e) => setClinicInfo({ ...clinicInfo, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="10001"
                      value={clinicInfo.zipCode}
                      onChange={(e) => setClinicInfo({ ...clinicInfo, zipCode: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="40.7128"
                      value={clinicInfo.latitude}
                      onChange={(e) => setClinicInfo({ ...clinicInfo, latitude: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="-74.0060"
                      value={clinicInfo.longitude}
                      onChange={(e) => setClinicInfo({ ...clinicInfo, longitude: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Save Location (Google Maps Integration)
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Add Availability */}
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Time Slot
              </CardTitle>
              <CardDescription>Create new available time slots for appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSlot} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slot
                </Button>
              </form>
            </CardContent>
          </Card>

            {/* Upcoming Appointments */}
            <Card>
            <CardHeader>
              <CardTitle>My Appointments</CardTitle>
              <CardDescription>All your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {providerAppointments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No appointments yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {providerAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">User #{appointment.userId}</TableCell>
                        <TableCell>{appointment.service}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.startTime} - {appointment.endTime}</TableCell>
                        <TableCell>
                          <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {appointment.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleConfirmAppointment(appointment.id)}
                              >
                                <Mail className="h-4 w-4 mr-1" />
                                Confirm
                              </Button>
                            )}
                            {appointment.status !== 'cancelled' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCancelAppointment(appointment.id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
