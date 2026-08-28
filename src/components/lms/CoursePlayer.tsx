import React, { useState } from 'react';
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  FileText,
  HelpCircle,
  Download,
  BookOpen,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { LMSCourse, LMSLesson, LanguageCode } from '../../types';
import { useTranslation } from '../../utils/i18n';

interface CoursePlayerProps {
  course: LMSCourse;
  language: LanguageCode;
  onBack: () => void;
  onTakeQuiz?: (courseId: string) => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  language,
  onBack,
  onTakeQuiz
}) => {
  const { t } = useTranslation(language);

  // Active module and lesson selection
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const currentModule = course.modules[activeModuleIndex] || course.modules[0];
  const currentLesson = currentModule?.lessons[activeLessonIndex] || currentModule?.lessons[0];

  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({
    'les-1': true,
    'les-2': false
  });

  const toggleComplete = (lessonId: string) => {
    setCompletedMap(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Courses
        </button>

        <div className="flex items-center gap-2">
          {onTakeQuiz && (
            <button
              onClick={() => onTakeQuiz(course.id)}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Take Chapter Quiz
            </button>
          )}
        </div>
      </div>

      {/* Main Player Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Video / Content Player & Lesson Notes */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player Box */}
          <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-md aspect-video relative flex items-center justify-center border border-slate-800">
            {currentLesson?.contentType === 'video' ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-3 bg-linear-to-tr from-slate-950 via-slate-900 to-indigo-950">
                <div className="w-16 h-16 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <PlayCircle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">{currentLesson.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">Duration: {currentLesson.durationMinutes} Minutes • HD 1080p</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-white text-center">
                <FileText className="w-12 h-12 mx-auto text-purple-400 mb-2" />
                <h3 className="text-lg font-bold">{currentLesson?.title}</h3>
              </div>
            )}
          </div>

          {/* Lesson Details & Actions Bar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase">
                  Module {activeModuleIndex + 1}: {currentModule?.title}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{currentLesson?.title}</h2>
              </div>

              <button
                onClick={() => currentLesson && toggleComplete(currentLesson.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  currentLesson && completedMap[currentLesson.id]
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {currentLesson && completedMap[currentLesson.id] ? 'Lesson Completed' : 'Mark as Complete'}
              </button>
            </div>

            {/* Lecture Notes */}
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">Key Ethiopian Curriculum Concepts:</h4>
              <p>
                In this unit, we explore 2D motion including projectile trajectories under gravity (g = 9.8 m/s²).
                Vectors are resolved into horizontal (vx = v0 · cos θ) and vertical components (vy = v0 · sin θ - gt).
              </p>
              <p>
                Reference: <em>Ethiopian Ministry of Education Grade 11 Physics Student Textbook, Unit 2, Pages 45-68</em>.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Course Syllabus & Module Outline */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">{course.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Curriculum Syllabus & Progress</p>
          </div>

          <div className="space-y-4">
            {course.modules.map((mod, modIdx) => (
              <div key={mod.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Unit {modIdx + 1}: {mod.title}</span>
                  <span className="text-[10px] text-slate-400">{mod.lessons.length} lessons</span>
                </div>

                <div className="space-y-1">
                  {mod.lessons.map((les, lesIdx) => {
                    const isSelected = activeModuleIndex === modIdx && activeLessonIndex === lesIdx;
                    const isCompleted = completedMap[les.id];

                    return (
                      <button
                        key={les.id}
                        onClick={() => {
                          setActiveModuleIndex(modIdx);
                          setActiveLessonIndex(lesIdx);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <PlayCircle className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`} />
                          <span className="truncate max-w-[180px]">{les.title}</span>
                        </div>
                        {isCompleted && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
