
import driver from  "../../../assets/Home/HeroVehicles/Zone1/d1.png";
import demantarea from  "../../../assets/Home/HeroVehicles/Zone1/demanarea.jpg";

export default function InstantRide() {
  return (
    <div className="bg-white rounded-xl shadow-xl  p-2">

       <div className="grid sm:grid-cols-2 rounded-xl border border-[#eeeeee] p-2">  
                               <div className="flex items-center gap-3">  
                                <img src={driver} alt="" className=" w-10 h-10 rounded-full object-cover" />    
                               <div className="">   
                                  <p className="text-xs m-0 text-slate-500">
                                   Ganapathy, Coimbatore
                                   </p>     
                                 <h5 className="font-[550] bg-linear-to-r from-[#5f12da] to-[#27032c] bg-clip-text text-transparent">        
                                  High Demand area <span className="text-[#06d143]">123 riders</span> searching   
                                 </h5>
                                  
                               </div> 
                               </div>  
     
                               <div className="block px-2">  
                                <img src={demantarea} alt="" className="h-12 w-fit block object-cover rounded-xl" />  
                                </div> 
     
                             </div> 

    </div>
  );
}