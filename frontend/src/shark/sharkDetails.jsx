function SharkDetail(){
    const [detail, setDetail] = useState([]);
        const [error, setError] = useState("");
    
        const navigate = useNavigate();
        const { id } = useParams();
    
        useEffect(() => {
            const token = localStorage.getItem("jwt_token");
    
            if (!token || token.trim() === "") {
                localStorage.removeItem("jwt_token");
                navigate("/");
                return;
            }
    
            const getDetail = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/shark/shark/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
    
                    setDetail(response.data);
                } catch (error) {
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        localStorage.removeItem("jwt_token");
                        navigate("/");
                        return;
                    }
    
                    setError("Failed to load details.");
                }
            };
    
            getDetail();
        }, [navigate, id]);
    return(
        <div>
<h1>Hey</h1>
        </div>
    )
}

export default SharkDetail