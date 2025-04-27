"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../lib/auth";
import { createPath } from "../lib/navigation";
import { 
  FileText, 
  Clock,
  CheckCircle,
  Plus, 
  CheckSquare, 
  LineChart, 
  BarChart as BarChartIcon
} from "lucide-react";

// Type definitions
interface StatsData {
  totalDocuments: number;
  totalCompleted: number;
  newToday: number;
  completedToday: number;
}

interface ActivityData {
  labels: string[];
  data: number[];
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}

interface BarChartProps {
  data: ActivityData;
}

// Dashboard component
export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData>({
    totalDocuments: 235,
    totalCompleted: 180,
    newToday: 13,
    completedToday: 8
  });

  // Charts data
  const [recentActivity, setRecentActivity] = useState<ActivityData>({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [12, 19, 15, 8, 22, 14, 9]
  });

  // Mobile view state
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeTab, setActiveTab] = useState<'charts' | 'documents'>('charts');

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push(createPath("/login"));
      return;
    }

    // Set up responsive design detection
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">ແຜງຄວບຄຸມ</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="ເອກະສານທັງໝົດ" 
          value={stats.totalDocuments} 
          icon={<FileText size={24} className="text-primary" />} 
          className="bg-neutral-50 dark:bg-neutral-800"
        />
        <StatsCard 
          title="ສຳເລັດທັງໝົດ" 
          value={stats.totalCompleted} 
          icon={<CheckCircle size={24} className="text-success" />} 
          className="bg-success-light/10 dark:bg-success-dark/10"
        />
        <StatsCard 
          title="ສ້າງໃໝ່ມື້ນີ້" 
          value={stats.newToday} 
          icon={<Plus size={24} className="text-info" />} 
          className="bg-info-light/10 dark:bg-info-dark/10"
        />
        <StatsCard 
          title="ສຳເລັດມື້ນີ້" 
          value={stats.completedToday} 
          icon={<CheckSquare size={24} className="text-primary" />} 
          className="bg-primary-light/10 dark:bg-primary-dark/10"
        />
      </div>

      {/* Mobile View Tabs */}
      {isMobileView && (
        <div className="mb-6">
          <div className="flex border-b border-neutral-200 dark:border-neutral-700">
            <button
              className={`flex-1 py-2 px-4 font-medium border-b-2 ${
                activeTab === 'charts' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
              onClick={() => setActiveTab('charts')}
            >
              <div className="flex items-center justify-center gap-2">
                <LineChart size={16} />
                <span>ຊາດ</span>
              </div>
            </button>
            <button
              className={`flex-1 py-2 px-4 font-medium border-b-2 ${
                activeTab === 'documents' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText size={16} />
                <span>ເອກະສານລ່າສຸດ</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Charts Section - shown by default on desktop, or when charts tab is active on mobile */}
      {(!isMobileView || activeTab === 'charts') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card-background p-4 rounded-lg shadow border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LineChart size={20} className="text-primary" />
              <span>ເອກກະສານຕາມຜູ້ໃຊ້</span>
            </h2>
            <div className="h-64 flex items-center justify-center">
              <SimplePieChart />
            </div>
          </div>
          <div className="bg-card-background p-4 rounded-lg shadow border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChartIcon size={20} className="text-primary" />
              <span>ກິດຈະກຳລ່າສຸດ</span>
            </h2>
            <div className="h-64 flex items-center justify-center">
              <SimpleBarChart data={recentActivity} />
            </div>
          </div>
        </div>
      )}

      {/* Recent Documents Table - shown by default on desktop, or when documents tab is active on mobile */}
      {(!isMobileView || activeTab === 'documents') && (
        <div className="bg-card-background p-4 rounded-lg shadow mb-8 border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            <span>ເອກະສານລ່າສຸດ</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-neutral-100 dark:bg-neutral-800">
                  <th className="py-2 px-4 text-left">ID</th>
                  <th className="py-2 px-4 text-left">ຊື່ເອກະສານ</th>
                  <th className="py-2 px-4 text-left">ປະເພດ</th>
                  <th className="py-2 px-4 text-left">ວັນທີ</th>
                  <th className="py-2 px-4 text-left">ສະຖານະ</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-neutral-50 dark:bg-neutral-900" : ""}>
                    <td className="py-2 px-4">LND-{1000 + index}</td>
                    <td className="py-2 px-4">ເອກະສານ {index + 1}</td>
                    <td className="py-2 px-4">{["ທີ່ດິນ", "ສັນຍາ", "ໃບອະນຸຍາດ"][index % 3]}</td>
                    <td className="py-2 px-4">{new Date().toLocaleDateString()}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        [
                          "bg-success-light/10 text-success", 
                          "bg-warning-light/10 text-warning", 
                          "bg-info-light/10 text-info"
                        ][index % 3]
                      }`}>
                        {["ສຳເລັດແລ້ວ", "ລໍຖ້າ", "ກຳລັງດຳເນີນການ"][index % 3]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon, className = "" }: StatsCardProps) {
  return (
    <div className={`bg-card-background p-4 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 ${className}`}>
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <h3 className="text-neutral-500 dark:text-neutral-400 text-sm">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Simple Pie Chart Component (mock visualization)
function SimplePieChart() {
  return (
    <div className="relative w-48 h-48 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700">
      <div 
        className="absolute bg-primary" 
        style={{ width: '100%', height: '100%', clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }}
      ></div>
      <div 
        className="absolute bg-success" 
        style={{ width: '100%', height: '100%', clipPath: 'polygon(50% 50%, 0 0, 100% 0)' }}
      ></div>
      <div 
        className="absolute bg-warning" 
        style={{ width: '100%', height: '100%', clipPath: 'polygon(50% 50%, 0 0, 0 100%)' }}
      ></div>
      <div 
        className="absolute bg-danger" 
        style={{ width: '100%', height: '100%', clipPath: 'polygon(50% 50%, 0 100%, 100% 100%)' }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 bg-card-background rounded-full"></div>
      </div>
    </div>
  );
}

// Simple Bar Chart Component (mock visualization)
function SimpleBarChart({ data }: BarChartProps) {
  const maxValue = Math.max(...data.data);
  
  return (
    <div className="flex items-end h-48 w-full space-x-2">
      {data.data.map((value: number, index: number) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div 
            className="w-full bg-primary rounded-t"
            style={{ height: `${(value / maxValue) * 100}%` }}
          ></div>
          <div className="text-xs mt-1">{data.labels[index]}</div>
        </div>
      ))}
    </div>
  );
} 