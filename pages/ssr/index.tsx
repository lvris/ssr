import DemoList from "@/components/DemoList";
import { DemoItem } from "@/interfaces/Demo.interface";
import { fetchMockData } from "@/mocks/mock";

export async function getServerSideProps() {
    const items = await fetchMockData;
    return { props: { items } };
}

const SSRPage = ({ items }: { items: DemoItem[] }) => {
    return (
        <div>
            <h1>Server-Side Rendered Page</h1>
            <DemoList items={items} />
        </div>
    );
}

export default SSRPage;