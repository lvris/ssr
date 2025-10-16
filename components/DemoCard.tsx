import { DemoItem } from "@/interfaces/Demo.interface";

const DemoCard: React.FC<{ item: DemoItem }> = ({ item }) => {
    return (
        <div className="demo-card">
            <h2>{item.name}</h2>
            <p>Price: ${item.price}</p>
        </div>
    );
}

export default DemoCard;