import React from 'react';
import { Award, Download, CheckCircle2, QrCode, Sparkles } from 'lucide-react';
import { LMSCertificate, School, LanguageCode, CalendarType } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate } from '../../utils/ethiopianCalendar';
import { generateCourseCertificatePDF } from '../../utils/pdfGenerator';

interface CertificatesViewerProps {
  certificates: LMSCertificate[];
  school: School;
  language: LanguageCode;
  calendarType: CalendarType;
}

export const CertificatesViewer: React.FC<CertificatesViewerProps> = ({
  certificates,
  school,
  language,
  calendarType
}) => {
  const { t } = useTranslation(language);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('certificates')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified digital course completion awards with cryptographic QR verification
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map(cert => (
          <div key={cert.id} className="bg-linear-to-br from-amber-500/10 via-white to-purple-500/10 rounded-2xl border border-amber-300 shadow-md p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <Award className="w-7 h-7" />
              </div>
              <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full">
                {cert.certificateNumber}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">Certificate of Academic Achievement</p>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{cert.courseTitle}</h3>
              <p className="text-xs text-slate-600 mt-1">
                Conferred upon: <strong className="text-slate-900">{cert.studentName}</strong> with Final Score: <strong className="text-emerald-700">{cert.finalScore}%</strong>
              </p>
            </div>

            <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-slate-500">
              <span>Issued: {formatEduDate(cert.issuedDate, calendarType, language)}</span>
              <button
                onClick={() => generateCourseCertificatePDF(cert, school)}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download Verified PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
