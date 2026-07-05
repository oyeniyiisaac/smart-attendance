import React from 'react';

export default function FormSection({ title, children }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
            <div className="bg-[#e2e8f0] px-6 py-3 border-b border-gray-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {title}
                </h3>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}
