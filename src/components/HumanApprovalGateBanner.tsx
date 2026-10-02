import React, { useState } from 'react';
import { Sparkles, Check, MessageSquare, CheckCircle2 } from 'lucide-react';

export const HumanApprovalGateBanner: React.FC<{
  projectName?: string;
  onApprove?: () => void;
  onRequestChanges?: () => void;
}> = ({ projectName, onApprove, onRequestChanges }) => {
  const [approved, setApproved] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleApproveClick = () => {
    setApproved(true);
    if (onApprove) onApprove();
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setShowFeedbackModal(false);
      setFeedbackText('');
      if (onRequestChanges) onRequestChanges();
    }, 2000);
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-amber-950/30 border-2 border-orange-500/40 shadow-xl relative overflow-hidden space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
        <div className="flex items-start gap-4 max-w-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30 p-2.5">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-bold font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>
                Human Approval Gate • بوابة الاعتماد البشري
              </span>
            </div>
            <h3 className="font-extrabold text-xl text-white font-display">
              🎉 Your First Design Preview is Ready! / <span className="text-orange-400">تصميم تطبيقك جاهز للمعاينة</span>
            </h3>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
              Explore the live interactive preview below. If you love how it looks and works, approve it to let the AI team continue building! If you want changes, just tell us.
            </p>
            <p className="text-xs text-slate-400 font-sans">
              تصفح الشاشة التفاعلية أدناه بحرية. إذا أعجبك التصميم والمظهر، اضغط على زر الاعتماد ليواصل فريق الذكاء الاصطناعي البناء، أو شاركنا ملاحظاتك لتعديلها فوراً.
            </p>
          </div>
        </div>

        {/* Clear Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
          {!approved ? (
            <button
              onClick={handleApproveClick}
              className="flex-1 lg:flex-initial px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs md:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>✨ Looks Great, Continue Building!</span>
              <span className="text-[10px] text-orange-200 font-normal">/ اعتمد واستمر</span>
            </button>
          ) : (
            <div className="px-5 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>✓ Design Approved! Proceeding with Build</span>
            </div>
          )}

          <button
            onClick={() => setShowFeedbackModal(true)}
            className="flex-1 lg:flex-initial px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs md:text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700 active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-orange-400" />
            <span>💬 Request Changes</span>
            <span className="text-[10px] text-slate-400 font-normal">/ طلب تعديلات</span>
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold text-white text-base font-display">Provide Build Feedback • الملاحظات</h3>
              </div>
              <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {feedbackSent ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="font-bold text-white text-sm">Notes Delivered to AI Agents!</div>
                <p className="text-slate-300">
                  AI agents are recalculating requirements and adapting the build plan.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-slate-300">
                  What adjustments would you like the Factory team to execute on the permissions matrix or layout?
                </p>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g. Add 2-factor authentication for Legal Auditors, and adjust the upload button color to contrast better..."
                  rows={4}
                  className="w-full bg-slate-950 text-white border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-orange-500 font-sans"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendFeedback}
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg"
                  >
                    Send to AI Factory 🚀
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
