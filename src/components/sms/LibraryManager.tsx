import React, { useState } from 'react';
import { Library, Plus, Search, BookOpen, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { LibraryBook, LanguageCode } from '../../types';
import { useTranslation } from '../../utils/i18n';

interface LibraryManagerProps {
  books: LibraryBook[];
  language: LanguageCode;
  onCheckoutBook?: (bookId: string) => void;
  onReturnBook?: (bookId: string) => void;
}

export const LibraryManager: React.FC<LibraryManagerProps> = ({
  books,
  language,
  onCheckoutBook,
  onReturnBook
}) => {
  const { t } = useTranslation(language);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory ? b.category === selectedCategory : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('library')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Textbooks, national curriculum references, student loan circulation & shelf management
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search titles, authors, ISBN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:bg-white"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="Physics">Physics</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="Literature">Literature</option>
        </select>
      </div>

      {/* Book Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map(book => (
          <div key={book.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-blue-300 transition-all">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {book.category}
                </span>
                <span className="font-mono text-[11px] text-slate-400">Shelf: {book.shelfLocation}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-1">{book.title}</h3>
              <p className="text-xs text-slate-500">By {book.author}</p>
              <p className="text-[10px] text-slate-400 font-mono">ISBN: {book.isbn}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className={`font-bold ${book.availableCopies > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {book.availableCopies} of {book.totalCopies} Available
              </span>
              <button
                onClick={() => onCheckoutBook?.(book.id)}
                disabled={book.availableCopies === 0}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Issue / Loan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
