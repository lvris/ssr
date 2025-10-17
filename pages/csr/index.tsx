import Footer from "@/components/Footer";
import Header from "@/components/Header";
import List from "@/components/List";
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
        <div className="min-h-screen bg-base-200">
            {/* <Header name="CSR" /> */}
            <List items={items} />
            <Footer />
        </div>
    );
}

export default CSRPage;