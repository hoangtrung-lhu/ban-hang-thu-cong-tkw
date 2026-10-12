import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, Check, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { name: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!email || !email.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Mật khẩu phải có độ dài tối thiểu 6 ký tự.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMessage('Vui lòng nhập họ và tên của bạn.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Mật khẩu xác nhận không khớp.');
        return;
      }
    }

    setIsLoading(true);

    // Simulate authentic API roundtrip
    setTimeout(() => {
      setIsLoading(false);
      const authenticatedUser = {
        name: mode === 'register' ? name : (name || email.split('@')[0]),
        email: email,
      };
      onAuthSuccess(authenticatedUser);
      onClose();
    }, 700);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-scale"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white border border-[#e6e4df] rounded-xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Subtle decorative brand banner top */}
        <div className="bg-[#121417] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold tracking-tight text-base sm:text-lg">
              NOVA <span className="font-light text-[#c4823f]">ACCOUNT</span>
            </span>
            <span className="text-gray-400 text-xs hidden sm:inline">· Hội viên độc quyền</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng cửa sổ đăng nhập"
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 bg-[#fbfaf8]">
          {/* Segmented Mode Switcher */}
          <div className="flex bg-[#f0ede6] p-1 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#121417] shadow-xs'
                  : 'text-[#6b7280] hover:text-[#121417]'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#121417] shadow-xs'
                  : 'text-[#6b7280] hover:text-[#121417]'
              }`}
            >
              Đăng Ký Thành Viên
            </button>
          </div>

          {/* Title description */}
          <div className="mb-5 text-center">
            <h3 id="auth-modal-title" className="font-display text-xl font-bold text-[#121417]">
              {mode === 'login' ? 'Chào Mừng Trở Lại' : 'Tham Gia Cộng Đồng NOVA'}
            </h3>
            <p className="text-xs text-[#6b7280] mt-1">
              {mode === 'login'
                ? 'Đăng nhập để theo dõi đơn hàng và lưu danh sách yêu thích'
                : 'Nhận ưu đãi 10% cho đơn hàng đầu tiên và quyền truy cập sớm'}
            </p>
          </div>

          {/* Error notice if present */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-[#121417] mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#e6e4df] rounded-md focus:bg-white placeholder:text-[#9ca3af]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#121417] mb-1">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#e6e4df] rounded-md focus:bg-white placeholder:text-[#9ca3af]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-[#121417]">
                  Mật khẩu
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Liên kết đặt lại mật khẩu đã được mô phỏng gửi về email của bạn.')}
                    className="text-[11px] text-[#c4823f] hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-[#e6e4df] rounded-md focus:bg-white placeholder:text-[#9ca3af]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#121417]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-[#121417] mb-1">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#e6e4df] rounded-md focus:bg-white placeholder:text-[#9ca3af]"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center text-xs text-[#6b7280]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#d1d5db] text-[#121417] focus:ring-[#c4823f]"
                  />
                  <span>Ghi nhớ đăng nhập trên thiết bị này</span>
                </label>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-tactile py-3 bg-[#121417] text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-[#262930] shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Đăng Nhập Ngay' : 'Hoàn Tất Đăng Ký'}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Demo Notice */}
          <div className="mt-5 pt-4 border-t border-[#e6e4df] text-center">
            <p className="text-[11px] text-[#9ca3af]">
              Giao diện bảo mật mô phỏng tiêu chuẩn NOVA Storefront. Thông tin của bạn được lưu an toàn tại phiên làm việc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
