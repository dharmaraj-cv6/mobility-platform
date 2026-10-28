import BookingDateTime from "../../common/SchedulingDatePicker";


export default function RideLater() {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-2">

      <div className="flex items-center gap-3">  
        <BookingDateTime />       
      </div> 

    </div>
  );
}