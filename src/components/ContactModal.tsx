import React, { useState } from "react";
import { X, Send, Bot, Mail, CheckCircle2, AlertCircle, Building, Phone, User, MessageSquare } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: "general" | "request_agent" | "enterprise";
  defaultAgentRole?: string;
}

export function ContactModal({
  isOpen,
  onClose,
  defaultCategory = "general",
  defaultAgentRole = "",
}: ContactModalProps) {
  const { t } = useTranslation();
  const [category, setCategory] = useState<"general" | "request_agent" | "enterprise">(defaultCategory);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [agentRole, setAgentRole] = useState(defaultAgentRole);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const isAgent = category === "request_agent";
      const payload = {
        name,
        email,
        phone,
        company,
        category,
        requestedAgentRole: isAgent ? (agentRole || "Nhân viên AI theo yêu cầu") : undefined,
        subject: subject || (isAgent ? `Yêu cầu thiết kế Nhân viên AI: ${agentRole}` : "Liên hệ tư vấn giải pháp Skyer"),
        message,
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setStatusMsg(data.message || "Gửi yêu cầu thành công! Chúng tôi đã gửi email xác nhận đến hộp thư của bạn.");
      } else {
        setStatus("error");
        setStatusMsg(data.message || "Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại.");
      }
    } catch (err: any) {
      setStatus("error");
      setStatusMsg("Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${category === "request_agent" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-sky-500/10 text-sky-400 border border-sky-500/20"}`}>
              {category === "request_agent" ? <Bot size={20} /> : <Mail size={20} />}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {category === "request_agent" ? "Yêu cầu cấu hình Nhân viên AI mới" : "Liên hệ Tư vấn & Giải pháp"}
              </h3>
              <p className="text-xs text-slate-400">
                {category === "request_agent" ? "Bespoke Autonomous AI Workforce Specification" : "Đội ngũ chuyên gia phản hồi trong 24 giờ"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form or Success State */}
        <div className="p-6 overflow-y-auto space-y-5">
          {status === "success" ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Tiếp nhận thành công!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  {statusMsg}
                </p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400">
                Một email xác nhận chi tiết đã được gửi tới <strong>{email}</strong>. Chuyên viên Skyer sẽ liên hệ sớm nhất.
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all"
              >
                Đóng cửa sổ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category selector chips */}
              <div className="flex gap-2 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setCategory("general")}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${category === "general" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Tư vấn chung
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("request_agent")}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${category === "request_agent" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Đặt hàng AI Agent
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("enterprise")}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${category === "enterprise" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                >
                  On-Premise Enterprise
                </button>
              </div>

              {/* Name & Email fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                    <User size={12} className="text-slate-400" />
                    Họ và tên <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                    <Mail size={12} className="text-slate-400" />
                    Email liên hệ <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              {/* Phone & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                    <Phone size={12} className="text-slate-400" />
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                    <Building size={12} className="text-slate-400" />
                    Tên Doanh nghiệp / Tổ chức
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Công ty CP Công Nghệ..."
                    className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              {/* Conditional Agent Role Field */}
              {category === "request_agent" && (
                <div className="space-y-1 p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl">
                  <label className="text-[11px] font-medium text-purple-300 flex items-center gap-1">
                    <Bot size={12} className="text-purple-400" />
                    Vị trí / Vai trò Nhân viên AI mong muốn <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required={category === "request_agent"}
                    value={agentRole}
                    onChange={(e) => setAgentRole(e.target.value)}
                    placeholder="VD: Chuyên viên Điều Phối Bán Hàng, Pháp chế & Hợp đồng, QA Tự động..."
                    className="w-full px-3 py-2 bg-slate-950/70 border border-purple-500/30 rounded-xl text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
              )}

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300">
                  Tiêu đề yêu cầu
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={category === "request_agent" ? "Đào tạo nhân viên AI cho phòng kinh doanh" : "Yêu cầu tư vấn triển khai"}
                  className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                  <MessageSquare size={12} className="text-slate-400" />
                  Mô tả chi tiết tác vụ & quy trình mong muốn <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={category === "request_agent"
                    ? "Mô tả quy trình cụ thể: nguồn dữ liệu đầu vào (ERP/CRM/Email), các tác vụ nhân viên AI cần làm tự động, phê duyệt của con người và kết quả cần xuất ra..."
                    : "Chia sẻ nhu cầu hoặc vướng mắc nghiệp vụ hiện tại của quý công ty..."}
                  className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors resize-none"
                />
              </div>

              {status === "error" && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-xs">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{statusMsg}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
                    category === "request_agent"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/25"
                      : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 shadow-sky-600/25"
                  }`}
                >
                  {loading ? (
                    <span className="inline-block animate-spin mr-1">↻</span>
                  ) : (
                    <Send size={13} />
                  )}
                  <span>{category === "request_agent" ? "Gửi Yêu Cầu Nhân Viên AI" : "Gửi Thông Tin Liên Hệ"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
