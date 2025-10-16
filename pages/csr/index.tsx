import DemoList from "@/components/DemoList";
import { DemoItem } from "@/interfaces/Demo.interface";
import { fetchMockData } from "@/mocks/mock";
import { useEffect, useState } from "react";


const CSRPage = () => {
    const [items, setItems] = useState<DemoItem[]>([]);
    useEffect(() => {
        // fetch('/api/data')
        fetchMockData().then(data => setItems(data))
    }, []);

    return (
        <div>
            <h1>Client-Side Rendered Page</h1>

            {items.length === 0 ? (
                <p>Loading...</p>
            ) : (
                <DemoList items={items} />
            )}
        </div>
    );
}

export default CSRPage;