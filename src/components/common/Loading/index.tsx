export const Loading = ({message ="Loading..."}:{message ?:string} )=>{
   return(
    <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-primary rounded-full animate-spin mb-4"></div>
          <div className="text-xl font-medium text-light/80">{message}</div>
        </div>
      </div>
   )
}