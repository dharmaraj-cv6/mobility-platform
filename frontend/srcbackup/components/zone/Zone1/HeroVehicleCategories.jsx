import heroBg from "../../../assets/Home/HeroVehicles/Zone1/z1.jpg";
import taxi from "../../../assets/Home/HeroVehicles/Zone1/v1.png";
import driver from "../../../assets/Home/HeroVehicles/Zone1/d1.png";
import dlogo1 from "../../../assets/Home/HeroVehicles/Zone1/dlogo1.png";

import {CarTaxiFront, ChevronDown,  Shield, Star, Timer, User, UserRoundCheck} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Car,
  Bike,
  Bus,
  Truck,

} from "lucide-react";

export default function Hero() {

    const navigate = useNavigate();

  return (
    <section className=" mt-10 px-4 sm:px-6 lg:px-8">

      <div
        className="
        relative        
        overflow-hidden
        rounded-[35px]
        bg-linear-to-b from-[#0749e2] via-[#7091dd] to-[#030713]
       
      "
      >

        {/* Background Image */}

        <img
          src={heroBg}
          alt=""
          className=" 
          absolute
          bottom-0
          inset-0
          w-full
          h-full
          opacity-25
          object-cover         
          mask-[linear-gradient(to_bottom,transparent_0%,black_50%,black_50%)]
    [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_50%, black_50%)]
        "
        />
        

        {/* Content */}

        <div className="relative z-10 h-full p-6 lg:p-10 pb-2">

           

          {/* Vehicle Categories */}

          <div className="flex flex-wrap gap-3">
            <div className=" flex m-auto gap-3 items-center p-2 lg:p-5">

            <button className="bg-white grid grid-cols-1 text-blue-700 rounded-md px-2 py-1 font-semibold shadow">
              <Car className="inline m-auto " size={30} />
              Cab
              
            </button>

            <button className="bg-white/20 grid grid-cols-1 text-white rounded-md  px-3 py-2">
              <Bike className="inline m-auto mb-1" size={30} />
              Bike
             
            </button>

            <button className="bg-white/20 grid grid-cols-1 text-white rounded-md  px-3 py-2">
              <Bus className="inline m-auto mb-1" size={30} />
              Tour
             
            </button>

            <button className="bg-white/20 grid grid-cols-1 text-white rounded-md  px-3 py-2">
              <Truck className="inline m-auto mb-1" size={30} />
              Goods
              
            </button>
            <button className="bg-white/20 grid grid-cols-1 text-white rounded-md  px-3 py-2">
              <Bike className="inline m-auto mb-1" size={30} />
              Bike
              
            </button>

            <button className="bg-white/20 grid grid-cols-1 text-white rounded-md  px-3 py-2">
              <Bus className="inline m-auto mb-1" size={30} />
              Tour
               
            </button>

            <button className="bg-white/20 grid grid-cols-1 text-white rounded-md  px-3 py-2">
              <Truck className="inline m-auto mb-1" size={30} />
              Goods
               
            </button>
            <button className="bg-white/20 grid grid-cols-1 text-white rounded-md  px-3 py-2">
              <Bike className="inline m-auto mb-1" size={30} />
              Bike
               
            </button>

            <button className="bg-white/20 grid grid-cols-1 text-white rounded-md  px-3 py-2">
              <Bus className="inline m-auto mb-1" size={30} />
              Tour
              
            </button>

            <button className="bg-white/20 grid grid-cols-1 text-white rounded-md px-3 py-2">
              <Truck className="inline m-auto mb-1" size={30} />
              Goods
              
            </button>

            </div>

          </div>

          {/* Main Grid */}

          <div className="mx-auto m-auto flex items-center px-4 sm:px-6 lg:px-8">

            {/* Left */}
            
          <div className="flex bg-[#ffffff] px-12 rounded-xl py-3 place-items-center m-auto">
            
            <div className=" pr-13">

                <div className="mb-2 flex items-center text-xs">   
                <p className=" text-center rounded-2xl"></p>Nearby Drivers
                <UserRoundCheck className="text-[#333333] ml-2 mr-2" size={15} />     
                 <p>K. Kumar</p> 
                  </div>              

              <div className="flex items-center gap-3"> 
                
                 <img src={dlogo1} alt="" className=" w-10 h-10 rounded-full object-contain" />    
                    <div className="inline-block items-center  border-[#dadada] px-2">        
                           <h5 className="font-[550] mb-1 text-xl bg-linear-to-r from-[#5f12da] to-[#27032c] bg-clip-text text-transparent">        
                            Kovai Manawa Taxi
                           </h5>  
                               <div className="mt-1 bg-[#dde8fc] p-0.5 rounded-md flex items-center text-xs">                 
                  <Timer
                    className="text-[#333333] mr-2"
                    size={15}
                  />
                   10 Min away from 1.5km
                  </div>                                
                    </div> 
               </div>

               <p className="font-[550] mt-5">Tata Tigor <span className="text-xs text-[#a3a3a3]">[Seadan]</span></p> 

              <div className="flex gap-2 items-center">     
                           <div className="flex font-medium items-center text-sm">                 
                            <User
                              className="text-[#a3a3a3] mr-2"
                              size={12}
                            />
                            4
                            </div> 
                            <div className="flex font-medium items-center text-sm">                 
                            <CarTaxiFront
                              className="text-[#a3a3a3] mr-2"
                              size={12}
                            />
                            AC
                            </div>
                             <div className="flex font-medium items-center text-sm">                 
                            <Star
                              className="text-[#a3a3a3] mr-2"
                              size={12}
                            />
                            4.5
                            </div>
                          </div>  

                 <p className="text-xs mb-3 flex items-center text-[#a3a3a3]"><Shield className="text-[#a3a3a3] mr-2 font-[650]" size={15}/>No Surprise Fees</p> 

      
              <div className="flex items-center text-xs">  
                
                <button onClick={() => navigate("/booking")}  className="text-lg flex cursor- cursor-pointer items-center pl-5 p-3 border bg-[#155dfc] text-[#ffffff] rounded-2xl w-full ">
                  
                  Where to?
                </button>
                
                 </div>
              
            </div>


            {/* Right */}

            <div className="relative max-h-10vh justify-self-start ml-6 flex items-baseline-last justify-bottom">

             <img
                src={taxi}
                alt="Taxi"
                className="
                  w-45
                  sm:w-60
                  md:w-[320px]
                  lg:w-105
                  xl:w-70
                  h-auto
                  object-contain
                "
              />
              <img
                  src={driver}
                  alt="Driver"
                  className="
                    w-12
                    sm:w-16
                    md:w-20
                    lg:w-24
                    xl:w-24
                    h-auto
                    object-contain
                  "
                />

              {/* Driver */}


            </div>
            </div>

          </div>

          <div className="m-auto items-center px-3 grid sm:grid-cols-1[auto_auto] text-center">         
            
            <div className="m-auto gap-3 w-2xl items-center mt-0 px-3 flex flex-row justify-between">
              
              <div className="flex flex-col text-[#ffffff]  items-center -space-y-3">               
                <ChevronDown className="w-6 h-6 opacity-100" />
                <ChevronDown className="w-6 h-6 opacity-40" />
              </div>
             
             
              <div className="flex flex-col text-[#ffffff]  items-center -space-y-3">               
                <ChevronDown className="w-6 h-6 opacity-100" />
                <ChevronDown className="w-6 h-6 opacity-40" />
              </div>
            
            </div>
            
              <div className="flex items-center w-2xl p-3 rounded-full bg-[#ffffff]  gap-3 m-auto text-center">
                
             <button   onClick={() => navigate("/booking")}  className="font-[550] text-[#155dfc] w-full cursor-pointer text-xl m-auto">View All Vehicles</button>
            
             </div>
          </div>

        
        </div>

      </div>

    </section>
  );
}