import { useParams } from "react-router-dom";

function InfoPage() {
    const {id} = useParams();
    return <div>Info ID: {id}</div>;
};

export default InfoPage;