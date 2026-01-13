import { useNavigate } from "react-router-dom"
function Btn(elem){
    const navigate = useNavigate();
    return (
        <button
                className={`px-5 p-1  w-40  active:scale-95 font-bold text-md rounded-lg mx-5 ${elem.theme?"bg-btncolorD/70 hover:bg-btncolorD text-white hover:border-logo hover:border":"bg-gray-100 hover:bg-gray-200 hover:border-logo2 hover:border "} hidden md:block lg:block`}
                onClick={() => navigate("/auth")}
                >
                Signin / Login
        </button>   
    )
}

export default Btn;