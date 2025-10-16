import React from 'react';
import DemoCard from './DemoCard';
import { DemoItem } from '@/interfaces/Demo.interface';

const DemoList: React.FC<{items: DemoItem[]}> = ({ items }) => {
    return (
        <div className="flex flex-wrap gap-4">
            {items.map(item => (
                <DemoCard key={item.id} item={item} />
            ))}
        </div>
    );
}

export default DemoList;