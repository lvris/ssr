import Footer from "@/components/Footer";
import Header from "@/components/Header";
import List from "@/components/List";
import { DemoItem } from "@/interfaces/Demo.interface";
import { fetchMockData } from "@/mocks/mock";

export async function getServerSideProps() {
    const items = await fetchMockData();
    return { props: { items } };
}

const SSRPage = ({ items }: { items: DemoItem[] }) => {
    return (
       <div className="min-h-screen bg-base-200">
            <Header name="SSR" />
            <List items={items} renderMode="SSR" />
            <Footer />
        </div>
    );
}

export default SSRPage;