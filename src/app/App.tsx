import { useState } from "react";
import {
  LayoutDashboard, Users, Link2, History, Settings, LogOut,
  Search, Bell, Plus, Edit, Trash2, CheckCircle, XCircle,
  AlertCircle, Clock, ExternalLink, Shield, GraduationCap,
  RefreshCw, Filter, Key, TrendingUp, Activity,
  Globe, Hash, Calendar, ArrowRight, Lock, UserPlus,
  Layers, Download, ChevronDown, Eye, Play, BarChart2,
  Zap, Check, ChevronRight, Wifi, WifiOff, Info,
  User, Mail, Menu, X, AlertTriangle, Signal,
  Database, Server, Radio, BookOpen, FileText,
  ArrowUpRight, Minus, MoreHorizontal, Network
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ChartTooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import { Toaster, toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────
type Role = "student" | "professor" | "admin";
type Page =
  | "landing" | "login"
  | "s-dashboard" | "s-groups" | "s-join" | "s-links" | "s-history" | "s-profile"
  | "p-dashboard" | "p-groups" | "p-users" | "p-links" | "p-verify" | "p-activity"
  | "a-panel";

interface AppUser {
  id: string; name: string; matricula: string; role: Role;
  career?: string; department?: string; group?: string;
}

const FONT_HEADING = "'Plus Jakarta Sans', sans-serif";
const FONT_MONO = "'DM Mono', monospace";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockUsers: Record<Role, AppUser> = {
  student: { id: "s1", name: "Camila Rojo Pedraza", matricula: "Z20210892", role: "student", career: "Ing. Telemática", group: "CCNA-GR1-24" },
  professor: { id: "p1", name: "Dra. Valentina Cruz Herrera", matricula: "PR-00412", role: "professor", department: "Telecomunicaciones y Redes" },
  admin: { id: "a1", name: "Ing. Marcos Fuentes Ibarra", matricula: "SADM-001", role: "admin", department: "Sistemas Institucionales" },
};

const mockGroups = [
  { id: "g1", name: "CCNA-GR1-24", subject: "Cisco CCNA I", professor: "Dra. Valentina Cruz", students: 29, code: "NT-K3M8Z", codeExpiry: "2024-04-01", status: "active", links: 14, semester: "Ene–Jun 2024" },
  { id: "g2", name: "CCNA-GR2-24", subject: "Cisco CCNA I", professor: "Dra. Valentina Cruz", students: 31, code: "NT-X9P2Q", codeExpiry: "2024-04-01", status: "active", links: 14, semester: "Ene–Jun 2024" },
  { id: "g3", name: "RyT-2024A", subject: "Redes y Telecomunicaciones", professor: "Dra. Valentina Cruz", students: 25, code: "NT-7W4NJ", codeExpiry: "2024-03-20", status: "active", links: 9, semester: "Ene–Jun 2024" },
  { id: "g4", name: "SEC-2023B", subject: "Seguridad en Redes", professor: "Dr. Esteban Mora", students: 22, code: "NT-2A6BV", codeExpiry: "2023-12-31", status: "inactive", links: 7, semester: "Ago–Dic 2023" },
];

const mockStudents = [
  { id: "1", name: "Camila Rojo Pedraza", matricula: "Z20210892", group: "CCNA-GR1-24", career: "Ing. Telemática", status: "active", lastAccess: "Hoy, 10:14" },
  { id: "2", name: "Iván Castillo Serrano", matricula: "Z20210345", group: "CCNA-GR1-24", career: "Ing. Telemática", status: "active", lastAccess: "Hoy, 09:02" },
  { id: "3", name: "Nadia Flores Pineda", matricula: "Z20219814", group: "CCNA-GR2-24", career: "ISC", status: "active", lastAccess: "Ayer, 18:30" },
  { id: "4", name: "Bruno Aguilar Ríos", matricula: "Z20213391", group: "CCNA-GR2-24", career: "ISC", status: "inactive", lastAccess: "Hace 4 días" },
  { id: "5", name: "Lucía Peña Vargas", matricula: "Z20218527", group: "RyT-2024A", career: "ITC", status: "active", lastAccess: "Hoy, 11:45" },
  { id: "6", name: "Mateo Guzmán Torres", matricula: "Z20216043", group: "RyT-2024A", career: "ITC", status: "active", lastAccess: "Ayer, 21:12" },
  { id: "7", name: "Renata Soto Becerra", matricula: "Z20220138", group: "CCNA-GR1-24", career: "Ing. Telemática", status: "active", lastAccess: "Hoy, 08:55" },
  { id: "8", name: "Emilio Navarro Cruz", matricula: "Z20213762", group: "CCNA-GR2-24", career: "ISC", status: "inactive", lastAccess: "Hace 2 semanas" },
];

const mockLinks = [
  { id: "1", name: "Cisco Skills for All – Networking Basics", url: "https://skillsforall.com/course/networking-basics", subject: "CCNA I", description: "Fundamentos de redes oficiales de Cisco. Ideal para iniciar en certificación.", platform: "Cisco Skills", status: "active", lastVerified: "2024-01-18", publishedAt: "2024-01-05", verifyStatus: "online", accesses: 287, responseMs: 312 },
  { id: "2", name: "Packet Tracer – Descarga oficial", url: "https://www.netacad.com/courses/packet-tracer", subject: "CCNA I", description: "Simulador de redes oficial de Cisco NetAcad.", platform: "Cisco NetAcad", status: "active", lastVerified: "2024-01-17", publishedAt: "2024-01-05", verifyStatus: "online", accesses: 201, responseMs: 458 },
  { id: "3", name: "RFC 793 – TCP Protocol Spec", url: "https://www.rfc-editor.org/rfc/rfc793", subject: "Redes y Telecom.", description: "Especificación oficial del protocolo TCP por IETF.", platform: "IETF RFC Editor", status: "active", lastVerified: "2024-01-15", publishedAt: "2024-01-08", verifyStatus: "online", accesses: 74, responseMs: 195 },
  { id: "4", name: "CCNA 200-301 – Video Serie Completa", url: "https://youtube.com/playlist?list=PLxbwE86jKRgMQ4HTuaJ7yQgA2BoNwY9ct", subject: "CCNA I", description: "Playlist completa para preparación del examen CCNA 200-301.", platform: "YouTube", status: "active", lastVerified: "2024-01-16", publishedAt: "2024-01-10", verifyStatus: "online", accesses: 163, responseMs: 271 },
  { id: "5", name: "Wireshark User Guide", url: "https://www.wireshark.org/docs/wsug_html_chunked/", subject: "Seguridad", description: "Guía completa del analizador de protocolos Wireshark.", platform: "Wireshark.org", status: "active", lastVerified: "2024-01-12", publishedAt: "2024-01-06", verifyStatus: "degraded", accesses: 91, responseMs: 1840 },
  { id: "6", name: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework", subject: "Seguridad", description: "Marco oficial NIST para ciberseguridad.", platform: "NIST.gov", status: "inactive", lastVerified: "2024-01-08", publishedAt: "2023-12-15", verifyStatus: "offline", accesses: 38, responseMs: 0 },
  { id: "7", name: "Subnetting Made Easy – Calculadora", url: "https://subnettingpractice.com", subject: "CCNA I", description: "Herramienta interactiva de práctica de subredes.", platform: "Externo", status: "active", lastVerified: "2024-01-18", publishedAt: "2024-01-07", verifyStatus: "online", accesses: 334, responseMs: 142 },
];

const mockHistory = [
  { id: "1", student: "Camila Rojo Pedraza", matricula: "Z20210892", group: "CCNA-GR1-24", link: "Subnetting Made Easy", date: "2024-01-18", time: "10:14", ip: "172.16.0.34" },
  { id: "2", student: "Iván Castillo Serrano", matricula: "Z20210345", group: "CCNA-GR1-24", link: "Cisco Skills for All", date: "2024-01-18", time: "09:02", ip: "172.16.0.51" },
  { id: "3", student: "Lucía Peña Vargas", matricula: "Z20218527", group: "RyT-2024A", link: "RFC 793 – TCP Protocol", date: "2024-01-18", time: "11:45", ip: "10.10.1.22" },
  { id: "4", student: "Renata Soto Becerra", matricula: "Z20220138", group: "CCNA-GR1-24", link: "CCNA 200-301 Video Serie", date: "2024-01-18", time: "08:55", ip: "172.16.0.78" },
  { id: "5", student: "Nadia Flores Pineda", matricula: "Z20219814", group: "CCNA-GR2-24", link: "Packet Tracer – Descarga", date: "2024-01-17", time: "18:30", ip: "192.168.5.11" },
  { id: "6", student: "Mateo Guzmán Torres", matricula: "Z20216043", group: "RyT-2024A", link: "Subnetting Made Easy", date: "2024-01-17", time: "21:12", ip: "10.10.1.87" },
  { id: "7", student: "Camila Rojo Pedraza", matricula: "Z20210892", group: "CCNA-GR1-24", link: "Cisco Skills for All", date: "2024-01-17", time: "14:30", ip: "172.16.0.34" },
];

const weekData = [
  { day: "L", req: 38 }, { day: "M", req: 71 }, { day: "X", req: 55 },
  { day: "J", req: 94 }, { day: "V", req: 112 }, { day: "S", req: 29 }, { day: "D", req: 14 },
];

const linkPopData = [
  { name: "Subnetting", acc: 334 }, { name: "Cisco Skills", acc: 287 },
  { name: "Packet Tracer", acc: 201 }, { name: "CCNA Videos", acc: 163 },
  { name: "Wireshark", acc: 91 },
];

const uptimeData = Array.from({ length: 24 }, (_, i) => ({ h: `${i}h`, up: 95 + Math.random() * 5 }));

// ─── Utils ────────────────────────────────────────────────────────────────────
const cn = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(" ");

// ─── Pulse dot ────────────────────────────────────────────────────────────────
function PulseDot({ color = "green" }: { color?: "green" | "amber" | "red" | "gray" }) {
  const ring = { green: "bg-emerald-400", amber: "bg-amber-400", red: "bg-red-400", gray: "bg-gray-400" };
  const core = { green: "bg-emerald-500", amber: "bg-amber-500", red: "bg-red-500", gray: "bg-gray-400" };
  return (
    <span className="relative inline-flex w-2.5 h-2.5 flex-shrink-0">
      {color !== "gray" && <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-60", ring[color])} />}
      <span className={cn("relative inline-flex rounded-full w-2.5 h-2.5", core[color])} />
    </span>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVar = "default" | "success" | "warning" | "error" | "info" | "outline" | "dark";
function Badge({ variant = "default", children, className }: { variant?: BadgeVar; children: React.ReactNode; className?: string }) {
  const v: Record<BadgeVar, string> = {
    default: "bg-gray-100 text-gray-600",
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    error: "bg-red-50 text-red-700 ring-1 ring-red-200",
    info: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    outline: "border border-gray-200 text-gray-600",
    dark: "bg-gray-800 text-gray-200",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium tracking-wide", v[variant], className)}
      style={{ fontFamily: FONT_MONO }}>
      {children}
    </span>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
type BtnVar = "primary" | "secondary" | "ghost" | "destructive" | "outline";
type BtnSz = "xs" | "sm" | "md" | "lg";
function Btn({ variant = "primary", size = "md", children, onClick, className, disabled, type = "button" }: {
  variant?: BtnVar; size?: BtnSz; children: React.ReactNode;
  onClick?: () => void; className?: string; disabled?: boolean; type?: "button" | "submit";
}) {
  const v: Record<BtnVar, string> = {
    primary: "bg-primary text-white hover:bg-emerald-700 shadow-sm active:scale-[0.98]",
    secondary: "bg-secondary text-secondary-foreground hover:bg-emerald-100 border border-emerald-200",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-800",
    destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    outline: "border border-border bg-white text-foreground hover:bg-muted",
  };
  const s: Record<BtnSz, string> = {
    xs: "px-2.5 py-1 text-xs gap-1", sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2", lg: "px-5 py-2.5 text-base gap-2",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={cn("inline-flex items-center font-medium rounded-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", v[variant], s[size], className)}>
      {children}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
function Input({ label, placeholder, value, onChange, type = "text", icon, disabled, className }: {
  label?: string; placeholder?: string; value: string; onChange: (v: string) => void;
  type?: string; icon?: React.ReactNode; disabled?: boolean; className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input type={type} value={value} placeholder={placeholder} disabled={disabled}
          onChange={e => onChange(e.target.value)}
          className={cn(
            "w-full rounded-md border border-border bg-white px-3 py-2 text-sm placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
            "disabled:bg-gray-50 disabled:text-gray-500",
            icon && "pl-9"
          )} />
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = "md", role }: { name: string; size?: "sm" | "md" | "lg"; role?: Role }) {
  const initials = name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
  const bg = { student: "bg-emerald-500", professor: "bg-indigo-500", admin: "bg-gray-600" };
  const sz = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };
  return (
    <div className={cn("rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0", role ? bg[role] : "bg-emerald-500", sz[size])}
      style={{ fontFamily: FONT_MONO }}>
      {initials}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, sub, trend, color = "green" }: {
  label: string; value: string | number; icon: React.ReactNode; sub?: string; trend?: "up" | "down" | "neutral"; color?: string;
}) {
  const bg: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-600", blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600", violet: "bg-violet-50 text-violet-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={cn("p-2.5 rounded-lg flex-shrink-0", bg[color])}>{icon}</div>
        {trend && (
          <span className={cn("flex items-center gap-0.5 text-xs font-medium", trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-gray-400")}>
            {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : trend === "down" ? <ArrowUpRight className="w-3 h-3 rotate-180" /> : <Minus className="w-3 h-3" />}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-foreground" style={{ fontFamily: FONT_HEADING }}>{value}</p>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
function PageHeader({ title, desc, crumbs, action }: {
  title: string; desc?: string; crumbs?: string[]; action?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {crumbs && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2" style={{ fontFamily: FONT_MONO }}>
          {crumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3" />}
              <span className={i === crumbs.length - 1 ? "text-foreground font-medium" : ""}>{b}</span>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: FONT_HEADING }}>{title}</h1>
          {desc && <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-border shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-bold text-foreground" style={{ fontFamily: FONT_HEADING }}>{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
function EmptyState({ icon, title, desc, action }: { icon: React.ReactNode; title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="p-4 bg-gray-100 rounded-full text-gray-400">{icon}</div>
      <div>
        <p className="font-semibold text-gray-700">{title}</p>
        {desc && <p className="text-sm text-muted-foreground mt-1 max-w-xs">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const navCfg: Record<Role, { label: string; icon: React.ReactNode; page: Page }[]> = {
  student: [
    { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, page: "s-dashboard" },
    { label: "Mis Grupos", icon: <Layers className="w-4 h-4" />, page: "s-groups" },
    { label: "Unirse a Grupo", icon: <UserPlus className="w-4 h-4" />, page: "s-join" },
    { label: "Recursos", icon: <Link2 className="w-4 h-4" />, page: "s-links" },
    { label: "Mis Accesos", icon: <History className="w-4 h-4" />, page: "s-history" },
    { label: "Mi Perfil", icon: <User className="w-4 h-4" />, page: "s-profile" },
  ],
  professor: [
    { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, page: "p-dashboard" },
    { label: "Grupos", icon: <Layers className="w-4 h-4" />, page: "p-groups" },
    { label: "Estudiantes", icon: <Users className="w-4 h-4" />, page: "p-users" },
    { label: "Recursos", icon: <Link2 className="w-4 h-4" />, page: "p-links" },
    { label: "Estado de Red", icon: <Signal className="w-4 h-4" />, page: "p-verify" },
    { label: "Actividad", icon: <Activity className="w-4 h-4" />, page: "p-activity" },
  ],
  admin: [
    { label: "Panel Admin", icon: <LayoutDashboard className="w-4 h-4" />, page: "a-panel" },
  ],
};

const roleLabel: Record<Role, string> = { student: "Estudiante", professor: "Profesor", admin: "Administrador" };
const rolePill: Record<Role, string> = {
  student: "bg-emerald-500/15 text-emerald-300",
  professor: "bg-indigo-500/15 text-indigo-300",
  admin: "bg-amber-500/15 text-amber-300",
};

function Sidebar({ role, user, page, navigate, logout, collapsed, setCollapsed }: {
  role: Role; user: AppUser; page: Page; navigate: (p: Page) => void;
  logout: () => void; collapsed: boolean; setCollapsed: (v: boolean) => void;
}) {
  return (
    <aside className={cn("flex flex-col h-full bg-sidebar transition-all duration-200 flex-shrink-0", collapsed ? "w-14" : "w-56")}>
      {/* Brand */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-sidebar-border">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
                <Network className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-sm tracking-tight" style={{ fontFamily: FONT_HEADING }}>NetTrack</span>
            </div>
            <button onClick={() => setCollapsed(true)} className="text-sidebar-foreground hover:text-white transition-colors p-0.5">
              <Menu className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button onClick={() => setCollapsed(false)} className="mx-auto text-sidebar-foreground hover:text-white transition-colors">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Network className="w-4 h-4 text-white" />
            </div>
          </button>
        )}
      </div>

      {/* User */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Avatar name={user.name} size="sm" role={role} />
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate leading-tight">
                {user.name.split(" ").slice(0, 2).join(" ")}
              </p>
              <span className={cn("text-xs px-1.5 py-px rounded font-medium", rolePill[role])} style={{ fontFamily: FONT_MONO }}>
                {roleLabel[role]}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-1.5 space-y-0.5 overflow-y-auto">
        {navCfg[role].map(item => {
          const active = page === item.page;
          return (
            <button key={item.page} onClick={() => navigate(item.page)}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors text-left group",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}>
              <span className={cn("flex-shrink-0", active && "text-sidebar-primary")}>{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && active && <span className="ml-auto w-1 h-4 rounded-full bg-sidebar-primary flex-shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-1.5 border-t border-sidebar-border">
        <button onClick={logout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────
const pageTitle: Partial<Record<Page, string>> = {
  "s-dashboard": "Dashboard", "s-groups": "Mis Grupos", "s-join": "Unirse a Grupo",
  "s-links": "Recursos", "s-history": "Historial de Accesos", "s-profile": "Mi Perfil",
  "p-dashboard": "Dashboard", "p-groups": "Gestión de Grupos", "p-users": "Estudiantes",
  "p-links": "Recursos", "p-verify": "Estado de Red", "p-activity": "Actividad",
  "a-panel": "Panel Admin",
};

function TopBar({ page, user, role, onMenu }: { page: Page; user: AppUser; role: Role; onMenu: () => void }) {
  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="md:hidden text-gray-500 hover:text-gray-700"><Menu className="w-5 h-5" /></button>
        <div className="flex items-center gap-2">
          <PulseDot color="green" />
          <span className="text-sm font-bold text-foreground" style={{ fontFamily: FONT_HEADING }}>{pageTitle[page]}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <Avatar name={user.name} size="sm" role={role} />
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-foreground leading-tight">{user.name.split(" ").slice(0, 2).join(" ")}</p>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: FONT_MONO }}>{user.matricula}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── AppShell ─────────────────────────────────────────────────────────────────
function AppShell({ role, user, page, navigate, logout, children }: {
  role: Role; user: AppUser; page: Page; navigate: (p: Page) => void; logout: () => void; children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar role={role} user={user} page={page} navigate={navigate} logout={logout} collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar page={page} user={user} role={role} onMenu={() => setCollapsed(c => !c)} />
        <main className="flex-1 overflow-y-auto p-5 md:p-6 scrollbar-thin">{children}</main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════
function LandingPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-30 bg-[#111827]/95 backdrop-blur-sm border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Network className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold tracking-tight" style={{ fontFamily: FONT_HEADING }}>TucanLink</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-gray-400 hover:text-white text-sm transition-colors hidden sm:block">Recursos</a>
            <a href="#how" className="text-gray-400 hover:text-white text-sm transition-colors hidden sm:block">Funcionamiento</a>
            <Btn size="sm" onClick={onLogin}><Key className="w-3.5 h-3.5" />Acceder</Btn>
          </div>
        </div>
      </nav>

      {/* Hero — split canvas */}
      <div className="min-h-screen grid md:grid-cols-2">
        {/* Left: dark */}
        <div className="bg-[#111827] flex flex-col justify-center px-8 lg:px-16 pt-24 pb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.08),transparent_60%)] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-lg">
            <div className="inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/8 rounded-full px-3 py-1 mb-6">
              <PulseDot color="green" />
              <span className="text-emerald-400 text-xs font-medium" style={{ fontFamily: FONT_MONO }}>Instituto Tecnologico de Cancun</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight" style={{ fontFamily: FONT_HEADING }}>
              Accede a tus<br /><span className="text-emerald-400">recursos de clase</span><br />en un solo lugar
            </h1>
            <p className="text-gray-400 mt-5 text-lg leading-relaxed">
              TucanLink reune enlaces publicos de internet seleccionados para tus materias,
              practicas y actividades academicas del Instituto Tecnologico de Cancun.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Btn size="lg" onClick={onLogin}><ArrowRight className="w-4 h-4" />Entrar al sistema</Btn>
              <button className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-colors">
                <Play className="w-4 h-4" />Conoce el portal
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/8">
              {[{ v: "42", l: "Materias" }, { v: "1,892", l: "Recursos publicos" }, { v: "24/7", l: "Disponibilidad" }].map(s => (
                <div key={s.l}>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: FONT_HEADING }}>{s.v}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: light — mockup */}
        <div className="bg-gray-50 flex flex-col justify-center px-8 lg:px-12 pt-24 pb-12">
          <div className="max-w-lg w-full mx-auto">
            {/* Mini dashboard mockup */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="bg-[#1F2937] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-emerald-400" />
                  <span className="text-white text-xs font-bold" style={{ fontFamily: FONT_MONO }}>tucanlink.edu.mx</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PulseDot color="green" />
                  <span className="text-emerald-400 text-xs" style={{ fontFamily: FONT_MONO }}>portal estudiantil</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {[{ l: "Materias", v: "4", c: "text-emerald-600" }, { l: "Enlaces", v: "7", c: "text-blue-600" }, { l: "Categorias", v: "6", c: "text-violet-600" }].map(s => (
                    <div key={s.l} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                      <p className={cn("text-xl font-bold", s.c)} style={{ fontFamily: FONT_HEADING }}>{s.v}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
                    </div>
                  ))}
                </div>
                {/* Mini activity feed */}
                <div className="space-y-2">
                  {[
                    { id: "r1", title: "Cisco Skills for All", subject: "Redes" },
                    { id: "r2", title: "Packet Tracer", subject: "Simulacion" },
                    { id: "r3", title: "Wireshark User Guide", subject: "Protocolos" },
                  ].map(h => (
                    <div key={h.id} className="flex items-center gap-2.5 py-1.5 border-b border-gray-100 last:border-0">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="w-3 h-3 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{h.title}</p>
                        <p className="text-xs text-gray-400 truncate">{h.subject}</p>
                      </div>
                      <span className="text-xs text-gray-400" style={{ fontFamily: FONT_MONO }}>Abrir</span>
                    </div>
                  ))}
                </div>
                {/* Mini chart */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Recursos destacados de la semana</p>
                  <ResponsiveContainer width="100%" height={60}>
                    <AreaChart data={weekData}>
                      <defs>
                        <linearGradient id="mockGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="req" stroke="#059669" strokeWidth={1.5} fill="url(#mockGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold" style={{ fontFamily: FONT_HEADING }}>Recursos para tus materias</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">Encuentra enlaces publicos utiles para estudiar, practicar y complementar lo visto en clase.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: <Signal className="w-5 h-5" />, t: "Enlaces confiables", d: "Accede a sitios publicos de apoyo para tus tareas, laboratorios y practicas.", c: "green" },
              { icon: <Activity className="w-5 h-5" />, t: "Material por materia", d: "Consulta recursos organizados segun tus clases para encontrar lo que necesitas mas rapido.", c: "blue" },
              { icon: <Key className="w-5 h-5" />, t: "Entrada con codigo", d: "Usa tu matricula y el codigo de tu grupo para ver los recursos correspondientes a tu curso.", c: "violet" },
              { icon: <Layers className="w-5 h-5" />, t: "Contenido organizado", d: "Encuentra guias, plataformas, documentacion y herramientas separadas por tema.", c: "amber" },
              { icon: <Shield className="w-5 h-5" />, t: "Acceso institucional", d: "Ingresa desde el portal del Instituto Tecnologico de Cancun con tus datos academicos.", c: "green" },
              { icon: <BarChart2 className="w-5 h-5" />, t: "Apoyo al aprendizaje", d: "Refuerza tus conocimientos con recursos externos disponibles en internet.", c: "blue" },
            ].map(f => {
              const ic: Record<string, string> = { green: "bg-emerald-50 text-emerald-600", blue: "bg-blue-50 text-blue-600", violet: "bg-violet-50 text-violet-600", amber: "bg-amber-50 text-amber-600" };
              return (
                <div key={f.t} className="p-5 rounded-xl border border-border hover:shadow-md transition-all hover:-translate-y-0.5 duration-200">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", ic[f.c])}>{f.icon}</div>
                  <h3 className="font-semibold text-foreground mb-1.5 text-sm" style={{ fontFamily: FONT_HEADING }}>{f.t}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3" style={{ fontFamily: FONT_HEADING }}>Como usar TucanLink</h2>
          <p className="text-center text-muted-foreground text-sm mb-12">Accede a tus recursos academicos en tres pasos</p>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              { n: "01", t: "Inicia sesion", d: "Entra con tu matricula institucional y el codigo asignado a tu grupo." },
              { n: "02", t: "Elige tu materia", d: "Selecciona el grupo o curso donde necesitas consultar materiales de apoyo." },
              { n: "03", t: "Abre el recurso", d: "Visita enlaces publicos de internet relacionados con tus clases, practicas y proyectos." },
            ].map((s, i) => (
              <div key={s.n} className="relative">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary" style={{ fontFamily: FONT_MONO }}>{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1.5 text-sm" style={{ fontFamily: FONT_HEADING }}>{s.t}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: FONT_HEADING }}>Lo que encontraras en el portal</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { role: "Recursos de clase", icon: <BookOpen className="w-6 h-6" />, bg: "border-emerald-200 bg-emerald-50", ic: "bg-emerald-500 text-white", items: ["Guias y documentacion publica", "Herramientas para practicar", "Plataformas educativas externas", "Material complementario por tema"] },
              { role: "Acceso sencillo", icon: <GraduationCap className="w-6 h-6" />, bg: "border-indigo-200 bg-indigo-50", ic: "bg-indigo-500 text-white", items: ["Ingreso con matricula", "Codigo de grupo", "Recursos separados por materia", "Navegacion rapida desde el portal"] },
              { role: "Apoyo academico", icon: <Shield className="w-6 h-6" />, bg: "border-gray-200 bg-gray-50", ic: "bg-gray-700 text-white", items: ["Contenido para tareas", "Referencias para proyectos", "Practicas de laboratorio", "Consulta desde cualquier dispositivo"] },
            ].map(r => (
              <div key={r.role} className={cn("rounded-xl border-2 p-5", r.bg)}>
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-3", r.ic)}>{r.icon}</div>
                <h3 className="font-bold mb-3 text-sm" style={{ fontFamily: FONT_HEADING }}>{r.role}</h3>
                <ul className="space-y-2">
                  {r.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-700">
                      <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#111827]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PulseDot color="green" />
            <span className="text-emerald-400 text-xs" style={{ fontFamily: FONT_MONO }}>Portal estudiantil disponible</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: FONT_HEADING }}>Entra a tus recursos academicos</h2>
          <p className="text-gray-400 mb-8 text-sm">Inicia sesion con tu matricula del Instituto Tecnologico de Cancun y el codigo de tu grupo.</p>
          <Btn size="lg" onClick={onLogin}><ArrowRight className="w-4 h-4" />Entrar al sistema</Btn>
        </div>
      </section>

      <footer className="bg-[#0D1117] border-t border-white/5 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-500" />
            <span className="text-gray-500 text-sm" style={{ fontFamily: FONT_HEADING }}>TucanLink</span>
          </div>
          <p className="text-gray-700 text-xs">2024 TucanLink - Portal de recursos publicos para estudiantes del Instituto Tecnologico de Cancun</p>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════
function LoginPage({ onLogin, onBack }: { onLogin: (r: Role) => void; onBack: () => void }) {
  const [mat, setMat] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const demos = [
    { r: "student" as Role, l: "Estudiante", m: "Z20210892", c: "ST-2024" },
    { r: "professor" as Role, l: "Profesor", m: "PR-00412", c: "PR-2024" },
    { r: "admin" as Role, l: "Admin", m: "SADM-001", c: "ADM-2024" },
  ];

  const handleLogin = () => {
    if (!mat || !code) { setErr("Completa todos los campos."); return; }
    setLoading(true); setErr("");
    setTimeout(() => { setLoading(false); toast.success("Autenticación exitosa"); onLogin(role); }, 900);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-[480px_1fr]">
      {/* Left panel */}
      <div className="bg-[#111827] flex flex-col p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.06),transparent_60%)] pointer-events-none" />
        <div className="relative">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-10 transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" />Volver
          </button>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold" style={{ fontFamily: FONT_HEADING }}>NetTrack</p>
              <p className="text-gray-600 text-xs" style={{ fontFamily: FONT_MONO }}>v2.4.1</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: FONT_HEADING }}>Autenticación</h2>
          <p className="text-gray-400 text-sm leading-relaxed">Accede con tu matrícula institucional y tu código de acceso asignado.</p>

          <div className="mt-10 space-y-4">
            {[
              { icon: <Shield className="w-4 h-4" />, t: "Control por roles", d: "Cada usuario ve solo sus recursos" },
              { icon: <Clock className="w-4 h-4" />, t: "Sesión con expiración", d: "Cierre automático por inactividad" },
              { icon: <Activity className="w-4 h-4" />, t: "Auditoría de accesos", d: "Todo queda registrado" },
            ].map(f => (
              <div key={f.t} className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-400 flex-shrink-0">{f.icon}</div>
                <div>
                  <p className="text-sm text-gray-300 font-medium leading-tight">{f.t}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{f.d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* System status */}
          <div className="mt-10 p-3 bg-white/3 border border-white/6 rounded-lg">
            <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: FONT_MONO }}>ESTADO DEL SISTEMA</p>
            <div className="space-y-1.5">
              {[{ l: "API", s: "online" }, { l: "Base de datos", s: "online" }, { l: "Auth", s: "online" }].map(s => (
                <div key={s.l} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{s.l}</span>
                  <div className="flex items-center gap-1.5"><PulseDot color="green" /><span className="text-xs text-emerald-400" style={{ fontFamily: FONT_MONO }}>operativo</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-sm">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <Network className="w-6 h-6 text-primary" />
            <span className="font-bold" style={{ fontFamily: FONT_HEADING }}>NetTrack</span>
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: FONT_HEADING }}>Iniciar sesión</h1>
          <p className="text-muted-foreground text-sm mb-6">Credenciales institucionales requeridas</p>

          {/* Role tabs */}
          <div className="flex gap-1 mb-5 p-1 bg-white border border-border rounded-lg">
            {demos.map(d => (
              <button key={d.r} onClick={() => { setRole(d.r); setMat(d.m); setCode(d.c); }}
                className={cn("flex-1 py-1.5 rounded-md text-xs font-semibold transition-all",
                  role === d.r ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                )} style={{ fontFamily: FONT_MONO }}>
                {d.l}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <Input label="Matrícula" placeholder="Z20210892" value={mat} onChange={setMat} icon={<Hash className="w-4 h-4" />} />
            <Input label="Código de acceso" placeholder="••••••••" type="password" value={code} onChange={setCode} icon={<Key className="w-4 h-4" />} />
          </div>

          {err && (
            <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{err}
            </div>
          )}

          <Btn className="w-full mt-5 justify-center" onClick={handleLogin} disabled={loading} size="lg">
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />Verificando…</> : <><ArrowRight className="w-4 h-4" />Autenticar</>}
          </Btn>

          <p className="text-center text-xs text-muted-foreground mt-4">Selecciona un rol de demostración arriba para autocompletar.</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STUDENT PAGES
// ═══════════════════════════════════════════════════════════════════
function StudentDashboard({ navigate, user }: { navigate: (p: Page) => void; user: AppUser }) {
  return (
    <div>
      <PageHeader title={`Hola, ${user.name.split(" ")[0]}`} desc="Resumen de tus grupos y actividad reciente." crumbs={["Dashboard"]} />
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Grupos activos" value={3} icon={<Layers className="w-5 h-5" />} color="green" trend="up" sub="2 con recursos nuevos" />
        <StatCard label="Recursos disponibles" value={31} icon={<Link2 className="w-5 h-5" />} color="blue" trend="up" sub="+4 esta semana" />
        <StatCard label="Accesos este mes" value={47} icon={<Activity className="w-5 h-5" />} color="violet" sub="↑ 9 vs mes anterior" />
        <StatCard label="Último acceso" value="Hoy" icon={<Clock className="w-5 h-5" />} color="amber" sub="10:14 · Subnetting Tool" />
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <h3 className="font-bold text-sm" style={{ fontFamily: FONT_HEADING }}>Mis grupos</h3>
            <Btn variant="ghost" size="xs" onClick={() => navigate("s-groups")}><Eye className="w-3.5 h-3.5" />Ver todos</Btn>
          </div>
          <div className="divide-y divide-border">
            {mockGroups.slice(0, 3).map(g => (
              <div key={g.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate("s-links")}>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{g.name}</p>
                  <p className="text-xs text-muted-foreground">{g.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success">{g.links} recursos</Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <h3 className="font-bold text-sm" style={{ fontFamily: FONT_HEADING }}>Accesos recientes</h3>
          </div>
          <div className="divide-y divide-border">
            {mockHistory.slice(0, 5).map(h => (
              <div key={h.id} className="flex items-start gap-2.5 px-5 py-3">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate">{h.link}</p>
                  <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: FONT_MONO }}>{h.date} {h.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-border">
            <Btn variant="ghost" size="xs" className="w-full justify-center" onClick={() => navigate("s-history")}>Ver historial</Btn>
          </div>
        </div>
      </div>
      <div className="mt-5 bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex gap-3">
        <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Aviso del profesor</p>
          <p className="text-sm text-emerald-700 mt-0.5">Se añadieron 4 recursos de Cisco Skills for All. Accede desde la sección Recursos. — Dra. Valentina Cruz</p>
        </div>
      </div>
    </div>
  );
}

function StudentGroups({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <div>
      <PageHeader title="Mis Grupos" desc="Grupos en los que estás inscrito este semestre." crumbs={["Dashboard", "Mis Grupos"]}
        action={<Btn size="sm" onClick={() => navigate("s-join")}><Plus className="w-3.5 h-3.5" />Unirse</Btn>} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockGroups.map(g => (
          <div key={g.id} className={cn("bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200", g.status === "active" ? "border-border" : "border-gray-200 opacity-75")}>
            <div className={cn("h-1", g.status === "active" ? "bg-emerald-400" : "bg-gray-300")} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                <Badge variant={g.status === "active" ? "success" : "default"}>
                  {g.status === "active" ? "activo" : "inactivo"}
                </Badge>
              </div>
              <h3 className="font-bold text-sm" style={{ fontFamily: FONT_HEADING }}>{g.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{g.subject}</p>
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5" />{g.professor}</div>
                <div className="flex items-center gap-2"><Link2 className="w-3.5 h-3.5" />{g.links} recursos</div>
                <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />{g.semester}</div>
              </div>
              <Btn className="w-full mt-4 justify-center" size="sm" onClick={() => navigate("s-links")}>
                <ArrowRight className="w-3.5 h-3.5" />Entrar
              </Btn>
            </div>
          </div>
        ))}
        <button onClick={() => navigate("s-join")} className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center gap-2.5 text-muted-foreground hover:text-foreground hover:border-primary hover:bg-secondary transition-colors">
          <Plus className="w-7 h-7" />
          <p className="text-sm font-semibold">Unirse a grupo</p>
          <p className="text-xs text-center">Ingresa el código de tu profesor</p>
        </button>
      </div>
    </div>
  );
}

function StudentJoin({ navigate }: { navigate: (p: Page) => void }) {
  const [code, setCode] = useState("");
  const [detected, setDetected] = useState<typeof mockGroups[0] | null>(null);
  const [joined, setJoined] = useState(false);
  const detect = () => {
    const g = mockGroups.find(x => x.code === code.toUpperCase());
    if (g) setDetected(g); else { setDetected(null); toast.error("Código no encontrado. Verifica con tu profesor."); }
  };
  return (
    <div>
      <PageHeader title="Unirse a Grupo" desc="Ingresa el código temporal de tu profesor." crumbs={["Dashboard", "Mis Grupos", "Unirse"]} />
      <div className="max-w-md space-y-4">
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg"><Key className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-sm font-bold" style={{ fontFamily: FONT_HEADING }}>Código de acceso</p>
              <p className="text-xs text-muted-foreground">Formato: NT-XXXXX</p>
            </div>
          </div>
          <Input placeholder="Ej. NT-K3M8Z" value={code} onChange={v => { setCode(v); setDetected(null); }} icon={<Hash className="w-4 h-4" />} />
          <Btn variant="outline" className="w-full mt-3 justify-center" onClick={detect}><Search className="w-3.5 h-3.5" />Verificar código</Btn>
          {detected && !joined && (
            <div className="mt-4 border border-emerald-200 bg-emerald-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-800">Grupo encontrado</span>
              </div>
              <div className="space-y-1.5 text-sm mb-4">
                <p><span className="text-muted-foreground">Grupo: </span><span className="font-semibold">{detected.name}</span></p>
                <p><span className="text-muted-foreground">Materia: </span><span className="font-semibold">{detected.subject}</span></p>
                <p><span className="text-muted-foreground">Profesor: </span><span className="font-semibold">{detected.professor}</span></p>
                <p><span className="text-muted-foreground">Recursos: </span><span className="font-semibold">{detected.links} disponibles</span></p>
              </div>
              <Btn className="w-full justify-center" onClick={() => { setJoined(true); toast.success(`Unido a ${detected.name}`); setTimeout(() => navigate("s-groups"), 1500); }}>
                <UserPlus className="w-3.5 h-3.5" />Unirse al grupo
              </Btn>
            </div>
          )}
          {joined && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2 text-emerald-700 text-sm">
              <CheckCircle className="w-4 h-4" />¡Unido exitosamente! Redirigiendo…
            </div>
          )}
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">Los códigos expiran. Si ya no funciona, solicita uno nuevo a tu profesor.</p>
        </div>
      </div>
    </div>
  );
}

function StudentLinks() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<typeof mockLinks[0] | null>(null);
  const active = mockLinks.filter(l => l.status === "active" && (l.name.toLowerCase().includes(search.toLowerCase()) || l.platform.toLowerCase().includes(search.toLowerCase())));
  return (
    <div>
      <PageHeader title="Recursos" desc="Recursos educativos disponibles en tus grupos." crumbs={["Dashboard", "Recursos"]} />
      <div className="mb-4"><Input placeholder="Buscar recurso…" value={search} onChange={setSearch} icon={<Search className="w-4 h-4" />} /></div>
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-border bg-gray-50">
            {["Recurso", "Plataforma", "Materia", "Estado", "Acceso"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider last:text-right">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-border">
            {active.map(l => (
              <tr key={l.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-4 py-3.5">
                  <p className="text-sm font-semibold text-foreground">{l.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{l.description}</p>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell"><Badge variant="outline">{l.platform}</Badge></td>
                <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-muted-foreground">{l.subject}</td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <div className="flex items-center gap-1.5">
                    <PulseDot color={l.verifyStatus === "online" ? "green" : l.verifyStatus === "degraded" ? "amber" : "red"} />
                    <span className="text-xs text-muted-foreground" style={{ fontFamily: FONT_MONO }}>{l.verifyStatus}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Btn size="xs" onClick={() => setModal(l)}><ExternalLink className="w-3 h-3" />Abrir</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {active.length === 0 && <EmptyState icon={<Link2 className="w-6 h-6" />} title="Sin recursos" desc="No se encontraron recursos con ese filtro." />}
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title="Acceder a recurso externo">
        {modal && (
          <div>
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-5">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Saldrás de NetTrack</p>
                <p className="text-xs text-amber-700 mt-0.5">Esta acción quedará registrada en tu historial de accesos.</p>
              </div>
            </div>
            <p className="text-sm font-semibold mb-1">{modal.name}</p>
            <p className="text-xs text-muted-foreground mb-3">{modal.description}</p>
            <p className="text-xs bg-gray-50 border border-border px-3 py-2 rounded font-mono mb-5" style={{ fontFamily: FONT_MONO }}>{modal.url}</p>
            <div className="flex gap-3">
              <Btn variant="outline" className="flex-1 justify-center" onClick={() => setModal(null)}>Cancelar</Btn>
              <a href={modal.url} target="_blank" rel="noopener noreferrer" className="flex-1" onClick={() => { setModal(null); toast.success("Acceso registrado"); }}>
                <Btn className="w-full justify-center"><ExternalLink className="w-3.5 h-3.5" />Continuar</Btn>
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function StudentHistory() {
  const [search, setSearch] = useState("");
  return (
    <div>
      <PageHeader title="Historial de Accesos" desc="Registro de todos los recursos que has abierto." crumbs={["Dashboard", "Historial"]} />
      <div className="mb-4"><Input placeholder="Buscar en historial…" value={search} onChange={setSearch} icon={<Search className="w-4 h-4" />} /></div>
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-border bg-gray-50">
            {["Timestamp", "Recurso visitado", "Grupo", "Estado"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-border">
            {mockHistory.map(h => (
              <tr key={h.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-4 py-3.5">
                  <p className="text-xs font-semibold text-foreground" style={{ fontFamily: FONT_MONO }}>{h.date}</p>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: FONT_MONO }}>{h.time}</p>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">{h.link}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5"><Badge variant="outline">{h.group}</Badge></td>
                <td className="px-4 py-3.5"><Badge variant="success">OK</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentProfile({ user }: { user: AppUser }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState("c.rojo@alumnos.utn.edu.mx");
  return (
    <div>
      <PageHeader title="Mi Perfil" desc="Información de tu cuenta institucional." crumbs={["Dashboard", "Perfil"]} />
      <div className="max-w-xl space-y-4">
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <Avatar name={user.name} size="lg" role="student" />
            <div>
              <h2 className="font-bold" style={{ fontFamily: FONT_HEADING }}>{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="success">Estudiante</Badge>
                <span className="text-xs text-muted-foreground" style={{ fontFamily: FONT_MONO }}>{user.matricula}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[{ l: "Matrícula", v: user.matricula }, { l: "Carrera", v: user.career || "Ing. Telemática" }, { l: "Grupo principal", v: user.group || "CCNA-GR1-24" }, { l: "Semestre", v: "6° Semestre" }].map(f => (
              <div key={f.l} className="p-3 bg-gray-50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-0.5">{f.l}</p>
                <p className="text-sm font-semibold">{f.v}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm" style={{ fontFamily: FONT_HEADING }}>Datos de contacto</h3>
            <Btn variant="outline" size="xs" onClick={() => setEditing(e => !e)}><Edit className="w-3 h-3" />{editing ? "Cancelar" : "Editar"}</Btn>
          </div>
          <div className="space-y-3">
            <Input label="Nombre" value={name} onChange={setName} disabled={!editing} icon={<User className="w-4 h-4" />} />
            <Input label="Correo" value={email} onChange={setEmail} disabled={!editing} icon={<Mail className="w-4 h-4" />} />
          </div>
          {editing && (
            <Btn className="mt-4" size="sm" onClick={() => { setEditing(false); toast.success("Perfil actualizado"); }}>
              <Check className="w-3.5 h-3.5" />Guardar
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PROFESSOR PAGES
// ═══════════════════════════════════════════════════════════════════
function ProfDashboard({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <div>
      <PageHeader title="Dashboard" desc="Monitoreo en tiempo real de tus grupos y recursos." crumbs={["Dashboard"]} />
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Alumnos registrados" value={107} icon={<Users className="w-5 h-5" />} color="green" trend="up" sub="82 activos este mes" />
        <StatCard label="Grupos activos" value={3} icon={<Layers className="w-5 h-5" />} color="blue" />
        <StatCard label="Recursos en línea" value={6} icon={<Signal className="w-5 h-5" />} color="green" sub="1 con latencia alta" />
        <StatCard label="Accesos (semana)" value={431} icon={<Activity className="w-5 h-5" />} color="violet" trend="up" sub="+18% vs semana pasada" />
      </div>
      <div className="grid lg:grid-cols-5 gap-5 mb-5">
        <div className="lg:col-span-3 bg-card rounded-lg border border-border shadow-sm p-5">
          <h3 className="font-bold text-sm mb-4" style={{ fontFamily: FONT_HEADING }}>Accesos — últimos 7 días</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <ChartTooltip contentStyle={{ border: "1px solid #E5E7EB", borderRadius: "6px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="req" stroke="#059669" strokeWidth={2} fill="url(#wGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-card rounded-lg border border-border shadow-sm p-5">
          <h3 className="font-bold text-sm mb-4" style={{ fontFamily: FONT_HEADING }}>Recursos más accedidos</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={linkPopData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} width={80} />
              <ChartTooltip contentStyle={{ border: "1px solid #E5E7EB", borderRadius: "6px", fontSize: "12px" }} />
              <Bar dataKey="acc" fill="#059669" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h3 className="font-bold text-sm" style={{ fontFamily: FONT_HEADING }}>Actividad reciente</h3>
          <Btn variant="ghost" size="xs" onClick={() => navigate("p-activity")}><Eye className="w-3.5 h-3.5" />Ver todo</Btn>
        </div>
        <div className="divide-y divide-border">
          {mockHistory.slice(0, 5).map(h => (
            <div key={h.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/80 transition-colors">
              <Avatar name={h.student} size="sm" role="student" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{h.student}</p>
                <p className="text-xs text-muted-foreground">→ <span className="font-medium">{h.link}</span></p>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-xs text-muted-foreground" style={{ fontFamily: FONT_MONO }}>{h.date} {h.time}</span>
                <Badge variant="outline">{h.group}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfGroups() {
  const [showCreate, setShowCreate] = useState(false);
  const [nName, setNName] = useState("");
  const [nSubj, setNSubj] = useState("");
  return (
    <div>
      <PageHeader title="Grupos" desc="Gestiona tus grupos y códigos de acceso." crumbs={["Dashboard", "Grupos"]}
        action={<Btn size="sm" onClick={() => setShowCreate(true)}><Plus className="w-3.5 h-3.5" />Nuevo grupo</Btn>} />
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead><tr className="border-b border-border bg-gray-50">
              {["Grupo", "Materia", "Alumnos", "Código", "Expira", "Estado", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {mockGroups.map(g => (
                <tr key={g.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center"><Layers className="w-3.5 h-3.5 text-primary" /></div>
                      <div>
                        <p className="text-sm font-semibold">{g.name}</p>
                        <p className="text-xs text-muted-foreground">{g.links} recursos</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm">{g.subject}</td>
                  <td className="px-4 py-3.5"><div className="flex items-center gap-1.5 text-sm"><Users className="w-3.5 h-3.5 text-muted-foreground" />{g.students}</div></td>
                  <td className="px-4 py-3.5"><span className="text-xs px-2 py-1 bg-gray-100 border border-gray-200 rounded font-semibold" style={{ fontFamily: FONT_MONO }}>{g.code}</span></td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground" style={{ fontFamily: FONT_MONO }}>{g.codeExpiry}</td>
                  <td className="px-4 py-3.5"><div className="flex items-center gap-1.5"><PulseDot color={g.status === "active" ? "green" : "gray"} /><Badge variant={g.status === "active" ? "success" : "default"}>{g.status === "active" ? "activo" : "inactivo"}</Badge></div></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <Btn variant="ghost" size="xs" onClick={() => toast.success("Nuevo código generado")}><RefreshCw className="w-3.5 h-3.5" /></Btn>
                      <Btn variant="ghost" size="xs"><Edit className="w-3.5 h-3.5" /></Btn>
                      <Btn variant="ghost" size="xs" onClick={() => toast.error("Grupo eliminado")}><Trash2 className="w-3.5 h-3.5 text-red-500" /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Crear grupo">
        <div className="space-y-3">
          <Input label="Nombre del grupo" placeholder="Ej. CCNA-GR3-24" value={nName} onChange={setNName} />
          <Input label="Materia" placeholder="Ej. Cisco CCNA I" value={nSubj} onChange={setNSubj} />
          <div className="flex gap-3 pt-2">
            <Btn variant="outline" className="flex-1 justify-center" onClick={() => setShowCreate(false)}>Cancelar</Btn>
            <Btn className="flex-1 justify-center" onClick={() => { setShowCreate(false); toast.success("Grupo creado"); }}><Plus className="w-3.5 h-3.5" />Crear</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ProfUsers({ navigate }: { navigate: (p: Page) => void }) {
  const [search, setSearch] = useState("");
  const filtered = mockStudents.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.matricula.includes(search));
  return (
    <div>
      <PageHeader title="Estudiantes" desc="Lista de alumnos en tus grupos." crumbs={["Dashboard", "Estudiantes"]} />
      <div className="mb-4 flex gap-3">
        <div className="flex-1"><Input placeholder="Buscar por nombre o matrícula…" value={search} onChange={setSearch} icon={<Search className="w-4 h-4" />} /></div>
        <Btn variant="outline"><Download className="w-4 h-4" />Exportar</Btn>
      </div>
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead><tr className="border-b border-border bg-gray-50">
              {["Estudiante", "Matrícula", "Grupo", "Estado", "Último acceso", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3.5"><div className="flex items-center gap-2.5"><Avatar name={s.name} size="sm" role="student" /><span className="text-sm font-semibold">{s.name}</span></div></td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground" style={{ fontFamily: FONT_MONO }}>{s.matricula}</td>
                  <td className="px-4 py-3.5"><Badge variant="outline">{s.group}</Badge></td>
                  <td className="px-4 py-3.5"><div className="flex items-center gap-1.5"><PulseDot color={s.status === "active" ? "green" : "gray"} /><Badge variant={s.status === "active" ? "success" : "default"}>{s.status === "active" ? "activo" : "inactivo"}</Badge></div></td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground">{s.lastAccess}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      <Btn variant="ghost" size="xs" onClick={() => navigate("p-activity")}><History className="w-3.5 h-3.5" /></Btn>
                      <Btn variant="ghost" size="xs"><Edit className="w-3.5 h-3.5" /></Btn>
                      <Btn variant="ghost" size="xs" onClick={() => toast.warning("Alumno desactivado")}><Lock className="w-3.5 h-3.5 text-amber-500" /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState icon={<Users className="w-6 h-6" />} title="Sin resultados" />}
      </div>
    </div>
  );
}

function ProfLinks() {
  const [links, setLinks] = useState(mockLinks);
  const [showCreate, setShowCreate] = useState(false);
  const [nName, setNName] = useState(""); const [nUrl, setNUrl] = useState(""); const [nDesc, setNDesc] = useState("");
  const toggle = (id: string) => { setLinks(ls => ls.map(l => l.id === id ? { ...l, status: l.status === "active" ? "inactive" : "active" } : l)); toast.success("Estado actualizado"); };
  return (
    <div>
      <PageHeader title="Recursos" desc="Gestiona los recursos educativos de tus grupos." crumbs={["Dashboard", "Recursos"]}
        action={<Btn size="sm" onClick={() => setShowCreate(true)}><Plus className="w-3.5 h-3.5" />Nuevo recurso</Btn>} />
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead><tr className="border-b border-border bg-gray-50">
              {["Recurso", "Plataforma", "Red", "Estado", "Accesos", "Verif.", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {links.map(l => (
                <tr key={l.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold">{l.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[180px]">{l.description}</p>
                  </td>
                  <td className="px-4 py-3.5"><Badge variant="outline">{l.platform}</Badge></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <PulseDot color={l.verifyStatus === "online" ? "green" : l.verifyStatus === "degraded" ? "amber" : "red"} />
                      <span className="text-xs" style={{ fontFamily: FONT_MONO }}>{l.responseMs > 0 ? `${l.responseMs}ms` : "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><button onClick={() => toggle(l.id)}><Badge variant={l.status === "active" ? "success" : "default"}>{l.status === "active" ? "activo" : "inactivo"}</Badge></button></td>
                  <td className="px-4 py-3.5 text-sm font-semibold">{l.accesses}</td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground" style={{ fontFamily: FONT_MONO }}>{l.lastVerified}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <Btn variant="ghost" size="xs"><Edit className="w-3.5 h-3.5" /></Btn>
                      <Btn variant="ghost" size="xs" onClick={() => toast.success("Verificando…")}><RefreshCw className="w-3.5 h-3.5" /></Btn>
                      <Btn variant="ghost" size="xs" onClick={() => toast.error("Recurso eliminado")}><Trash2 className="w-3.5 h-3.5 text-red-500" /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nuevo recurso">
        <div className="space-y-3">
          <Input label="Nombre" placeholder="Ej. Cisco Skills – CCNA" value={nName} onChange={setNName} />
          <Input label="URL" placeholder="https://…" value={nUrl} onChange={setNUrl} icon={<Globe className="w-4 h-4" />} />
          <Input label="Descripción" placeholder="Breve descripción" value={nDesc} onChange={setNDesc} />
          <div className="flex gap-3 pt-2">
            <Btn variant="outline" className="flex-1 justify-center" onClick={() => setShowCreate(false)}>Cancelar</Btn>
            <Btn className="flex-1 justify-center" onClick={() => { setShowCreate(false); toast.success("Recurso creado"); }}><Plus className="w-3.5 h-3.5" />Crear</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Network Status / Verify Page ────────────────────────────────────────────
function ProfVerify() {
  const [checking, setChecking] = useState<string | null>(null);
  const [st, setSt] = useState<Record<string, string>>(() => Object.fromEntries(mockLinks.map(l => [l.id, l.verifyStatus])));
  const [ms, setMs] = useState<Record<string, number>>(() => Object.fromEntries(mockLinks.map(l => [l.id, l.responseMs])));

  const check = (id: string) => {
    setChecking(id); setSt(s => ({ ...s, [id]: "checking" }));
    setTimeout(() => {
      const rand = Math.random();
      const newSt = rand > 0.75 ? "online" : rand > 0.2 ? "online" : rand > 0.1 ? "degraded" : "offline";
      const newMs = newSt === "online" ? Math.floor(100 + Math.random() * 500) : newSt === "degraded" ? Math.floor(1000 + Math.random() * 2000) : 0;
      setSt(s => ({ ...s, [id]: newSt })); setMs(m => ({ ...m, [id]: newMs }));
      setChecking(null);
      toast[newSt === "online" ? "success" : newSt === "degraded" ? "warning" : "error"](
        newSt === "online" ? `En línea — ${newMs}ms` : newSt === "degraded" ? `Latencia alta — ${newMs}ms` : "Sin respuesta"
      );
    }, 1800);
  };

  const checkAll = () => mockLinks.forEach((l, i) => setTimeout(() => check(l.id), i * 300));

  const counts = {
    online: Object.values(st).filter(s => s === "online").length,
    degraded: Object.values(st).filter(s => s === "degraded").length,
    offline: Object.values(st).filter(s => s === "offline").length,
  };

  return (
    <div>
      <PageHeader title="Estado de Red" desc="Verifica la disponibilidad de recursos externos en tiempo real."
        crumbs={["Dashboard", "Estado de Red"]}
        action={<Btn size="sm" onClick={checkAll}><RefreshCw className="w-3.5 h-3.5" />Verificar todo</Btn>} />

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: FONT_MONO }}>EN LÍNEA</span>
            <PulseDot color="green" />
          </div>
          <p className="text-3xl font-bold text-emerald-600" style={{ fontFamily: FONT_HEADING }}>{counts.online}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: FONT_MONO }}>DEGRADADO</span>
            <PulseDot color="amber" />
          </div>
          <p className="text-3xl font-bold text-amber-500" style={{ fontFamily: FONT_HEADING }}>{counts.degraded}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: FONT_MONO }}>SIN CONEXIÓN</span>
            <PulseDot color="red" />
          </div>
          <p className="text-3xl font-bold text-red-500" style={{ fontFamily: FONT_HEADING }}>{counts.offline}</p>
        </div>
      </div>

      {/* Uptime chart */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-sm mb-5">
        <h3 className="font-bold text-sm mb-3" style={{ fontFamily: FONT_HEADING }}>Uptime agregado — últimas 24 horas</h3>
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={uptimeData}>
            <XAxis dataKey="h" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval={3} />
            <YAxis domain={[90, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <ChartTooltip contentStyle={{ border: "1px solid #E5E7EB", borderRadius: "6px", fontSize: "11px" }} formatter={(v: number) => [`${v.toFixed(1)}%`, "Uptime"]} />
            <Line type="monotone" dataKey="up" stroke="#059669" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Resources */}
      <div className="space-y-2.5">
        {mockLinks.map(l => {
          const status = st[l.id];
          const responseTime = ms[l.id];
          const isChecking = checking === l.id;
          const dotColor = status === "online" ? "green" : status === "degraded" ? "amber" : status === "checking" ? "amber" : "red";
          const barW = status === "online" ? "w-full" : status === "degraded" ? "w-3/5" : status === "checking" ? "w-1/3 animate-pulse" : "w-0";
          const barC = status === "online" ? "bg-emerald-400" : "bg-amber-400";
          return (
            <div key={l.id} className="bg-card border border-border rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                  status === "online" ? "bg-emerald-50" : status === "degraded" ? "bg-amber-50" : status === "checking" ? "bg-amber-50" : "bg-red-50")}>
                  {status === "online" ? <Wifi className="w-4 h-4 text-emerald-500" /> :
                    status === "checking" ? <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" /> :
                      status === "degraded" ? <AlertCircle className="w-4 h-4 text-amber-500" /> :
                        <WifiOff className="w-4 h-4 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold truncate">{l.name}</p>
                    <Badge variant={status === "online" ? "success" : status === "degraded" ? "warning" : status === "checking" ? "warning" : "error"} className="flex-shrink-0">
                      {status === "checking" ? "verificando…" : status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-500", barW, barC)} />
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0" style={{ fontFamily: FONT_MONO }}>
                      {responseTime > 0 ? `${responseTime}ms` : "—"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate" style={{ fontFamily: FONT_MONO }}>{l.url}</p>
                </div>
                <Btn variant="outline" size="xs" onClick={() => check(l.id)} disabled={isChecking} className="flex-shrink-0">
                  <RefreshCw className={cn("w-3 h-3", isChecking && "animate-spin")} />
                  {isChecking ? "…" : "Verificar"}
                </Btn>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfActivity() {
  const [search, setSearch] = useState("");
  const [gFilter, setGFilter] = useState("all");
  const groups = Array.from(new Set(mockHistory.map(h => h.group)));
  const filtered = mockHistory.filter(h =>
    (gFilter === "all" || h.group === gFilter) &&
    (h.student.toLowerCase().includes(search.toLowerCase()) || h.link.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div>
      <PageHeader title="Actividad" desc="Registro completo de accesos de todos tus estudiantes."
        crumbs={["Dashboard", "Actividad"]}
        action={<Btn variant="outline" size="sm"><Download className="w-3.5 h-3.5" />Exportar CSV</Btn>} />
      <div className="mb-4 flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[180px]"><Input placeholder="Buscar alumno o recurso…" value={search} onChange={setSearch} icon={<Search className="w-4 h-4" />} /></div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", ...groups].map(g => (
            <button key={g} onClick={() => setGFilter(g)}
              className={cn("px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border",
                gFilter === g ? "bg-primary text-white border-primary" : "bg-white border-border text-muted-foreground hover:bg-muted"
              )} style={{ fontFamily: FONT_MONO }}>
              {g === "all" ? "Todos" : g}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead><tr className="border-b border-border bg-gray-50">
              {["Alumno", "Grupo", "Recurso", "Fecha", "Hora", "IP"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map(h => (
                <tr key={h.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3.5"><div className="flex items-center gap-2.5"><Avatar name={h.student} size="sm" role="student" /><div><p className="text-sm font-semibold">{h.student}</p><p className="text-xs text-muted-foreground" style={{ fontFamily: FONT_MONO }}>{h.matricula}</p></div></div></td>
                  <td className="px-4 py-3.5"><Badge variant="outline">{h.group}</Badge></td>
                  <td className="px-4 py-3.5"><div className="flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" /><span className="text-sm truncate max-w-[150px]">{h.link}</span></div></td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground" style={{ fontFamily: FONT_MONO }}>{h.date}</td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground" style={{ fontFamily: FONT_MONO }}>{h.time}</td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground" style={{ fontFamily: FONT_MONO }}>{h.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState icon={<Activity className="w-6 h-6" />} title="Sin registros" desc="Ajusta los filtros para ver resultados." />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════
function AdminPanel() {
  const [tab, setTab] = useState<"overview" | "users" | "professors" | "settings">("overview");
  const tabs = [
    { id: "overview" as const, label: "Resumen" },
    { id: "users" as const, label: "Usuarios" },
    { id: "professors" as const, label: "Profesores" },
    { id: "settings" as const, label: "Configuración" },
  ];
  return (
    <div>
      <PageHeader title="Panel Administrador" desc="Control total del sistema NetTrack." crumbs={["Admin"]} />
      <div className="flex gap-1 mb-6 p-1 bg-white border border-border rounded-lg w-fit shadow-sm">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("px-4 py-1.5 rounded-md text-sm font-semibold transition-all",
              tab === t.id ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total usuarios" value="10,103" icon={<Users className="w-5 h-5" />} color="green" trend="up" sub="261 profesores · 9,842 alumnos" />
            <StatCard label="Grupos activos" value={41} icon={<Layers className="w-5 h-5" />} color="blue" />
            <StatCard label="Recursos registrados" value={1892} icon={<Link2 className="w-5 h-5" />} color="violet" />
            <StatCard label="Accesos totales" value="67,218" icon={<Activity className="w-5 h-5" />} color="amber" trend="up" />
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-sm mb-4" style={{ fontFamily: FONT_HEADING }}>Accesos del sistema — 7 días</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weekData}>
                  <defs><linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.15} /><stop offset="95%" stopColor="#059669" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <ChartTooltip contentStyle={{ border: "1px solid #E5E7EB", borderRadius: "6px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="req" stroke="#059669" strokeWidth={2} fill="url(#aGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-sm mb-4" style={{ fontFamily: FONT_HEADING }}>Servicios del sistema</h3>
              <div className="space-y-2.5">
                {[
                  { l: "API Gateway", u: "99.97%", s: "online" },
                  { l: "Base de datos PostgreSQL", u: "100%", s: "online" },
                  { l: "Servicio de autenticación", u: "100%", s: "online" },
                  { l: "Verificador de recursos", u: "99.1%", s: "online" },
                  { l: "Motor de notificaciones", u: "88.4%", s: "degraded" },
                  { l: "Sistema de respaldos", u: "100%", s: "online" },
                ].map(s => (
                  <div key={s.l} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-2.5">
                      <PulseDot color={s.s === "online" ? "green" : "amber"} />
                      <span className="text-sm">{s.l}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground" style={{ fontFamily: FONT_MONO }}>{s.u} uptime</span>
                      <Badge variant={s.s === "online" ? "success" : "warning"}>{s.s === "online" ? "operativo" : "degradado"}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-sm" style={{ fontFamily: FONT_HEADING }}>Usuarios del sistema</h3>
            <Btn size="sm"><Plus className="w-3.5 h-3.5" />Nuevo usuario</Btn>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead><tr className="border-b border-border bg-gray-50">
                {["Usuario", "Matrícula", "Rol", "Estado", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-border">
                {[...mockStudents, ...([
                  { id: "p1", name: "Dra. Valentina Cruz Herrera", matricula: "PR-00412", group: "—", career: "Profesora", status: "active", lastAccess: "Hoy" },
                  { id: "p2", name: "Dr. Esteban Mora Quintero", matricula: "PR-00389", group: "—", career: "Profesor", status: "active", lastAccess: "Ayer" },
                ])].map((u: any) => {
                  const isP = u.id.startsWith("p");
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3.5"><div className="flex items-center gap-2.5"><Avatar name={u.name} size="sm" role={isP ? "professor" : "student"} /><span className="text-sm font-semibold">{u.name}</span></div></td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground" style={{ fontFamily: FONT_MONO }}>{u.matricula}</td>
                      <td className="px-4 py-3.5"><Badge variant={isP ? "info" : "default"}>{isP ? "Profesor" : "Estudiante"}</Badge></td>
                      <td className="px-4 py-3.5"><div className="flex items-center gap-1.5"><PulseDot color={u.status === "active" ? "green" : "gray"} /><Badge variant={u.status === "active" ? "success" : "default"}>{u.status === "active" ? "activo" : "inactivo"}</Badge></div></td>
                      <td className="px-4 py-3.5"><div className="flex gap-1"><Btn variant="ghost" size="xs"><Edit className="w-3.5 h-3.5" /></Btn><Btn variant="ghost" size="xs"><Trash2 className="w-3.5 h-3.5 text-red-500" /></Btn></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "professors" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Dra. Valentina Cruz Herrera", dept: "Telecomunicaciones y Redes", groups: 3, students: 85, status: "active" },
            { name: "Dr. Esteban Mora Quintero", dept: "Seguridad Informática", groups: 2, students: 46, status: "active" },
            { name: "M.C. Raquel Ibáñez Soria", dept: "Sistemas Distribuidos", groups: 4, students: 109, status: "active" },
            { name: "Dr. Fernando Salinas Cruz", dept: "Inteligencia Artificial", groups: 1, students: 27, status: "inactive" },
          ].map(p => (
            <div key={p.name} className="bg-card border border-border rounded-lg p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <Avatar name={p.name} size="md" role="professor" />
                <div className="flex items-center gap-1.5"><PulseDot color={p.status === "active" ? "green" : "gray"} /><Badge variant={p.status === "active" ? "success" : "default"}>{p.status === "active" ? "activo" : "inactivo"}</Badge></div>
              </div>
              <h3 className="font-bold text-sm mt-2" style={{ fontFamily: FONT_HEADING }}>{p.name}</h3>
              <p className="text-xs text-muted-foreground">{p.dept}</p>
              <div className="flex gap-4 mt-3 pb-3 border-b border-border">
                <div><p className="text-xl font-bold" style={{ fontFamily: FONT_HEADING }}>{p.groups}</p><p className="text-xs text-muted-foreground">grupos</p></div>
                <div><p className="text-xl font-bold" style={{ fontFamily: FONT_HEADING }}>{p.students}</p><p className="text-xs text-muted-foreground">alumnos</p></div>
              </div>
              <div className="flex gap-2 mt-3">
                <Btn variant="outline" size="xs" className="flex-1 justify-center"><Edit className="w-3 h-3" />Editar</Btn>
                <Btn variant="ghost" size="xs"><Trash2 className="w-3.5 h-3.5 text-red-500" /></Btn>
              </div>
            </div>
          ))}
          <button className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center gap-2.5 text-muted-foreground hover:border-primary hover:text-foreground hover:bg-secondary transition-colors">
            <Plus className="w-8 h-8" /><p className="text-sm font-semibold">Agregar profesor</p>
          </button>
        </div>
      )}

      {tab === "settings" && (
        <div className="max-w-2xl space-y-4">
          {[
            { title: "Configuración institucional", fields: [{ l: "Nombre de la institución", v: "Universidad Tecnológica del Norte" }, { l: "Dominio", v: "utn.edu.mx" }, { l: "Zona horaria", v: "America/Monterrey (UTC-6)" }] },
            { title: "Autenticación y sesiones", fields: [{ l: "Expiración de sesión", v: "6 horas" }, { l: "Reintentos permitidos", v: "5 intentos" }, { l: "Vigencia de códigos de grupo", v: "30 días" }] },
            { title: "Monitoreo de recursos", fields: [{ l: "Intervalo de verificación automática", v: "Cada 6 horas" }, { l: "Timeout de verificación", v: "10 segundos" }, { l: "Umbral de latencia alta", v: "800ms" }] },
          ].map(s => (
            <div key={s.title} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-gray-50">
                <h3 className="font-bold text-sm" style={{ fontFamily: FONT_HEADING }}>{s.title}</h3>
              </div>
              <div className="divide-y divide-border">
                {s.fields.map(f => (
                  <div key={f.l} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-muted-foreground">{f.l}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ fontFamily: FONT_MONO }}>{f.v}</span>
                      <Btn variant="ghost" size="xs"><Edit className="w-3 h-3" /></Btn>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <h3 className="font-bold text-red-800 text-sm mb-1" style={{ fontFamily: FONT_HEADING }}>Zona de peligro</h3>
            <p className="text-xs text-red-600 mb-4">Acciones irreversibles. Proceder con precaución.</p>
            <Btn variant="destructive" size="sm" onClick={() => toast.error("Acción bloqueada por seguridad")}>
              <Trash2 className="w-3.5 h-3.5" />Purgar registros de actividad
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// APP ROUTER
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);

  const nav = (p: Page) => setPage(p);
  const login = (r: Role) => { setRole(r); setUser(mockUsers[r]); nav(r === "student" ? "s-dashboard" : r === "professor" ? "p-dashboard" : "a-panel"); };
  const logout = () => { setRole(null); setUser(null); nav("landing"); };

  if (page === "landing") return <><Toaster position="top-right" richColors /><LandingPage onLogin={() => nav("login")} /></>;
  if (page === "login") return <><Toaster position="top-right" richColors /><LoginPage onLogin={login} onBack={() => nav("landing")} /></>;
  if (!role || !user) return null;

  const renderPage = () => {
    switch (page) {
      case "s-dashboard": return <StudentDashboard navigate={nav} user={user} />;
      case "s-groups": return <StudentGroups navigate={nav} />;
      case "s-join": return <StudentJoin navigate={nav} />;
      case "s-links": return <StudentLinks />;
      case "s-history": return <StudentHistory />;
      case "s-profile": return <StudentProfile user={user} />;
      case "p-dashboard": return <ProfDashboard navigate={nav} />;
      case "p-groups": return <ProfGroups />;
      case "p-users": return <ProfUsers navigate={nav} />;
      case "p-links": return <ProfLinks />;
      case "p-verify": return <ProfVerify />;
      case "p-activity": return <ProfActivity />;
      case "a-panel": return <AdminPanel />;
      default: return <StudentDashboard navigate={nav} user={user} />;
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <AppShell role={role} user={user} page={page} navigate={nav} logout={logout}>
        {renderPage()}
      </AppShell>
    </>
  );
}
