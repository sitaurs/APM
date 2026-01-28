'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
    id: string;
    question: string;
    answer: string;
    order: number;
}

interface FaqAccordionProps {
    faqs: FaqItem[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="space-y-3">
            {faqs.map((faq) => (
                <div
                    key={faq.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                    <button
                        onClick={() => toggle(faq.id)}
                        className="w-full p-5 text-left flex items-center justify-between font-medium text-text-main hover:bg-gray-50 transition-colors"
                    >
                        <span>{faq.question}</span>
                        <ChevronDown
                            className={`w-5 h-5 text-text-muted transition-transform duration-200 ${openId === faq.id ? 'rotate-180' : ''
                                }`}
                        />
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-200 ${openId === faq.id ? 'max-h-96' : 'max-h-0'
                            }`}
                    >
                        <div className="px-5 pb-5 text-text-muted border-t border-gray-100 pt-4">
                            {faq.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
