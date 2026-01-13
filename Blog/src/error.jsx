import Err from './assets/error.jpg'
import { useNavigate } from "react-router-dom";


function Error() {
    const navigate = useNavigate(); 
  return (
    <div className='w-full h-screen bg-cover bg-center flex-col flex justify-center items-center' style={{backgroundImage: `url(${Err})`}}>
      <div className='flex flex-col justify-center'>
          <div className='flex flex-row justify-center  animate-flicker'>
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 48 48">
              <path 
                fill={"#000"} 
                d="M37,42H11c-2.761,0-5-2.239-5-5V11c0-2.761,2.239-5,5-5h26c2.761,0,5,2.239,5,5v26 C42,39.761,39.761,42,37,42z"
              />
              <path 
                fill="#fff" 
                d="M33.5,22h-1c-0.828,0-1.5-0.672-1.5-1.5V20c0-3.866-3.134-7-7-7h-4c-3.866,0-7,3.134-7,7v8 c0,3.866,3.134,7,7,7h8c3.866,0,7-3.134,7-7v-4.5C35,22.672,34.328,22,33.5,22z M20,19h5c0.553,0,1,0.448,1,1s-0.447,1-1,1h-5 c-0.553,0-1-0.448-1-1S19.447,19,20,19z M28,29h-8c-0.553,0-1-0.448-1-1s0.447-1,1-1h8c0.553,0,1,0.448,1,1S28.553,29,28,29z"
              />
            </svg>
            <div className=" font-bold text-4xl pt-1 h-full items-center flex text-white text-shadow-lg"> Blog<span className={`text-white m-1 bg-black px-2 rounded-lg`}>Hub</span></div>
          </div>
          <p className='text-black text-shadow-2xs text-9xl font-extrabold flex justify-center'>404 Error</p>
          <p className='text-black/70 text-shadow-2xs text-5xl font-bold flex justify-center mb-7 '>“Wrong angle. This page doesn’t exist.”</p>
          <p className='hover:text-white/60  text-white/50 text-shadow-lg text-4xl flex justify-center p-5 font-bold animate-flicker'>Fall back to a safe zone.</p>
          <div className='flex justify-center flex-col'>
            <p className='text-white font-light hover:font-bold text-sm flex justify-center'>Press Enter to return home</p>
            <div className=' flex justify-center'><button className='bg-white/40  hover:bg-black/60 text-black/50 shadow-lg hover:text-amber-300 active:scale-95 border-white/30 border rounded-lg w-50 p-2 text-xl font-bold flex justify-center' onClick={()=>{navigate('/')}}>Home!</button></div>
          </div>
      </div>
    </div>
  );
}

export default Error;
