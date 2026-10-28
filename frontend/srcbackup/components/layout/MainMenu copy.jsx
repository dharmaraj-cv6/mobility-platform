import { Link } from "react-router-dom";

import BookingDateTime from "../common/SchedulingDatePicker";
import demanarea from  "../../assets/Home/HeroVehicles/Zone1/demanarea.jpg";

import { ChevronRight} from "lucide-react";

import driver from "../../assets/Home/HeroVehicles/Zone1/d1.png";


const Navbar = () => {

  
  return (
     <div className="mx-auto flex justify-center md:flex items-center gap-4">
          <nav className="items-center justify-center flex gap-8 list-none">

                <li >
                  <Link to="/instantride" className="shadow-xs items-center rounded-xl border border-[#eeeeee] justify-center flex gap-4 px-2 py-2">
                

                       <div className="flex items-center gap-3">

                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xl">
                            G
                          </div>

                          <div className=" sm:block">
                            <h1 className="text-md font-[550] text-slate-800">
                             Instant Ride
                            </h1>

                            <p className="text-xs text-slate-500">
                            Ride instantly
                            </p>
                          </div>
                          <ChevronRight size={16}  className="rounded-xl bg-[#155dfc] text-white"  />

                        </div>

                  </Link>
                </li>
                
                  <li >
                  <Link to="/" className=" shadow-xl items-center rounded-xl border border-[#eeeeee] justify-center flex gap-4 px-2 py-2">
                

                       <div className="flex items-center gap-3">

                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xl">
                            G
                          </div>

                          <div className=" sm:block">
                            <h1 className="text-md font-[550] text-slate-800">
                              Ride Later
                            </h1>

                            <p className="text-xs text-slate-500">
                            Plan your ride
                            </p>
                          </div>
                          <ChevronRight size={16}  className="rounded-xl bg-[#c8ca3e] text-white"  />

                        </div>

                  </Link>
                </li>
                
                  <li >
                  <Link to="/" className=" shadow-xl items-center rounded-xl border border-[#eeeeee] justify-center flex gap-4 px-2 py-2">
                

                       <div className="flex items-center gap-3">

                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xl">
                            G
                          </div>

                          <div className=" sm:block">
                            <h1 className="text-md font-[550] text-slate-800">
                              CoRide
                            </h1>

                            <p className="text-xs text-slate-500">
                            Join the ride
                            </p>
                          </div>
                          <ChevronRight size={16} className="rounded-xl bg-[#c8ca3e] text-white" />

                        </div>

                  </Link>
                </li>
                

        </nav>

          {/* book now */}
                  <div className=" items-center absolute top-40 bg-white rounded-xl shadow-xl p-1 z-99">
        
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
                           <img src={demanarea} alt="" className="h-12 w-fit block object-cover rounded-xl" />  
                           </div> 

                        </div>   

                      </div>

                  {/* schedule */}
                      <div
                        className="flex lg:hidden absolute items-center  top-30 bg-white rounded-2xl shadow-xl p-0 max-w-[80%] z-99">
        
                        <div className="flex items-center gap-3">  
                            <BookingDateTime />       
                        </div>        
                      </div>

                    {/* CoRide */}

                      <div
                        className=" lg:hidden items-center  absolute top-48 bg-white rounded-3xl shadow-xl p-4 max-w-[80%] z-99">
        
                        <div className="flex gap-3">  
                           <img src={driver} alt="" className=" w-16 h-16rounded-full object-cover" />    
                          <div>        
                            <h4 className="">        
                             High Demand area <b className="text-[#155dfc]">123 riders</b> searching   
                            </h4>        
                             
                                 
                          </div>        
                        </div>        
                      </div>
   </div>

   


  );
};


export default Navbar;