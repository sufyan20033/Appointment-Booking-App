import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Provider } from '@/types';

interface ProviderMapProps {
  providers: Provider[];
  onSelectProvider?: (provider: Provider) => void;
}

export const ProviderMap = ({ providers, onSelectProvider }: ProviderMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([40.7128, -74.0060], 12);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add markers
    providers.forEach((provider) => {
      const marker = L.marker([provider.location.lat, provider.location.lng]).addTo(map);
      
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold">${provider.name}</h3>
          <p class="text-sm text-gray-600">${provider.service}</p>
          <p class="text-xs text-gray-500 mt-1">${provider.location.address}</p>
        </div>
      `);

      if (onSelectProvider) {
        marker.on('click', () => onSelectProvider(provider));
      }
    });

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [providers, onSelectProvider]);

  return <div ref={mapRef} className="h-[500px] w-full rounded-lg overflow-hidden border shadow-md" />;
};
