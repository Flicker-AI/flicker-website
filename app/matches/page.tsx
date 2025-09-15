"use client";

import TogglePill from "@/components/home/TogglePill";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type MotionStyle,
  type Target,
} from "framer-motion";
import { Heart, RotateCcw, X } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";

/** ------------------------------------------------------------------
 * Tinder-style Business Matcher (smooth stack)
 * - ปัดโค้ง (ยกขึ้น + หมุนเล็กน้อย) และบินออกแบบโค้ง
 * - การ์ดซ้อนแบบ peek เห็นขอบบนของการ์ดด้านหลัง
 * - การ์ดใบถัดไปเลื่อนขึ้นอย่าง smooth ด้วย spring (ไม่เด้ง)
 * - Overlay ติดสีเขียว/แดง ระหว่างลาก
 * - Bottom sheet ครึ่งล่าง แสดงรายละเอียด
 * - Dots + ปุ่มอยู่ใน container เดียวกัน (absolute ด้านล่าง)
 * ------------------------------------------------------------------ */

const SAMPLE_COMPANIES = [
  {
    id: "1",
    name: "Clothy ltc.",
    industry: "บริษัท OEM เสื้อผ้า",
    location: "นนทบุรี, TH",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1400&auto=format&fit=crop",
    short: "บริษัท OEM เสื้อผ้าแถวนนทบุรี!",
    details:
      "รับผลิตเสื้อยืด ยูนิฟอร์ม และสปอร์ตแวร์ บริการออกแบบแพทเทิร์น งานปัก/สกรีน พร้อม QC เต็มกระบวนการ",
    tags: ["OEM", "สิ่งทอ", "โรงงาน"],
    metrics: { employees: 120, revenue: "฿85M", founded: 2016 },
  },
  {
    id: "2",
    name: "VoltPort",
    industry: "EV Infrastructure",
    location: "Malmö, SE",
    image:
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1400&auto=format&fit=crop",
    short: "โซลูชันชาร์จรถไฟฟ้าสำหรับฟลีทขนส่ง",
    details: "ซอฟต์แวร์จัดตารางชาร์จ ลด peak demand พร้อมสถานีชาร์จ OCPP",
    tags: ["EV", "Energy"],
    metrics: { employees: 31, revenue: "$3.3M", founded: 2019 },
  },
  {
    id: "3",
    name: "NimbusGrid",
    industry: "Cloud FinOps",
    location: "Stockholm, SE",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop",
    short: "ลดค่าใช้จ่ายคลาวด์เฉลี่ย 35%",
    details: "ปรับขนาดอินสแตนซ์/Spot อัตโนมัติ รองรับ AWS/Azure/GCP",
    tags: ["FinOps", "AI"],
    metrics: { employees: 12, revenue: "$850k", founded: 2023 },
  },
];

const MAX_STACK = 3;
const STACK_GAP = 12; // ระยะเลื่อนลงของการ์ดชั้นล่าง (มิติ)
const PEEK_TOP = 18; // การโผล่ขอบบนของการ์ดชั้นหลัง
const BASE_SCALE = 0.94; // ขนาดการ์ดใบบนสุด (ให้เล็กลง)
const SCALE_STEP = 0.03; // ส่วนต่าง scale ของแต่ละชั้น
const CONTAINER_HEIGHT = "h-[600px]";
const SWIPE_THRESHOLD = 120;

