import { Reservation } from '@/lib/types';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ReservationSectionProps {
  filteredReservations: Reservation[];
  handleUpdateReservationStatus: (id: string, status: "pending" | "confirmed") => void;
}

const ReservationSection = ({
  filteredReservations = [],
  handleUpdateReservationStatus
}: ReservationSectionProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold">Reservations</h2>
      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr className="border-b">
              <th className="py-3 px-2 text-left font-medium">Name</th>
              <th className="py-3 px-2 text-left font-medium">Date</th>
              <th className="py-3 px-2 text-left font-medium">Time</th>
              <th className="py-3 px-2 text-left font-medium">Guests</th>
              <th className="py-3 px-2 text-left font-medium">Phone</th>
              <th className="py-3 px-2 text-left font-medium">Status</th>
              <th className="py-3 px-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="border-b">
                  <td className="py-3 px-2">{reservation.name}</td>
                  <td className="py-3 px-2">{reservation.date}</td>
                  <td className="py-3 px-2">{reservation.time}</td>
                  <td className="py-3 px-2">{reservation.guests}</td>
                  <td className="py-3 px-2">{reservation.phone}</td>
                  <td className="py-3 px-2">
                    <Badge variant={reservation.status === 'confirmed' ? 'default' : 'outline'}>
                      {reservation.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2">
                    {reservation.status === 'pending' ? (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateReservationStatus(reservation.id, 'confirmed')}
                      >
                        Confirm
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateReservationStatus(reservation.id, 'pending')}
                      >
                        Set Pending
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-3">No reservations found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ReservationSection;
