import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingUrl: string;
  name: string;
}

const BookingModal = ({ open, onOpenChange, bookingUrl, name }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Book {name}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 px-4 pb-4 h-full">
          <iframe
            src={bookingUrl}
            className="w-full h-full min-h-[60vh] rounded-md border-0"
            title={`Book ${name}`}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