export default function BusinessMatcher() {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [disliked, setDisliked] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [showDetailsFor, setShowDetailsFor] = useState<string | null>(null);

  const remaining = useMemo(() => SAMPLE_COMPANIES.slice(index), [index]);
  const total = SAMPLE_COMPANIES.length;

  const onSwipe = (dir: "left" | "right", id: string) => {
    if (dir === "right") setLiked((p) => [...p, id]);
    else setDisliked((p) => [...p, id]);
    setHistory((h) => [...h, id]);
    setIndex((i) => Math.min(i + 1, total));
  };

  const rewind = () => {
    if (history.length === 0 || index === 0) return;
    const lastId = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setLiked((ls) => ls.filter((id) => id !== lastId));
    setDisliked((ds) => ds.filter((id) => id !== lastId));
    setIndex((i) => Math.max(0, i - 1));
  };

  const reset = () => {
    setIndex(0);
    setLiked([]);
    setDisliked([]);
    setHistory([]);
    setShowDetailsFor(null);
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm mx-auto">
        {/* Container การ์ด + Dots/Buttons */}
        <div
          className={`relative ${CONTAINER_HEIGHT} select-none overflow-visible`}
        >
          <AnimatePresence initial={false}>
            {remaining.slice(0, MAX_STACK).map((c, i) => {
              const isTop = i === 0;
              const z = MAX_STACK - i;
              const scale = BASE_SCALE - i * SCALE_STEP;
              const translateY = i * STACK_GAP;
              const peekTop = -i * PEEK_TOP;

              // แยกเป็น style กับ animate เพื่อลดปัญหา type และให้ลื่น
              const wrapperStyle: MotionStyle = {
                position: "absolute",
                top: peekTop,
                zIndex: z,
                left: 0,
                right: 0,
              };
              const wrapperAnimate: Target = {
                scale,
                y: translateY,
              };

              return (
                <SwipeCard
                  key={c.id}
                  company={c}
                  isTop={isTop}
                  wrapperStyle={wrapperStyle}
                  wrapperAnimate={wrapperAnimate}
                  onSwipe={onSwipe}
                  onDetails={() => setShowDetailsFor(c.id)}
                />
              );
            })}
          </AnimatePresence>

          {/* เมื่อหมดการ์ดแล้ว แสดงสถานะ */}
          {remaining.length === 0 && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">หมดแล้ว</p>
                <p className="text-slate-600 mb-4">
                  ถูกใจ {liked.length} · ไม่ใช่ {disliked.length}
                </p>
                <button
                  onClick={reset}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90"
                >
                  เริ่มใหม่
                </button>
              </div>
            </div>
          )}

          {/* Dots + Action Buttons: ย้ายเข้ามาใน container และปัก absolute ด้านล่าง */}
          {remaining.length > 0 && (
            <div
              className="absolute inset-x-0 z-10 pointer-events-none"
              style={{
                bottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)",
              }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="pointer-events-auto">
                  <Dots total={total} index={index} />
                </div>
                <div className="pointer-events-auto flex items-center justify-center gap-6">
                  <CircleButton
                    ariaLabel="Nope"
                    onClick={() => forceSwipe("left")}
                  >
                    <X className="size-7 text-rose-600" />
                  </CircleButton>
                  <CircleButton ariaLabel="Rewind" onClick={rewind}>
                    <RotateCcw className="size-7 text-amber-500" />
                  </CircleButton>
                  <CircleButton
                    ariaLabel="Like"
                    onClick={() => forceSwipe("right")}
                  >
                    <Heart className="size-7 text-emerald-600" />
                  </CircleButton>
                </div>
              </div>
            </div>
          )}
        </div>
        <TogglePill />
      </div>

      {/* Bottom sheet รายละเอียด */}
      <BottomSheet
        company={SAMPLE_COMPANIES.find((c) => c.id === showDetailsFor) || null}
        onClose={() => setShowDetailsFor(null)}
      />
    </div>
  );

  function forceSwipe(dir: "left" | "right") {
    const top = remaining[0];
    if (!top) return;
    const event = new CustomEvent<{ dir: "left" | "right"; id: string }>(
      "force-swipe",
      { detail: { dir, id: top.id } }
    );
    window.dispatchEvent(event);
  }
}

