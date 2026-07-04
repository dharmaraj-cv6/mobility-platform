
import {  
 MapPinIcon,
  User, 
  HeartPlus,
  UserCheck,
 
} from "lucide-react";

import { Link } from "react-router-dom";




export default function Header() { 

  return (
    
    <header className="sticky top-0 z-50 w-full  bg-white/90 backdrop-blur-md">
     

      <div className="mx-auto grid grid-cols-[20%_60%_20%] mb-1 items-center px-4 sm:px-6 lg:px-8">

        {/* Logo */}

        <div className="flex items-center gap-3">

          <Link to="/" className="items-center justify-center flex gap-4 px-2 py-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xl">
            G
          </div>

          <div className=" sm:block ">
            <h1 className="text-lg font-bold text-slate-800">
              GoSaGo
            </h1>

            <p className="text-xs text-slate-500">
              Digital Taxi Stand
            </p>
          </div>
          </Link>

        </div>

 

        <div className="flex p-2xl m-2 items-center">

          <div className="w-full border border-[#eeeeee] rounded-xs ">
                  <div className="flex flex-wrap justify-center items-center gap-6">

                    <div className="flex  items-center justify-between w-full gap-12 ">

                        <div className="flex place-items-center justify-end items-center gap-6">


                          <div className="flex ml-2 justify-end  items-center gap-2 px-2 py-2 rounded-xl ">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-[#eeeeee] border text-[#0a0dbb] font-bold text-xl">
                              <MapPinIcon size={18} />
                            </div>

                            <div className=" sm:block">
                              <h1 className="text-md px-2 rounded font-[550] bg-[#155dfc] text-[#ffffff]">
                              Inter-City Rider Zone 
                              </h1>

                              <p className="text-xs m-0 text-slate-500">
                              Coimabatore, Tamilnadu
                              </p>
                            </div>
                          </div>

                        
                        </div>


                        <div className="flex justify-end items-center pr-3">
                           <nav className="items-center justify-center flex gap-1 list-none">

                      <li >
                        <Link to="/" className="shadow-xs items-center rounded-xl border border-[#eeeeee] justify-center flex gap-4 ">
                      
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xl">
                                  z1
                                </div>

                        </Link>
                      </li>
                      <li >
                        <Link to="/" className="shadow-xs items-center rounded-xl border border-[#eeeeee] justify-center flex gap-4 ">
                      
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xl">
                                  z2
                                </div>

                        </Link>
                      </li>
                      <li >
                        <Link to="/" className="shadow-xs items-center rounded-xl border border-[#eeeeee] justify-center flex gap-4 ">
                      
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xl">
                                  z3
                                </div>

                        </Link>
                      </li>
                      <li >
                        <Link to="/" className="shadow-xs items-center rounded-xl border border-[#eeeeee] justify-center flex gap-4 ">
                      
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xl">
                                  z4
                                </div>

                        </Link>
                      </li>
                      <li >
                        <Link to="/" className="shadow-xs items-center rounded-xl border border-[#eeeeee] justify-center flex gap-4 ">
                      
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xl">
                                  z5
                                </div>

                        </Link>
                      </li>
                      <li >
                        <Link to="/" className="shadow-xs items-center rounded-xl border border-[#eeeeee] justify-center flex gap-4">
                      
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xl">
                                  z6
                                </div>

                        </Link>
                      </li>
                      
                    </nav>

                          </div>        
                    </div>
                    

                  </div>

                   

                </div>

             

        </div>

        {/* Right */}

        <div className=" md:flex items-center gap-1">
          

           <div className=" flex items-center gap-1 ">   

            <button className="rounded-md text-[#333333] flex items-center">
                <div className="flex items-center gap-2">
                  <HeartPlus size={18} className="m-auto"/>   
                   <h3 className="text-xs mr-5">
                    Saved                  
                  </h3>     
                  </div>    
                </button>  
                
            <button className="rounded-md text-[#333333] flex items-center">
                <div className="flex items-center gap-2">
                  <UserCheck size={18} className="m-auto"/>   
                   <h3 className="text-xs mr-5">
                    TourBag                  
                  </h3>     
                  </div>    
             </button> 

             <button className=" flex border bg-[#155dfc] text-[#ffffff] rounded-md pl-2 pr-3 py-1 items-center gap-1">
             <span className="rounded-full h-6 w-6 bg-[#4d85da] text-[#ffffff]  flex items-center ">
                <User size={18} className="m-auto" />          
                </span>

            
                
                <div className="flex items-center gap-1">
                  <h3 className="text-xs">
                    Me                  
                  </h3>                   
                   
                   </div>                
                 </button>

           </div>       

        </div>
      </div>

    </header>
  );
}