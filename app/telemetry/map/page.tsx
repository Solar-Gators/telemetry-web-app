import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import LocationMap from "@/components/location-map";

export default function MapPage() {
  return (
    <Card className="overflow-hidden h-[calc(100vh-180px)]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Where is Flare?
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-60px)]">
        <LocationMap />
      </CardContent>
    </Card>
  );
}
