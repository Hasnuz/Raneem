"use client";
export function CookiePreferences(){return <div className="container max-w-4xl -mt-10 pb-20"><button className="rounded-full bg-navy px-5 py-3 text-sm font-bold text-white" onClick={()=>{localStorage.removeItem("raneem_consent");location.reload()}}>Review privacy choices</button></div>}