/* ----------------------------- SwipeCard ----------------------------- */
function SwipeCard({
  company,
  isTop,
  wrapperStyle,
  wrapperAnimate,
  onSwipe,
  onDetails,
}: {
  company: (typeof SAMPLE_COMPANIES)[number];
  isTop: boolean;
  wrapperStyle: MotionStyle; // style: top/zIndex/position...
  wrapperAnimate: Target; // animate: scale/y
  onSwipe: (dir: "left" | "right", id: string) => void;
  onDetails: () => void;
}) {
  const x = useMotionValue(0);

  // เส้นโค้งตอนลาก: y โค้งขึ้นตามระยะ x + หมุนเล็กน้อย
  const y = useTransform(x, (v) => -Math.pow(Math.abs(v), 0.85) * 0.18);
  const rotate = useTransform(x, (v) => v / 25);

  // Opacity ของป้าย + พื้นหลัง tint
  const likeOpacity = useTransform(x, (v) => Math.max(0, Math.min(1, v / 120)));
  const nopeOpacity = useTransform(x, (v) =>
    Math.max(0, Math.min(1, -v / 120))
  );
  const likeBgOpacity = useTransform(x, (v) =>
    Math.max(0, Math.min(0.28, (v / 150) * 0.28))
  );
  const nopeBgOpacity = useTransform(x, (v) =>
    Math.max(0, Math.min(0.28, (-v / 150) * 0.28))
  );

  const cardRef = useRef<HTMLDivElement | null>(null);

  // ฟัง event เฉพาะใบบนสุด + id ตรงเท่านั้น (กันกดแล้วบินทุกใบ)
  React.useEffect(() => {
    const handler = (e: Event) => {
      if (!isTop) return;
      const ce = e as CustomEvent<{ dir: "left" | "right"; id: string }>;
      const dir = ce.detail?.dir;
      const targetId = ce.detail?.id;
      if (dir && targetId === company.id) {
        animateOut(dir);
      }
    };
    window.addEventListener("force-swipe", handler as EventListener);
    return () =>
      window.removeEventListener("force-swipe", handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTop, company.id]);

  const animateOut = (dir: "left" | "right") => {
    const element = cardRef.current;
    if (!element) return;
    const width = element.clientWidth || 360;
    const toX = dir === "right" ? width * 1.4 : -width * 1.4;
    element.style.transition = "transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)";
    // บินออกแบบ “โค้ง”: ยกขึ้น -80px พร้อมหมุน
    element.style.transform = `translate(${toX}px, -80px) rotate(${
      dir === "right" ? 14 : -14
    }deg)`;
    window.setTimeout(() => {
      element.style.transition = "";
      element.style.transform = "";
      onSwipe(dir, company.id);
    }, 390);
  };

  return (
    <motion.div
      className="absolute left-0 right-0 mx-auto w-[92%] h-[500px]"
      initial={false}
      style={wrapperStyle}
      animate={wrapperAnimate}
      transition={{ type: "spring", stiffness: 420, damping: 36 }}
    >
      <motion.div
        ref={cardRef}
        drag={isTop ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, y, rotate }}
        onDragEnd={(_, info) => {
          const offset = info.offset.x;
          const velocity = info.velocity.x;
          const dir = offset > 0 ? "right" : "left";
          const passed =
            Math.abs(offset) > SWIPE_THRESHOLD || Math.abs(velocity) > 800;
          if (passed) animateOut(dir);
        }}
        className={`h-full w-full rounded-[28px] bg-white ring-1 ring-slate-200 overflow-hidden relative ${
          isTop ? "shadow-xl" : "shadow-md"
        }`}
      >
        {/* Photo */}
        <div className="h-[66%] w-full">
          <img
            src={company.image}
            alt={company.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info Panel */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="rounded-[28px] bg-[#0B1020] text-white p-4 md:p-5 shadow-lg border border-white/5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-[#FFD428] leading-tight truncate">
                  {company.name}
                </h2>
                <p className="text-white/90 text-sm mt-1 line-clamp-2">
                  {company.industry}{" "}
                  {company.location ? `· ${company.location}` : ""}
                </p>
                <p className="text-white/80 text-sm mt-1 line-clamp-2">
                  {company.short}
                </p>
              </div>
              <button
                onClick={onDetails}
                className="shrink-0 px-4 py-2 rounded-xl bg-white text-slate-900 text-sm font-medium hover:bg-white/90"
              >
                อ่านเพิ่มเติม
              </button>
            </div>
          </div>
        </div>

        {/* Tint overlays while dragging */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[28px] bg-emerald-500"
          style={{ opacity: likeBgOpacity, mixBlendMode: "multiply" }}
        />
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[28px] bg-rose-500"
          style={{ opacity: nopeBgOpacity, mixBlendMode: "multiply" }}
        />

        {/* Like / Nope banners */}
        <motion.div
          className="pointer-events-none absolute top-5 left-5 px-3 py-1.5 rounded-lg border-2 border-emerald-500 text-emerald-600 font-semibold bg-white/80"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </motion.div>
        <motion.div
          className="pointer-events-none absolute top-5 right-5 px-3 py-1.5 rounded-lg border-2 border-rose-500 text-rose-600 font-semibold bg-white/80"
          style={{ opacity: nopeOpacity }}
        >
          NOPE
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ----------------------------- UI bits ----------------------------- */
function CircleButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className="size-16 rounded-full grid place-items-center shadow-md border border-slate-200 bg-white"
    >
      {children}
    </button>
  );
}

function Dots({ total, index }: { total: number; index: number }) {
  return (
    <div className="mt-0 flex items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2 rounded-full transition-all ${
            i < index
              ? "bg-slate-300 w-2"
              : i === index
              ? "bg-slate-900 w-6"
              : "bg-slate-300/70 w-2"
          }`}
        />
      ))}
    </div>
  );
}

/* ----------------------------- Bottom Sheet ----------------------------- */
function BottomSheet({
  company,
  onClose,
}: {
  company: (typeof SAMPLE_COMPANIES)[number] | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {company && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          {/* ครึ่งล่างของจอ */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 top-1/2 rounded-t-3xl bg-white shadow-2xl overflow-y-auto"
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{company.name}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100"
              >
                <X className="size-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-700 mb-4 whitespace-pre-line">
                {company.details}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {company.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <Metric
                  label="Employees"
                  value={String(company.metrics.employees)}
                />
                <Metric label="Revenue" value={company.metrics.revenue} />
                <Metric
                  label="Founded"
                  value={String(company.metrics.founded)}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
