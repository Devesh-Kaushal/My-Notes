import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export const SlashCommandList = forwardRef((props: any, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index) => {
        const item = props.items[index];
        if (item) {
            item.command({ editor: props.editor, range: props.range });
        }
    };

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => {
        setSelectedIndex(0);
    }, [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }

            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }

            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }

            return false;
        },
    }));

    if (props.items.length === 0) {
        return null;
    }

    return (
        <div className="bg-secondary text-text-primary rounded-lg shadow-xl border border-border overflow-hidden min-w-[200px] py-1 text-sm">
            {props.items.map((item, index) => (
                <button
                    className={`w-full text-left px-3 py-1.5 flex items-center gap-2 transition-colors ${index === selectedIndex ? 'bg-hover text-text-primary' : 'text-text-secondary hover:bg-hover hover:text-text-primary'
                        }`}
                    key={index}
                    onClick={() => selectItem(index)}
                >
                    <div className="w-5 h-5 flex items-center justify-center bg-hover border border-border rounded text-[10px] font-bold">
                        {item.icon}
                    </div>
                    <span>{item.title}</span>
                </button>
            ))}
        </div>
    );
});
