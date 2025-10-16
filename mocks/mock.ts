import { DemoItem } from '@/interfaces/Demo.interface';
import mockData from './mock_data.json';

export async function fetchMockData(delay: number = 300): Promise<DemoItem[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockData);
        }, delay);
    });
}
